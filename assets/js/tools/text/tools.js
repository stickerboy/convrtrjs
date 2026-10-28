import * as tools from '../../lib/strings.js';
import * as toolkit from '../../lib/toolkit.js';
import { bindTool } from '../../ui/tool.js';

// The options in the "toolsSelect" dropdown
const toolFunctions = {
    stripspaces:        (text) => tools.stripSpaces(text),
    stripallwhitespace: (text) => tools.stripSpaces(text, true),
    reverse:            (text) => toolkit.reverseString(text),
    uppercase:          (text) => tools.uppercase(text),
    lowercase:          (text) => tools.lowercase(text),
    numbersonly:        (text, preserveWhitespace) => tools.numbersOnly(text, preserveWhitespace),
    lettersonly:        (text, preserveWhitespace) => tools.lettersOnly(text, preserveWhitespace),
    uppercaseonly:      (text, preserveWhitespace) => tools.lettersOnlyCap(text, preserveWhitespace),
    lowercaseonly:      (text, preserveWhitespace) => tools.lettersOnlyLow(text, preserveWhitespace),
    stripspecialchars:  (text, preserveWhitespace) => tools.stripSpecialChars(text, preserveWhitespace),
    removenumbers:      (text) => tools.stripNumbers(text),
    removeletters:      (text) => tools.stripLetters(text),
    alphabet:           (text) => tools.lettersToNumbers(text),
    specialcharsonly:   (text, preserveWhitespace) => tools.specialCharsOnly(text, preserveWhitespace),
    unique:             (text) => toolkit.uniqueArray(text).join(""),
    urlencode:          (text) => tools.urlEncode(text),
    urldecode:          (text) => tools.urlDecode(text)
};

bindTool({
    button: "toolsChange",
    input: "toolsTextarea",
    output: "textResults",
    chain: "chainCommands",
    run: (text) => {
        const selectedTool = toolFunctions[document.getElementById("toolsSelect").value];
        const preserveWhitespace = document.getElementById("preserveWhitespace")?.checked;
        return selectedTool ? selectedTool(text, preserveWhitespace) : document.getElementById("textResults").textContent;
    },
});
