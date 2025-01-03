import * as tools from '../tools.mjs';
import * as toolkit from '../toolkit.mjs';
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';

/**
 * Checks for a valid binary string length (multiple of 8)
 *
 * @param {string} string - The binary string to validate.
 * @returns {boolean} - `true` if the length is valid, otherwise `false`.
 * @throws {Error} - If the input is not a valid binary string.
 */
export function isValidBinaryLength(string) {
    return tools.numbersOnly(string).length % 8 === 0;
}

/**
 * Converts a valid binary string to its corresponding ASCII string
 *
 * @param {string} string - The binary string to convert.
 * @returns {string} - The resulting ASCII string.
 * @throws {Error} - If the input is not a valid binary string.
 */
export function binaryToString(string) {
    if(isValidBinaryLength(string)) {
        string = string.replace(/[^10\s]/g, "");

        let charCodes = string.split(" ").map(bin => {
            bin = bin.padStart(8, "0");
            return parseInt(bin, 2);
        });

        return String.fromCharCode(...charCodes);
    } else {
        throw new Error("Not a valid Binary string, length is not divisible by 8");
    }
}

/**
 * Converts a Base64 encoded string to a regular string.
 * @param {string} base64 - The Base64 encoded string.
 * @returns {string} - The decoded string.
 * @throws {Error} - If the input is not a valid Base64 string.
 */
export function base64ToString(base64) {
    try {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error("Not a valid Base64 string");
    }
}

/**
 * Converts Morse code to string
 *
 * @param {string} string - The Morse code string to convert.
 * @returns {string} - The resulting plain text string.
 * @throws {Error} - If the input contains invalid Morse code characters.
 */
export function morseToString(string) {
    if (!/^[\s./-]*$/.test(string)) {
        throw new Error("Morse code contains invalid characters");
    }

    return string
        .split(" / ")
        .map(word => word
            .split(" ")
            .map(character => toolkit.morseTextDict[character])
            .join("")
        )
        .join(" ")
        .trim();
}

/**
 * Converts a string to Morse code
 *
 * @param {string} string - The input string to be converted.
 * @returns {string} - The Morse code representation of the input string.
 * 
 * @example
 * // Input: "hello world"
 * // Output: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
 */
export function stringToMorse(string) {
    return string
        .toUpperCase()
        .split(" ")
        .map(word => word
            .split("")
            .map(character => toolkit.textMorseDict[character] || "")
            .join(" ")
        )
        .join(" / ")
        .trim();
}

/**
 * Converts a string to Morsenary code (binary-based Morse code)
 *
 * @param {string} string - The input string to be converted.
 * @returns {string} - The Morsenary code representation of the input string.
 *
 * @example
 * // Input: "hello world" with default setting
 * // Output: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
 * // Input: "hello world" with custom setting (e.g., "default" or "reverse")
 * // Output: "01001000 01000101 01001100 01001100 01001111 00101100 00100000 01010111 01001111 01010010 01001100 01000100"
 */
export function stringToMorsenary(string) {
    const morsenarySetting = document.getElementById("morsenarySetting").value;
    const binaryString = toolkit.stringToBinary(string).replace(/ /g, '');

    return binaryString.replace(/[01]/g, match => {
        if (morsenarySetting === "default") {
            return match === '1' ? '-' : '.';
        } else {
            return match === '1' ? '.' : '-';
        }
    });
}

/**
 * Converts Morsenary code (binary-based Morse code) back to a string
 *
 * @param {string} string - The Morsenary code to be converted.
 * @returns {string} - The original plaintext string.
 *
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "01001000 01000101 01001100 01001100 01001111 00101100 00100000 01010111 01001111 01010010 01001100 01000100" with default setting
 * // Output: "hello, world"
 */
export function morsenaryToString(string) {
    if (!/^[\s./-]*$/.test(string)) {
        throw new Error("Morsenary contains invalid characters");
    }

    const morsenarySetting = document.getElementById("morsenarySetting").value;

    // Replace Morsenary code with binary representation
    const binaryString = string.replace(/[.-]/g, match => {
        if (morsenarySetting === "default") {
            return match === '.' ? '0' : '1';
        } else {
            return match === '.' ? '1' : '0';
        }
    });

    // Convert binary string back to text
    return binaryToString(binaryString.match(/.{1,8}/g).join(" "));
}

/**
 * Flips text upside down (custom alphabet mapping).
 *
 * @param {string} string - The input string to be flipped.
 * @param {string} [alphabet=alphabet] - The original alphabet (e.g., "abcdefghijklmnopqrstuvwxyz").
 * @param {string} [replacement=alphaFlip] - A string of replacement characters corresponding to each character in the alphabet.
 * @returns {string} - The flipped string.
 *
 * @example
 * // Input: "hello, world" with custom alphabet "abcdefghijklmnopqrstuvwxyz" and replacement string "z...a"
 * // Output: "pןɹoʍ oןןǝɥ"
 */
export function flipText(string, originalAlphabet = toolkit.alphabet, replacement = toolkit.alphaFlip) {
    const flipMap = Object.fromEntries([...originalAlphabet].map((char, index) => [char, replacement[index]]));
    return [...string].map(c => flipMap[c] || c).reverse().join('');
}

/**
 * Provides various information about a given string based on the specified stat
 *
 * @param {string} string - The input string to analyze.
 * @param {string} stat - The type of information to retrieve / statistic to calculate (e.g., "word-count", "char-count", etc.).
 * @param {string} delimiter - Optional delimiter used for splitting words or characters.
 * @returns {number|string} - The calculated statistic or an error message if the stat is not available.
 *
 * @example
 * // Input: "Hello, world!", stat: "word-count", delimiter: " "
 * // Output: 2
 */
function stringStats(string, stat, delimiter = " ") {
    // Mapping object for statistic functions
    const statFunctions = {
        "word-count": str => str.split(delimiter).length,
        "char-count": str => str.length,
        "char-count-ns": str => tools.stripSpaces(str).length,
        "letter-count": str => tools.lettersOnly(str).length,
        "letter-count-caps": str => tools.lettersOnlyCap(str, true).length,
        "letter-count-low": str => tools.lettersOnlyLow(str).length,
        "number-count": str => tools.numbersOnly(str).length,
        "special-count": str => tools.specialCharsOnly(str, true).length,
        "special-count-ns": str => tools.specialCharsOnly(str).length
    };

    // Get the selected stat function
    const selectedStatFunction = statFunctions[stat];
    return selectedStatFunction ? selectedStatFunction(string) : "No statistic specified or statistic is not available";
}


// Re-code Hex on delimiter change
let hexDelimiterSelect = document.getElementById("convrtrsDelimiter");
hexDelimiterSelect.addEventListener("change", function() {
    let hexData = document.getElementById("form-hex").value;
    if(hexData === "") {
        return;
    }
    document.getElementById("encode").click();
});

// Re-code Morsenary on delimiter change
let morsenarySelect = document.getElementById("morsenarySetting");
morsenarySelect.addEventListener("change", function() {
    let morsenaryData = document.getElementById("form-morsenary").value;
    if(morsenaryData === "") {
        return;
    }
    document.getElementById("mrsnryDecode").click();
});


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