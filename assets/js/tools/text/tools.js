import * as tools from '../../lib/strings.js';
import * as toolkit from '../../lib/toolkit.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

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

const select = document.getElementById("toolsSelect");
const preserve = document.getElementById("toolsPreserveWhitespace");
// Tools marked with an asterisk can keep spaces
const chosen = () => select.selectedOptions[0];
const keepsSpaces = () => preserve.checked && chosen().textContent.includes("*");

bindToolFrame({
    id: "tools",
    modes: [{
        button: "toolsRun",
        run: (text) => {
            const tool = toolFunctions[select.value];
            if (!tool) {
                throw new Error(`There's no tool called "${select.value}"`);
            }
            return tool(text, preserve.checked);
        },
    }],
    watch: ["toolsSelect", "toolsPreserveWhitespace"],
    flow: () => [{ value: chosen().textContent.replace("*", "").trim() }, keepsSpaces() ? ", keeping spaces and line breaks" : ""],
    errorPrefix: "Couldn't run the text tool",
});
