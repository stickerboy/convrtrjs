import * as tools from '../tools.mjs';
import * as toolkit from '../toolkit.mjs';
import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';

const toolChange = document.getElementById("toolsChange");
toolChange.addEventListener("click", function() {
    let toolsString = document.getElementById("toolsTextarea");

    if (!emptyContainerCheck(toolsString.value, toolsString)) {
        return false;
    }
    if (!largeDataWarning(toolsString.value, toolsString)) {
        return false;
    }

    let textTools = document.getElementById("toolsSelect");
    let chainCommands = document.getElementById("chainCommands");
    let tR = document.getElementById("textResults").textContent;
    let textResults = chainCommands.checked && tR.length > 0 ? tR : toolsString.value;
    let preserveWhitespace = document.getElementById("preserveWhitespace")?.checked;

    // Mapping object for tool functions
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

    // Get the selected tool function
    const selectedTool = toolFunctions[textTools.value];
    if (selectedTool) {
        document.getElementById("textResults").textContent = selectedTool(textResults, preserveWhitespace);
    }
});