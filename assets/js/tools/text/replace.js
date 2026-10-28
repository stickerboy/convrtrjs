import * as toolkit from '../../lib/toolkit.js';
import { bindTool } from '../../ui/tool.js';

bindTool({
    button: "replaceDecode",
    input: "replaceText",
    output: "replaceResults",
    chain: "replaceChain",
    key: [
        { id: "replaceValue", required: "Please provide the characters, words, or phrases you want to replace" },
        { id: "replacementValue", required: "Please provide the new characters, word, or phrases you want to be the replacements" },
    ],
    errorPrefix: "An error occurred trying to replace characters",
    run: (text, oldValue, newValue) => toolkit.replaceChars(text, oldValue, newValue, document.getElementById("replaceCase").checked),
});
