/**
 * Checks for a valid binary string length (multiple of 8)
 *
 * @param {string} string - The binary string to validate.
 * @returns {boolean} - `true` if the length is valid, otherwise `false`.
 * @throws {Error} - If the input is not a valid binary string.
 */
function isValidBinaryLength(string) {
    return string.length % 8 === 0;
}

/**
 * Converts a valid binary string to its corresponding ASCII string
 *
 * @param {string} string - The binary string to convert.
 * @returns {string} - The resulting ASCII string.
 * @throws {Error} - If the input is not a valid binary string.
 */
function binaryToString(string) {
    if(isValidBinaryLength(string)) {
        string = string.replace(/[^10\s]/g, "");

        let charCodes = string.split(" ").map(bin => {
            bin = bin.padStart(8, "0");
            return parseInt(bin, 2);
        });

        return String.fromCharCode(...charCodes);
    } else {
        throw new Error("Not a valid Binary string");
    }
}

/**
 * Converts a Base64-encoded string to its original decoded string
 * Going backwards: from bytestream, to percent-encoding, to original string
 * // https://stackoverflow.com/a/30106551/3172872
 *
 * @param {string} string - The Base64-encoded string.
 * @returns {string} - The decoded original string.
 * @throws {Error} - If the input is not a valid Base64 string.
 */
function base64ToString(string) {
    // 
    try {
        return decodeURIComponent(atob(string).split("").map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
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
function morseToString(string) {
    if(/^[ /.-]*$/.test(string)){
        return string // test valid morse
            .replaceAll(" / "," ")
            .split(" ")
            .map(word => word
                        .split(" ") // get character code,
                        .map(character => morseTextDict[character])
                        .join("")
            )
            .join(" ")
            .trim();
    } else {
        throw new Error("Morse code contains invalid characters");
    }
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
function stringToMorse(string) {
    return string
            .toLocaleUpperCase()
            .split(" ")
            .map(word => word
                        .split("") // get character code,
                        .map(character => textMorseDict[character])
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
function stringToMorsenary(string) {
    let morsenarySetting = document.getElementById("morsenarySetting").value;
    return morsenarySetting === "default" ? stringToBinary(string).replace(/ /g, '').replace(/[01]/g, (match) => (match === '1' ? '-' : '.')) :
    stringToBinary(string).replace(/ /g, '').replace(/[01]/g, (match) => (match === '1' ? '.' : '-'));
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
function morsenaryToString(string) {
    if(/^[ /.-]*$/.test(string)) {
        let morsenarySetting = document.getElementById("morsenarySetting").value;
        string = morsenarySetting === "default" ? string.replace(/[.-]/g, (match) => (match === '.' ? '0' : '1')) : string.replace(/[.-]/g, (match) => (match === '.' ? '1' : '0'));
        return binaryToString(splitString(string, 8));
    } else {
       throw new Error("Morsenary contains invalid characters");
    }
}

/**
 * Flips text upside down (custom alphabet mapping)
 *
 * @param {string} string - The input string to be flipped.
 * @param {string} alphabet - The original alphabet (e.g., "abcdefghijklmnopqrstuvwxyz").
 * @param {string[]} replacement - An array of replacement characters corresponding to each character in the alphabet.
 * @returns {string} - The flipped string.
 *
 * @example
 * // Input: "hello, world" with custom alphabet "abcdefghijklmnopqrstuvwxyz" and replacement array ["z", "y", "x", ...]
 * // Output: "pןɹoʍ oןןǝɥ"
 */
function flipText(string, alphabet, replacement) {
	return Array.from(string).map(c => 
        typeof replacement[alphabet.search(c)] == "undefined" ? " " : replacement[alphabet.search(c)]
    ).join("");
}

/**
 * Provides various information about a given string based on the specified stat
 *
 * @param {string} string - The input string to analyze.
 * @param {string} stat - The type of information to retrieve (e.g., "word-count", "char-count", etc.).
 * @param {string} delimiter - Optional delimiter used for splitting words or characters.
 * @returns {number|string} - The requested statistic or an error message if the stat is not available.
 *
 * @example
 * // Input: "Hello, world!", stat: "word-count", delimiter: " "
 * // Output: 2
 */
function stringStats(string, stat, delimiter) {
    let split = delimiter ? delimiter : " ";

    switch (stat) {
        case "word-count":
            return string.split(split).length;
        break;
        case "char-count":
            return string.length;
        break;
        case "char-count-ns":
            return stripSpaces(string).length;
        break;
        case "letter-count":
            return lettersOnly(string).length;
        break;
        case "letter-count-caps":
            return lettersOnlyCap(string, true).length;
        break;
        case "letter-count-low":
            return lettersOnlyLow(string).length;
        break;
        case "number-count":
            return numbersOnly(string).length;
        break;
        case "special-count":
            return specialCharsOnly(string, true).length;
        break;
        case "special-count-ns":
            return specialCharsOnly(string).length;
        break;
        default:
            return "No stat specified or stat is not available";
    }
}

/**
 * Creates styled HTML elements for displaying unique characters from an array.
 *
 * @param {string[]} data - An array of unique characters.
 * @returns {string} - The HTML representation of the unique characters.
 *
 * @example
 * // Input: ["a", "b", "c"]
 * // Output: "<div class="g-col-12"> ..."
 */
function styledUniqueArrayItems(data) {
    let result = `<div class="g-col-12"><p class="display-5 fs-5 mt-4">Unique chracters</p>
    <div class="grid mt-2 grid-auto" id="unique-chars">`;
    data.forEach(char => {
        result += `<code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2 me-2" style="width: max-content;" aria-label="${char.replace(/ /g, "Space")}" title="${char.replace(/ /g, "Space")}">
                ${char.replace(/ /g, "&nbsp;")}
            </code>`;
    });
    result += `</div></div>`;
    return result;
}

/**
 * Simple and efficient method of returning frequency counts of each unique value in an array
 * https://stackoverflow.com/a/66002712/3172872
 *
 * @param {string} string - The input string to analyze.
 * @returns {Object} - An object where keys represent unique values and values represent their frequencies.
 *
 * @example
 * // Input: "hello, world!"
 * // Output: { h: 1, e: 1, l: 3, o: 2, ',': 1, ' ': 1, w: 1, r: 1, d: 1, '!': 1 }
 */
function countArrayFreq(string) {
    let split = [...string];
    return split.reduce((split, curr) => (split[curr] = (split[curr] || 0) + 1, split), {});
}

/**
 * Creates styled HTML elements for displaying unique character frequencies.
 *
 * @param {Object} data - An object containing unique characters as keys and their frequencies as values.
 * @returns {string} - The HTML representation of the unique character frequencies.
 *
 * @example
 * // Input: { h: 1, e: 1, l: 3, o: 2, ',': 1, ' ': 1, w: 1, r: 1, d: 1, '!': 1 }
 * // Output: "<div class="g-col-12"> ..."
 */
function styledArrayFrequencies(data) {
    let result = `<div class="g-col-12"><p class="display-5 fs-5 mt-4">Unique character frequencies</p>
    <div class="grid mt-2" id="unique-freqs">`;
    for (let [key, value] of Object.entries(data)) {
        result += `<div class="g-col-4 g-col-md-3 g-col-lg-2 g-col-xxl-1"><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2 me-2" style="width: max-content;" aria-label="Frequency of ${key.replace(/ /g, "Space")}" title="Frequency of ${key.replace(/ /g, "Space")}">
                ${key.replace(/ /g, "Space")} - ${value}
            </code></div>`;
    }
    result += `</div></div>`;
    return result;
}

// Re-code Hex on delimiter change
let hexDelimiterSelect = document.getElementById("hexDelimiter");
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
const toolChange = document.getElementById("toolChange");
toolChange.addEventListener("click", function() {
    let toolsString = document.getElementById("toolsTextarea");

    if(!emptyContainerCheck(toolsString.value, toolsString)) {
        return false;
    }
    if (!largeDataWarning(toolsString.value, toolsString)) {
        return false;
    }

    let textTools = document.getElementById("textToolsSelect");
    let chainCommands = document.getElementById("chainCommands");
    let tR = document.getElementById("textResults").textContent
    let textResults = chainCommands.checked && tR.length > 0 ? tR : toolsString.value;

    switch (textTools.value) {
        case "stripspaces":
            document.getElementById("textResults").textContent = stripSpaces(textResults);
            break;
        case "reverse":
            document.getElementById("textResults").textContent = reverseString(textResults);
            break;
        case "uppercase":
            document.getElementById("textResults").textContent = uppercase(textResults);
            break;
        case "lowercase":
            document.getElementById("textResults").textContent = lowercase(textResults);
            break;
        case "numbersonly":
            document.getElementById("textResults").textContent = numbersOnly(textResults);
            break;
        case "lettersonly":
            document.getElementById("textResults").textContent = lettersOnly(textResults);
            break;
        case "stripspecialchars":
            document.getElementById("textResults").textContent = stripSpecialChars(textResults);
            break;
        case "removenumbers":
            document.getElementById("textResults").textContent = stripNumbers(textResults);
            break;
        case "removeletters":
            document.getElementById("textResults").textContent = stripLetters(textResults);
            break;
        case "alphabet":
            document.getElementById("textResults").textContent = lettersToNumbers(textResults);
            break;
        case "uppercaseonly":
            document.getElementById("textResults").textContent = lettersOnlyCap(textResults);
            break;
        case "lowercaseonly":
            document.getElementById("textResults").textContent = lettersOnlyLow(textResults);
            break;
        case "specialcharsonly":
            document.getElementById("textResults").textContent = specialCharsOnly(textResults);
            break;
        case "unique":
            document.getElementById("textResults").textContent = uniqueArray(textResults).join("");
            break;
        case "urlencode":
            document.getElementById("textResults").textContent = urlEncode(textResults);
            break;
        case "urldecode":
            document.getElementById("textResults").textContent = urlDecode(textResults);
            break;
            default:
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
                                                         flipText(flipString.value, alphabet, alphaFlip) : 
                                                         reverseString(flipText(flipString.value, alphabet, alphaFlip));
});


// Frequencies
const freqButton = document.getElementById("freqDecode");
freqButton.addEventListener("click", function() {
    const freqString = document.getElementById("freqText");
    let freqResults = document.getElementById("freqResults");
    freqResults.innerHTML = "";

    if(!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Word count</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "word-count")}</code>&nbsp;<br /></div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Character count</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "char-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Character count (no spaces)</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "char-count-ns")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Letter count</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "letter-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Letter count (only capitals)</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "letter-count-caps")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Letter count (only lowercase)</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "letter-count-low")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Number count</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "number-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Special character count</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "special-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Special character count (no spaces)</span>&nbsp;<br /><code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "special-count-ns")}</code>&nbsp;</div>`);
    
    freqResults.insertAdjacentHTML("beforeend", `${styledUniqueArrayItems(uniqueArray(freqString.value))}`);
    freqResults.insertAdjacentHTML("beforeend", `${styledArrayFrequencies(countArrayFreq(freqString.value))}`);
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
    if (!largeDataWarning(replaceString.value, replaceString)) {
        return false;
    }

    let chainReplacements = document.getElementById("replaceChain");
    let replaceCase = document.getElementById("replaceCase").checked;
    let replaceResults = document.getElementById("replaceResults");

    if(chainReplacements.checked && replaceResults.textContent.length > 0) {
        replaceResults.textContent = replaceChars(replaceResults.textContent, replaceOld.value, replaceNew.value, replaceCase);
    } else {
        replaceResults.textContent = replaceChars(replaceString.value, replaceOld.value, replaceNew.value, replaceCase);
    }
});