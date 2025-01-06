import * as tools from '../tools.mjs';
import * as toolkit from '../toolkit.mjs';
import { flipText, stringStats } from './home-fn.mjs';
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';

// Text tools
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
        stripspaces: (text) => tools.stripSpaces(text),
        stripallwhitespace: (text) => tools.stripSpaces(text, true),
        reverse: (text) => toolkit.reverseString(text),
        uppercase: (text) => tools.uppercase(text),
        lowercase: (text) => tools.lowercase(text),
        numbersonly: (text, preserveWhitespace) => tools.numbersOnly(text, preserveWhitespace),
        lettersonly: (text, preserveWhitespace) => tools.lettersOnly(text, preserveWhitespace),
        uppercaseonly: (text, preserveWhitespace) => tools.lettersOnlyCap(text, preserveWhitespace),
        lowercaseonly: (text, preserveWhitespace) => tools.lettersOnlyLow(text, preserveWhitespace),
        stripspecialchars: (text, preserveWhitespace) => tools.stripSpecialChars(text, preserveWhitespace),
        removenumbers: (text) => tools.stripNumbers(text),
        removeletters: (text) => tools.stripLetters(text),
        alphabet: (text) => tools.lettersToNumbers(text),
        specialcharsonly: (text, preserveWhitespace) => tools.specialCharsOnly(text, preserveWhitespace),
        unique: (text) => toolkit.uniqueArray(text).join(""),
        urlencode: (text) => tools.urlEncode(text),
        urldecode: (text) => tools.urlDecode(text)
    };

    // Get the selected tool function
    const selectedTool = toolFunctions[textTools.value];
    if (selectedTool) {
        document.getElementById("textResults").textContent = selectedTool(textResults, preserveWhitespace);
    }
});


// Flip text upside down
const flipButton = document.getElementById("flipDecode");
flipButton.addEventListener("click", function() {
    const flipString = document.getElementById("flipText");

    if(!emptyContainerCheck(flipString.value, flipString)) {
        document.getElementById("flipResults").textContent = "";
        return false;
    }
    if (!largeDataWarning(flipString.value, flipString)) {
        return false;
    }

    let flipDirection = document.getElementById("flipDirection");
    document.getElementById("flipResults").textContent = flipDirection.checked ? 
                                                         flipText(flipString.value) : 
                                                         toolkit.reverseString(flipText(flipString.value));
});


// Frequencies
const freqButton = document.getElementById("frequenciesDecode");
freqButton.addEventListener("click", function() {
    const freqString = document.getElementById("frequenciesText");
    const freqResults = document.getElementById("frequenciesResults");
    freqResults.innerHTML = "";

    if (!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    // Stats to display
    const stats = [
        { label: "Word count", stat: "word-count" },
        { label: "Character count", stat: "char-count" },
        { label: "Character count (no spaces)", stat: "char-count-ns" },
        { label: "Letter count", stat: "letter-count" },
        { label: "Letter count (only capitals)", stat: "letter-count-caps" },
        { label: "Letter count (only lowercase)", stat: "letter-count-low" },
        { label: "Number count", stat: "number-count" },
        { label: "Special character count", stat: "special-count" },
        { label: "Special character count (no spaces)", stat: "special-count-ns" }
    ];

    // Insert each stat result
    stats.forEach(({ label, stat }) => {
        freqResults.insertAdjacentHTML(
            "beforeend",
            `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3">
                <span class="display-6 fs-5">${label}</span>&nbsp;<br />
                <code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                    ${stringStats(freqString.value, stat)}
                </code>&nbsp;<br />
            </div>`
        );
    });

    freqResults.insertAdjacentHTML(
        "beforeend",
        `${toolkit.styledUniqueArrayItems(toolkit.uniqueArray(freqString.value))}`
    );
    freqResults.insertAdjacentHTML(
        "beforeend",
        `${toolkit.styledArrayFrequencies(toolkit.countArrayFreq(freqString.value), "Unique character frequencies")}`
    );
});



// Replace characters
const replaceButton = document.getElementById("replaceDecode");
replaceButton.addEventListener("click", function() {
    const replaceString = document.getElementById("replaceText");
    const replaceOld = document.getElementById("replaceValue");
    const replaceNew = document.getElementById("replacementValue");

    if(!emptyContainerCheck(replaceString.value, replaceString)) {
        return false;
    }
    if(!emptyContainerCheck(replaceOld.value, replaceOld, "Please provide the characters, words, or phrases you want to replace")) {
        return false;
    }
    if(!emptyContainerCheck(replaceNew.value, replaceNew, "Please provide the new characters, word, or phrases you want to be the replacements")) {
        return false;
    }
    if (!largeDataWarning(replaceString.value, replaceString)) {
        return false;
    }

    let chainReplacements = document.getElementById("replaceChain");
    let replaceCase = document.getElementById("replaceCase").checked;
    let replaceResults = document.getElementById("replaceResults");

    if(chainReplacements.checked && replaceResults.textContent.length > 0) {
        try {
            toolkit.replaceChars(replaceResults.textContent, replaceOld.value, replaceNew.value, replaceCase)
        } catch (e) {
            showToast("Error", `An error occurred trying to replace characters: ${e.message}`, "danger");
            return;
        }
        replaceResults.textContent = toolkit.replaceChars(replaceResults.textContent, replaceOld.value, replaceNew.value, replaceCase);
    } else {
        try {
            toolkit.replaceChars(replaceString.value, replaceOld.value, replaceNew.value, replaceCase)
        } catch (e) {
            showToast("Error", `An error occurred trying to replace characters: ${e.message}`, "danger");
            return;
        }
        replaceResults.textContent = toolkit.replaceChars(replaceString.value, replaceOld.value, replaceNew.value, replaceCase);
    }
});