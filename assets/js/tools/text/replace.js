import * as toolkit from '../../lib/toolkit.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

const oldValue = document.getElementById("replaceValue");
const newValue = document.getElementById("replacementValue");
const matchCase = document.getElementById("replaceCase");

bindToolFrame({
    id: "replace",
    modes: [{ button: "replaceRun", run: (text, from, to) => toolkit.replaceChars(text, from, to, matchCase.checked) }],
    key: [
        { id: "replaceValue", required: "Please provide the characters, words, or phrases you want to replace" },
        { id: "replacementValue", required: "Please provide the new characters, word, or phrases you want to be the replacements" },
    ],
    watch: ["replaceCase"],
    flow: () => ["Replace ", { value: oldValue.value }, " with ", { value: newValue.value }, matchCase.checked ? ", matching case" : ""],
    errorPrefix: "Couldn't replace the characters",
});
