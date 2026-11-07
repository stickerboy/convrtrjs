import { readToolInput } from "./tool.js";
import { showToast } from "./toast.js";
import { getLocalStorageItem, saveLocalStorage } from "./storage.js";
import { countGraphemes } from "../lib/toolkit.js";

// Live typing stops here, where the large data warning starts; the buttons still work up to the 1 million cap
const LIVE_LIMIT = 200000;

const byId = (id) => document.getElementById(id);
// Up to this length, the input is counted on every key; past it, after a short pause, as counting text that isn't
// plain ASCII takes a few milliseconds for every 10,000 characters
const COUNT_NOW_LIMIT = 50000;

/**
 * How many characters text has, counted as they are seen, as the tools themselves count them: an emoji with a skin
 * tone, or a flag, is one character (see countGraphemes).
 *
 * @param {string} text - The text to count.
 * @returns {string} The count, as "1,234 characters".
 */
const characters = (text) => {
    const length = countGraphemes(text);
    return `${length.toLocaleString()} character${length === 1 ? "" : "s"}`;
};

/**
 * A result with a note for the status line, such as what was left out of it. A mode's run can return one, or a promise
 * of one, in place of its result.
 */
class NotedResult {
    /**
     * Keeps a result and its note together.
     *
     * @param {*} result - The result, as the mode would otherwise return it.
     * @param {string} note - What to say about it, or "" for nothing.
     */
    constructor(result, note) {
        this.result = result;
        this.note = note;
    }
}

/**
 * Gives a result with a note for the status line (see NotedResult).
 *
 * @param {*} result - The result.
 * @param {string} note - What to say about it, or "" for nothing.
 * @returns {NotedResult} The result and its note.
 */
export const withNote = (result, note) => new NotedResult(result, note);

/**
 * Says which characters were left out of a result, for a status line: up to five, then "and others".
 *
 * @param {string[]} missing - The characters left out, once each.
 * @param {string} what - What they had none of, e.g. "Braille".
 * @returns {string} "No Braille for "😀", so left out", or "" if nothing was.
 */
export function leftOutNote(missing, what) {
    if (missing.length === 0) {
        return "";
    }
    const list = missing.slice(0, 5).map((char) => `"${char}"`).join(", ");
    return `No ${what} for ${list}${missing.length > 5 ? " and others" : ""}, so left out`;
}

/**
 * Wires up a tool built with the toolFrame macro (macros/tool-frame.njk): its action buttons, live typing, the status
 * line, what the result's header says made it, and "Move to input". Element ids all start with the frame's id: <id>Text, <id>Results, <id>Status,
 * <id>Live.
 *
 * Each action button is also the tool's mode: it's shown as pressed, and live typing reruns the last one used.
 * Pressing a button checks the input as readToolInput does, with toasts; typing reports problems in the status line.
 *
 * @param {object} options
 * @param {string} options.id - The frame's id, usually the page's file slug.
 * @param {{button: string, run: (text: string, ...keys: string[]) => any}[]} options.modes - Each action button's id
 *   and its conversion, which may be async. The first is the mode until another is used. A conversion can return
 *   withNote(result, note) to say something about the result in the status line, such as what was left out.
 * @param {Field|Field[]} [options.key] - Extra fields, such as a cipher key, as readToolInput takes them. A field's
 *   `flow` is how it reads in the flow line: text before its value ("with key" gives "Encrypt with key World"), or
 *   [before, after] (["on", "rails"] gives "Encrypt on 2 rails"). An optional field is left out of the line while empty.
 * @param {string[]} [options.watch] - Ids of other settings the conversion reads, such as switches and dropdowns:
 *   changing one updates the flow line and, with live typing on, runs the tool again.
 * @param {() => Array<string|{value: string}>} [options.flow] - The middle of the flow line, for a tool whose action is
 *   more than its button and fields: text, with {value} for the parts shown in bold. Replaces the fields' `flow`.
 * @param {(result: any, output: HTMLElement) => void} [options.render] - Shows the result, for the "list" and "analysis"
 *   layouts where the output is the tool's own (default: as the result's text). renderResults draws the usual rows.
 * @param {string} [options.moveTab] - With output tabs, the tab "Move to input" always moves, such as the one in the
 *   input's own format (default: the tab showing).
 * @param {string} [options.errorPrefix] - Text shown before an error message, e.g. "Couldn't encrypt".
 * @param {number} [options.limit] - The most characters the tool takes, for a tool whose result gets too big to show
 *   well before the usual 1 million.
 */
export function bindToolFrame({ id, modes, key = [], watch = [], flow: describeFlow, render, moveTab, errorPrefix = "Something went wrong", limit }) {
    const input = byId(`${id}Text`);
    const output = byId(`${id}Results`);
    const status = byId(`${id}Status`);
    const live = byId(`${id}Live`);
    const frame = input.closest("[data-tool-frame]");
    const fields = [key].flat().map((field) => ({ ...field, el: byId(field.id) }));
    const buttons = modes.map((mode) => ({ ...mode, el: byId(mode.button) }));
    let current = buttons[0];

    // The output is a div of text, hidden while it's empty, so a problem empties it rather than leaving an old result
    // showing; or with the "list" and "analysis" layouts, what the tool draws (and counts) itself
    const isResult = output.matches(".tool-pane__result");

    // With output tabs, the tool's run returns a value for each tab, and the result shows the chosen one
    const tabs = [...frame.querySelectorAll("[data-output-tabs] [role=tab]")];
    let results = null;
    let tab = tabs[0]?.dataset.tab;

    const clearOutput = () => {
        results = null;
        output.replaceChildren();
        delete output.dataset.copy;
        frame.querySelector("[data-count-output]").textContent = "";
    };

    // Typing only changes the input, so only its count needs updating then
    const updateCounts = ({ output: withOutput = true } = {}) => {
        frame.querySelector("[data-count-input]").textContent = characters(input.value);
        if (withOutput && isResult && output.textContent !== "") {
            frame.querySelector("[data-count-output]").textContent = characters(output.textContent);
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

    // "Encrypt with key World" in the result's header, saying what made the result, so it only changes when the result does
    const flow = frame.querySelector("[data-flow]");
    const liveHint = frame.querySelector("[data-live-hint]");
    const drawFlow = () => {
        if (!flow) {
            return;
        }
        const bold = (text) => Object.assign(document.createElement("b"), { textContent: text });
        const step = document.createElement("span");
        if (describeFlow) {
            step.append(...describeFlow().map((part) => (typeof part === "string" ? part : bold(part.value || "…"))));
        } else {
            step.append(modeName());
            for (const field of fields.filter((field) => field.flow && (field.required || field.el.value))) {
                const [before, after] = [field.flow].flat();
                step.append(` ${before} `, bold(field.el.value || "…"), after ? ` ${after}` : "");
            }
        }
        flow.replaceChildren(step);
    };
    // The line under Live typing, following the mode
    const describe = () => {
        liveHint.textContent = live.checked ? "Results update as you type" : `Press ${modeName()} to see results`;
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
            if (limit && input.value.length > limit) {
                if (isResult) {
                    clearOutput();
                }
                setStatus(`Too long: this tool takes up to ${limit.toLocaleString()} characters`, { error: true });
                return;
            }
            if (input.value.length > LIVE_LIMIT) {
                setStatus(`Too long to convert as you type: use ${modeName()}`);
                return;
            }
            const problem = fieldProblem();
            if (problem) {
                if (isResult) {
                    clearOutput();
                }
                setStatus(problem.message, { error: true, field: problem.field });
                return;
            }
            text = input.value;
        } else {
            const values = readToolInput({ input: `${id}Text`, key, limit });
            if (!values) {
                if (isResult) {
                    clearOutput();
                }
                setStatus();
                return;
            }
            text = values.text;
        }

        const show = (value) => {
            const { result, note } = value instanceof NotedResult ? value : { result: value, note: "" };
            if (render) {
                render(result, output);
            } else if (tabs.length) {
                results = result;
                output.textContent = results[tab] ?? "";
            } else {
                output.textContent = result;
            }
            drawFlow();
            // The result stays hidden when it's empty, so say so rather than seeming to do nothing
            setStatus(isResult && output.textContent === "" ? ["The result is empty", note].filter(Boolean).join(". ") : note);
        };
        const fail = (error) => {
            if (!typed) {
                showToast("Error", `${errorPrefix}: ${error.message}`, "danger");
            }
            if (isResult) {
                clearOutput();
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
    let countTimer;
    const typed = () => {
        clearTimeout(countTimer);
        if (input.value.length > COUNT_NOW_LIMIT) {
            countTimer = setTimeout(() => updateCounts({ output: false }), 150);
        } else {
            updateCounts({ output: false });
        }
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
    for (const setting of watch.map(byId)) {
        setting.addEventListener("change", () => {
            describe();
            typed();
        });
    }

    // Rows of results (see resultRow) each copy their own value
    output.addEventListener("click", (event) => {
        const button = event.target.closest("[data-copy-result]");
        if (!button) {
            return;
        }
        const row = button.closest(".tool-result");
        navigator.clipboard.writeText(row.dataset.value).then(() => {
            const icon = button.querySelector(".bi");
            icon.classList.replace("bi-clipboard", "bi-clipboard-check-fill");
            status.textContent = `Copied ${row.dataset.label}`;
            setTimeout(() => icon.classList.replace("bi-clipboard-check-fill", "bi-clipboard"), 2000);
        }, () => showToast("Error", "Couldn't copy to the clipboard", "danger"));
    });

    // Output tabs: click, or arrow keys, Home and End, as tabs do; the result shows the chosen tab's
    const selectTab = (button, focus = false) => {
        tab = button.dataset.tab;
        for (const other of tabs) {
            const selected = other === button;
            other.setAttribute("aria-selected", String(selected));
            other.tabIndex = selected ? 0 : -1;
        }
        output.setAttribute("aria-labelledby", button.id);
        if (results) {
            output.textContent = results[tab] ?? "";
            updateCounts();
        }
        if (focus) {
            button.focus();
        }
    };
    for (const button of tabs) {
        button.addEventListener("click", () => selectTab(button));
        button.addEventListener("keydown", (event) => {
            const index = tabs.indexOf(button);
            const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
            if (next !== undefined) {
                event.preventDefault();
                selectTab(tabs[(next + tabs.length) % tabs.length], true);
            }
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

    // "Move to input": moves the result into the input, so the next run builds on it (what "Chain commands" used to do).
    // The input flashes and says where its text came from, so it's clear what happened.
    const inputStatus = byId(`${id}InputStatus`);
    let movedTimer;
    frame.querySelector("[data-use-as-input]")?.addEventListener("click", () => {
        // With tabs, moveTab's result (such as the hex, for a tool whose input is hex), whichever tab is showing
        const moving = tabs.length && moveTab ? (results?.[moveTab] ?? "") : output.textContent;
        if (moving === "") {
            showToast("Warning", "There's no result to move to the input yet", "warning");
            return;
        }
        input.value = moving;
        input.focus();
        input.classList.remove("tool-pane__box--moved");
        void input.offsetWidth; // restart the flash if it's already running
        input.classList.add("tool-pane__box--moved");
        inputStatus.textContent = "Moved from the result";
        clearTimeout(movedTimer);
        movedTimer = setTimeout(() => (inputStatus.textContent = ""), 4000);
        if (live.checked) {
            run(current, { typed: true });
        } else {
            clearOutput();
            setStatus(`Press ${modeName()} to run the tool on it again`);
        }
    });

    setMode(current);
    setStatus();
}

export const escapeHtml = (string) => String(string).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/**
 * Draws a "list" layout's results as labelled rows, each with its own copy button, optionally in groups. Each row reads
 * "Label: value" as text, one per line, so select, copy and download above the list give a tidy list.
 *
 * @param {HTMLElement} output - The frame's results list (<id>Results).
 * @param {Array<{label: string, value: string}>|Array<{name: string, note?: string, rows: Array<{label: string, value: string}>}>} items
 *   Rows, or groups of rows with a heading and an optional note.
 * @param {string} [count] - Shown under the list, e.g. "16 hashes".
 */
export function renderResults(output, items, count = "") {
    output.innerHTML = items.map((item) => (item.rows
        ? `<div class="tool-result-group"><h3 class="tool-result-group__title">${escapeHtml(item.name)}` +
          `${item.note ? ` <small>(${escapeHtml(item.note)})</small>` : ""}</h3>\n${item.rows.map(resultRow).join("")}</div>\n`
        : resultRow(item))).join("");
    output.closest("[data-tool-frame]").querySelector("[data-count-output]").textContent = count;
}

/**
 * One row of results (see renderResults): a label, the value, and a button that copies the value.
 *
 * @param {{label: string, value: string}} row
 * @returns {string} The row's HTML.
 */
export function resultRow({ label, value }) {
    return `<div class="tool-result" data-value="${escapeHtml(value)}" data-label="${escapeHtml(label)}">` +
        `<span class="tool-result__label">${escapeHtml(label)}<span class="visually-hidden">: </span></span>` +
        `<code class="tool-result__value">${escapeHtml(value)}</code>` +
        `<button type="button" class="btn btn-md btn-light" aria-label="Copy ${escapeHtml(label)}" title="Copy" data-copy-result>` +
        `<i class="bi bi-clipboard" aria-hidden="true"></i></button></div>\n`;
}
