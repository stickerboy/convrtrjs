import { readToolInput } from "./tool.js";
import { showToast } from "./toast.js";
import { getLocalStorageItem, saveLocalStorage } from "./storage.js";

// Live typing stops here, where the large data warning starts; the buttons still work up to the 1 million cap
const LIVE_LIMIT = 200000;

const byId = (id) => document.getElementById(id);
const characters = (length) => `${length.toLocaleString()} character${length === 1 ? "" : "s"}`;

/**
 * Wires up a tool built with the toolFrame macro (macros/tool-frame.njk): its action buttons, live typing, the status
 * line, the flow line and "Move to input". Element ids all start with the frame's id: <id>Text, <id>Results, <id>Status,
 * <id>Live.
 *
 * Each action button is also the tool's mode: it's shown as pressed, and live typing reruns the last one used.
 * Pressing a button checks the input as readToolInput does, with toasts; typing reports problems in the status line.
 *
 * @param {object} options
 * @param {string} options.id - The frame's id, usually the page's file slug.
 * @param {{button: string, run: (text: string, ...keys: string[]) => any}[]} options.modes - Each action button's id
 *   and its conversion, which may be async. The first is the mode until another is used.
 * @param {Field|Field[]} [options.key] - Extra fields, such as a cipher key, as readToolInput takes them. A field's
 *   `flow` is how it reads in the flow line: text before its value ("with key" gives "Encrypt with key World"), or
 *   [before, after] (["on", "rails"] gives "Encrypt on 2 rails"). An optional field is left out of the line while empty.
 * @param {(result: any, output: HTMLElement) => void} [options.render] - Shows the result, for the "list" layout where
 *   the output is the tool's own list (default: as the output box's text).
 * @param {string} [options.errorPrefix] - Text shown before an error message, e.g. "Couldn't encrypt".
 */
export function bindToolFrame({ id, modes, key = [], render, errorPrefix = "Something went wrong" }) {
    const input = byId(`${id}Text`);
    const output = byId(`${id}Results`);
    const status = byId(`${id}Status`);
    const live = byId(`${id}Live`);
    const frame = input.closest("[data-tool-frame]");
    const fields = [key].flat().map((field) => ({ ...field, el: byId(field.id) }));
    const buttons = modes.map((mode) => ({ ...mode, el: byId(mode.button) }));
    let current = buttons[0];

    // The output is a box of text, or with the "list" layout, a list the tool draws (and counts) itself
    const isBox = output instanceof HTMLTextAreaElement;
    const outputText = () => (isBox ? output.value : output.textContent);
    const clearOutput = () => {
        if (isBox) {
            output.value = "";
        } else {
            output.replaceChildren();
            frame.querySelector("[data-count-output]").textContent = "";
        }
    };

    const updateCounts = () => {
        frame.querySelector("[data-count-input]").textContent = characters(input.value.length);
        if (isBox) {
            frame.querySelector("[data-count-output]").textContent = characters(output.value.length);
        }
    };

    const setStatus = (message = "", { error = false, field = null } = {}) => {
        status.textContent = message;
        status.classList.toggle("text-danger", error);
        for (const { el } of fields) {
            el.setAttribute("aria-invalid", String(error && el === field));
        }
        updateCounts();
    };

    const modeName = () => current.el.textContent.trim();

    // "Input → Encrypt with key World → Output", and the line under Live typing, both following the mode and fields
    const flow = frame.querySelector("[data-flow]");
    const liveHint = frame.querySelector("[data-live-hint]");
    const describe = () => {
        liveHint.textContent = live.checked ? "Results update as you type" : `Press ${modeName()} to see results`;
        if (!flow) {
            return;
        }
        const arrow = () => Object.assign(document.createElement("i"), { className: "bi bi-arrow-right" });
        const bold = (text) => Object.assign(document.createElement("b"), { textContent: text });
        const step = document.createElement("span");
        step.append(modeName());
        for (const field of fields.filter((field) => field.flow && (field.required || field.el.value))) {
            const [before, after] = [field.flow].flat();
            step.append(` ${before} `, bold(field.el.value || "…"), after ? ` ${after}` : "");
        }
        flow.replaceChildren(bold("Input"), arrow(), step, arrow(), bold("Output"));
    };

    // A tool with one action has no mode to show, so its button stays an ordinary button
    const setMode = (mode) => {
        current = mode;
        for (const button of buttons.length > 1 ? buttons : []) {
            const pressed = button === mode;
            button.el.setAttribute("aria-pressed", String(pressed));
            button.el.classList.toggle("btn-convrtr", pressed);
            button.el.classList.toggle("btn-outline-convrtr", !pressed);
        }
        describe();
    };

    // A field that's empty when it's required, or doesn't match its pattern, and what to say about it
    const fieldProblem = () => {
        for (const field of fields) {
            const value = field.el.value;
            if (field.required && value.trim() === "") {
                return { field: field.el, message: field.required };
            }
            if (field.pattern && value.length > 0 && !field.pattern.test(value)) {
                return { field: field.el, message: field.invalid };
            }
        }
        return null;
    };

    const run = (mode, { typed = false } = {}) => {
        let text;
        if (typed) {
            if (input.value.trim() === "") {
                clearOutput();
                setStatus();
                return;
            }
            if (input.value.length > LIVE_LIMIT) {
                setStatus(`Too long to convert as you type: use ${modeName()}`);
                return;
            }
            const problem = fieldProblem();
            if (problem) {
                setStatus(problem.message, { error: true, field: problem.field });
                return;
            }
            text = input.value;
        } else {
            const values = readToolInput({ input: `${id}Text`, key });
            if (!values) {
                setStatus();
                return;
            }
            text = values.text;
        }

        const show = (result) => {
            if (render) {
                render(result, output);
            } else {
                output.value = result;
            }
            setStatus();
        };
        const fail = (error) => {
            if (!typed) {
                showToast("Error", `${errorPrefix}: ${error.message}`, "danger");
            }
            setStatus(`${errorPrefix}: ${error.message}`, { error: true });
        };
        try {
            const result = mode.run(text, ...fields.map((field) => field.el.value));
            result instanceof Promise ? result.then(show, fail) : show(result);
        } catch (error) {
            fail(error);
        }
    };

    for (const mode of buttons) {
        mode.el.addEventListener("click", () => {
            setMode(mode);
            run(mode);
        });
    }

    // Live typing waits for a short pause, so long text isn't converted on every key
    let timer;
    const typed = () => {
        updateCounts();
        if (live.checked) {
            clearTimeout(timer);
            timer = setTimeout(() => run(current, { typed: true }), 150);
        }
    };
    input.addEventListener("input", typed);
    for (const { el } of fields) {
        el.addEventListener("input", () => {
            describe();
            typed();
        });
    }

    // One live typing setting for every tool with a frame, remembered between visits
    live.checked = getLocalStorageItem("toolsLive") === "on";
    live.addEventListener("change", () => {
        saveLocalStorage("toolsLive", "Live typing", live.checked ? "on" : "off", "Whether tools convert as you type");
        describe();
        if (live.checked) {
            run(current, { typed: true });
        }
    });

    // "Move to input" (the panes layout): moves the output into the input, so the next run builds on it (what "Chain
    // commands" used to do). The input flashes and says where its text came from, so it's clear what happened.
    const inputStatus = byId(`${id}InputStatus`);
    let movedTimer;
    frame.querySelector("[data-use-as-input]")?.addEventListener("click", () => {
        if (outputText() === "") {
            showToast("Warning", "There's no output to move to the input yet", "warning");
            return;
        }
        input.value = output.value;
        input.focus();
        input.classList.remove("tool-pane__box--moved");
        void input.offsetWidth; // restart the flash if it's already running
        input.classList.add("tool-pane__box--moved");
        inputStatus.textContent = "Moved from the output";
        clearTimeout(movedTimer);
        movedTimer = setTimeout(() => (inputStatus.textContent = ""), 4000);
        if (live.checked) {
            run(current, { typed: true });
        } else {
            output.value = "";
            setStatus(`Press ${modeName()} to run the tool on it again`);
        }
    });

    setMode(current);
    setStatus();
}
