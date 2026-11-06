import { replaceText, regex101Link } from '../../lib/text/replace.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

const oldValue = document.getElementById("replaceValue");
const newValue = document.getElementById("replacementValue");
const matchCase = document.getElementById("replaceCase");
const useRegex = document.getElementById("replaceRegex");
const regexHint = document.getElementById("replaceRegexHint");
const regexNote = document.getElementById("replaceRegex101Note");
const regexLink = document.getElementById("replaceRegex101");

// How long a pattern can run before it's stopped
const TIME_LIMIT = 2000;

let worker = null;
let pending = null;
let nextId = 0;

/**
 * Stops the worker, and with it any replace it's running. The replace's promise is left unsettled: it's either been
 * replaced by a newer one, whose result is the one to show, or has already been rejected for taking too long.
 *
 * @returns {void}
 */
function stopWorker() {
    worker?.terminate();
    worker = null;
    if (pending) {
        clearTimeout(pending.timer);
        pending = null;
    }
}

/**
 * Replaces with a pattern in a worker, so a pattern that would take minutes can be stopped after TIME_LIMIT instead
 * of freezing the page. A newer replace stops an older one still running.
 *
 * @param {string} text - The text to replace in.
 * @param {string} pattern - The pattern.
 * @param {string} replacement - What to put in place of each match.
 * @param {boolean} caseSensitive - Whether capitals and lowercase letters must match exactly.
 * @returns {Promise<string>} The text with every match replaced.
 */
function replaceInWorker(text, pattern, replacement, caseSensitive) {
    if (pending) {
        stopWorker();
    }
    worker ??= new Worker(new URL("../../workers/replace.js", import.meta.url), { type: "module" });
    const id = ++nextId;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            stopWorker();
            reject(new Error(`This pattern took over ${TIME_LIMIT / 1000} seconds, so it was stopped. This usually means a repeat inside a repeat, such as (a+)+, which can try a huge number of ways to match`));
        }, TIME_LIMIT);
        pending = { id, timer };
        worker.onmessage = ({ data }) => {
            if (data.id !== pending?.id) {
                return;
            }
            clearTimeout(timer);
            pending = null;
            data.error === undefined ? resolve(data.result) : reject(new Error(data.error));
        };
        worker.onerror = (event) => {
            event.preventDefault();
            stopWorker();
            reject(new Error("The pattern couldn't be run"));
        };
        worker.postMessage({ id, text, pattern, replacement, caseSensitive });
    });
}

/**
 * Shows the regex guidance and the regex101 link while Regex is on, and points the link at the pattern and New as
 * they're typed, so it works even when the pattern doesn't.
 *
 * @returns {void}
 */
function updateRegexHint() {
    regexHint.hidden = !useRegex.checked;
    regexNote.hidden = !useRegex.checked;
    regexLink.href = regex101Link(oldValue.value, newValue.value, matchCase.checked);
}

for (const el of [oldValue, newValue]) {
    el.addEventListener("input", updateRegexHint);
}
for (const el of [useRegex, matchCase]) {
    el.addEventListener("change", updateRegexHint);
}
updateRegexHint();

// Plain text is replaced exactly as typed, right away; a pattern is run in the worker
bindToolFrame({
    id: "replace",
    modes: [{
        button: "replaceRun",
        run: (text, from, to) => (useRegex.checked
            ? replaceInWorker(text, from, to, matchCase.checked)
            : replaceText(text, from, to, matchCase.checked)),
    }],
    key: [
        { id: "replaceValue", required: "Please provide the characters, words, or phrases you want to replace" },
        // Left empty, what matches is removed
        { id: "replacementValue" },
    ],
    watch: ["replaceCase", "replaceRegex"],
    flow: () => [
        ...(newValue.value === ""
            ? [useRegex.checked ? "Remove pattern " : "Remove ", { value: oldValue.value }]
            : [useRegex.checked ? "Replace pattern " : "Replace ", { value: oldValue.value }, " with ", { value: newValue.value }]),
        matchCase.checked ? ", matching case" : "",
    ],
    errorPrefix: "Couldn't replace the characters",
});
