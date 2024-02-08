// Decode Binary
function isValidBinaryLength(string) {
    return string.length % 8 === 0;
}

function binaryToString(string) {
    if(isValidBinaryLength(string)) {
        string = string.replace(/[^10\s]/g, "");

        let charCodes = string.split(" ").map(bin => {
            bin = bin.padStart(8, "0");
            return parseInt(bin, 2);
        });

        return String.fromCharCode(...charCodes);
    } else {
        throw Error("Not a valid Binary string");
    }
}


// Decode Base64
function base64ToString(string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    try {
        return decodeURIComponent(atob(string).split("").map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
    } catch (e) {
        throw Error("Not a valid Base64 string");
    }
}

// Morse code to String
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
        throw Error("Morse code contains invalid characters");
    }
}

// Convert to Morse
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

// Convert to Morsenary
function stringToMorsenary(string) {
    let morsenarySetting = document.getElementById("morsenarySetting").value;
    return morsenarySetting === "default" ? stringToBinary(string).replace(/ /g, '').replace(/[01]/g, (match) => (match === '1' ? '-' : '.')) :
    stringToBinary(string).replace(/ /g, '').replace(/[01]/g, (match) => (match === '1' ? '.' : '-'));
}


// Decode Morsenary to String
function morsenaryToString(string) {
    if(/^[ /.-]*$/.test(string)) {
        let morsenarySetting = document.getElementById("morsenarySetting").value;
        string = morsenarySetting === "default" ? string.replace(/[.-]/g, (match) => (match === '.' ? '0' : '1')) : string.replace(/[.-]/g, (match) => (match === '.' ? '1' : '0'));
        return binaryToString(splitString(string, 8));
    } else {
       throw Error("Morsenary contains invalid characters");
    }
}

// Flip text upside down
function flipText(string, alphabet, replacement) {
	return Array.from(string).map(c => 
        typeof replacement[alphabet.search(c)] == "undefined" ? " " : replacement[alphabet.search(c)]
    ).join("");
}

// Various information about a given string
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

// Simple and efficient method of returning counts of each unique value in an array
// https://stackoverflow.com/a/66002712/3172872
function countArrayFreq(string) {
    let split = [...string];
    return split.reduce((split, curr) => (split[curr] = (split[curr] || 0) + 1, split), {});
}

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

// Re-code Hex on delimeter change
let hexDelimiterSelect = document.getElementById("hexDelimiter");
hexDelimiterSelect.addEventListener("change", function() {
    let hexData = document.getElementById("form-hex").value;
    if(hexData === "") {
        return;
    }
    document.getElementById("encode").click();
});

// Re-code Morsenary on delimeter change
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