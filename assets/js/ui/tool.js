import { emptyContainerCheck, largeDataWarning } from "./input.js";
import { showToast } from "./toast.js";

const byId = (id) => (id ? document.getElementById(id) : null);

/**
 * Reads and checks a tool's input: not empty, not too large, and any extra fields (keys) present and valid.
 * When the "chain" checkbox is ticked and there's already a result, the result is used as the input instead.
 *
 * @param {object} options
 * @param {string} options.input - id of the input textarea.
 * @param {string} [options.output] - id of the result element (needed for chaining).
 * @param {string} [options.chain] - id of the "chain commands" checkbox.
 * @param {Field|Field[]} [options.key] - Extra field(s), e.g. a cipher key, checked in order.
 * @typedef {{id: string, required?: string, pattern?: RegExp, invalid?: string}} Field - `required` is the message shown
 *   if it's empty (omit for an optional field); `pattern`/`invalid` validate a non-empty value.
 * @returns {{text: string, keys: string[], key: string}|null} - The text to process and the field values (`key` is the
 *   first), or null if a check failed (a toast is shown).
 */
export function readToolInput({ input, output, chain, key }) {
    const inputEl = byId(input);
    const fields = [key ?? []].flat().map((field) => ({ ...field, el: byId(field.id) }));

    if (!emptyContainerCheck(inputEl.value, inputEl)) {
        return null;
    }
    for (const field of fields) {
        if (field.required && !emptyContainerCheck(field.el.value, field.el, field.required)) {
            return null;
        }
    }
    if (!largeDataWarning(inputEl.value, inputEl)) {
        return null;
    }
    for (const field of fields) {
        if (field.pattern && field.el.value.length > 0 && !field.pattern.test(field.el.value)) {
            showToast("Error", field.invalid, "danger");
            return null;
        }
    }

    const previous = byId(output)?.textContent ?? "";
    const text = byId(chain)?.checked && previous.length > 0 ? previous : inputEl.value;
    const keys = fields.map((field) => field.el.value);
    return { text, keys, key: keys[0] ?? "" };
}

/**
 * Wires up a tool's button: checks the input (see readToolInput), runs the conversion and shows the result.
 * Errors thrown by `run` are shown as a toast.
 *
 * @param {object} options - Everything readToolInput takes, plus:
 * @param {string} options.button - id of the button that runs the tool (nothing happens if it's not on the page).
 * @param {(text: string, ...keys: string[]) => any} options.run - The conversion; may be async.
 * @param {(result: any, output: HTMLElement) => void} [options.render] - Shows the result (default: as the output's text).
 * @param {boolean} [options.clear] - Empty the output when a check fails.
 * @param {string} [options.errorPrefix] - Text shown before the error message, e.g. "An error occurred trying to encrypt the string".
 */
export function bindTool({ button, run, render, clear, errorPrefix, ...options }) {
    byId(button)?.addEventListener("click", () => {
        const output = byId(options.output);
        const values = readToolInput(options);
        if (!values) {
            if (clear) {
                output.innerHTML = "";
            }
            return;
        }

        const show = (result) => (render ? render(result, output) : (output.textContent = result));
        const fail = (error) => showToast("Error", errorPrefix ? `${errorPrefix}: ${error.message}` : error.message, "danger");
        try {
            const result = run(values.text, ...values.keys);
            // Show synchronous results straight away; only async conversions (e.g. hashing) wait
            result instanceof Promise ? result.then(show, fail) : show(result);
        } catch (error) {
            fail(error);
        }
    });
}
