/**
 * Shifts a hex string left or right by a specified value
 * @param {string} hexString - The input hex string.
 * @param {number} shiftValue - The value to shift by.
 * @param {string} delimiter - The delimiter used in the hex string.
 * @returns {string} - The shifted hex string.
 * @throws {Error} - If the input is invalid.
 * 
 * @example
 * // Input: "74657374" (hex for "test"), shiftValue: 2, delimiter: ""
 * // Output: "76 65 73 74"
 */
function shiftHexString(hexString, shiftValue, delimiter) {
    if (!isValidHex(hexString, delimiter)) {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }

    // Convert hex string to byte array
    const hexArray = hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
    const byteArray = new Uint8Array(hexArray);

    // Decode byte array to a string
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(byteArray);

    // Shift each character's code point
    const shiftedString = Array.from(decodedString).map(char => {
        const codePoint = char.codePointAt(0) + parseInt(shiftValue);
        return String.fromCodePoint(codePoint);
    }).join("");

    // Encode the shifted string back to a byte array
    const encoder = new TextEncoder();
    const shiftedByteArray = encoder.encode(shiftedString);

    // Convert byte array back to a hex string
    const shiftedHexArray = Array.from(shiftedByteArray).map(byte => byte.toString(16).padStart(2, "0"));
    const result = shiftedHexArray.join(delimiter);

    return result;
}

/**
 * Shifts the bytes of the input string based on the provided key bytes.
 * @param {string} string - The input string.
 * @param {Uint8Array} keyBytes - The key bytes.
 * @returns {string} - The shifted string.
 */
function shiftHexPattern(string, keyBytes) {
    const inputBytes = new TextEncoder().encode(string);
    const shiftedBytes = inputBytes.map((byte, i) => (byte - keyBytes[i % keyBytes.length]) & 0xFF);
    return new TextDecoder().decode(new Uint8Array(shiftedBytes));
}

/**
 * Shifts the bytes of the input string based on the provided key.
 * @param {string} string - The input string.
 * @param {string} key - The key string.
 * @returns {string} - The shifted string.
 */
function shiftHexKey(string, key) {
    const keyBytes = new TextEncoder().encode(key);
    return shiftHexPattern(string, keyBytes);
}

/**
 * Reverses the order of each hex nibble in a hex string.
 *
 * @param {string} string - The input hexadecimal string.
 * @param {string} delimiter - The delimiter used in the hexadecimal string.
 * @returns {string} - The reversed hexadecimal string.
 *
 * @throws {Error} - If the input contains invalid characters or the delimiter is incorrect.
 *
 * @example
 * // Input: "74657374" (hex for "test"), delimiter: ""
 * // Output: "47 56 37 47"
 */
function reverseHex(string, delimiter) {
    let reversedString;
    if(isValidHex(string, delimiter)) {
        if(delimiter === "") {
            reversedString = stringToArray(string, 2).map((c) => reverseString(c)).join(delimiter);
        } else {
            reversedString = string.split(delimiter).map((c) => reverseString(c)).join(delimiter);
        }
        return reversedString;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

/**
 * Reverses the position of each Hex nibble in a hex string
 *
 * @param {string} string - The input hexadecimal string.
 * @param {string} delimiter - The delimiter used in the hexadecimal string.
 * @returns {string} - The reversed hexadecimal string.
 *
 * @throws {Error} - If the input contains invalid characters or the delimiter is incorrect.
 *
 * @example
 * // Input: "74657374" (hex for "test"), delimiter: ""
 * // Output: "74 73 65 74"
 */
function reverseHexNibbles(string, delimiter) {
    if(isValidHex(string, delimiter)) {
        return string.split(delimiter).reverse().join(delimiter);
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

/** 
 * Generates a frequency map of hexadecimal substrings of a specified length from a given string. 
 * @param {string} string - The input string containing hexadecimal values. 
 * @param {string} delimiter - The delimiter used to separate hexadecimal values in the input string. 
 * @param {number} chunkSize - The size of the chunks to be considered for the frequency map. 
 * @returns {Object} An object containing the frequency of each hexadecimal substring. 
 * @throws {Error} Throws an error if the hexadecimal contains invalid characters. 
 **/
function generateHexFrequencies(string, delimiter, chunkSize = 1) {
    if (isValidHex(string, delimiter)) {
        const hexFrequencies = {};
        let cleanStr = cleanString(string);

        // Remove delimiters and convert input to uppercase for case insensitivity
        const upperInput = cleanStr.replace(new RegExp(delimiter, 'g'), '').toUpperCase();

        // Function to update frequencies for the given group size
        const split = upperInput.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
        split.forEach((group) => {
            if (group.length === chunkSize && new Set(group.match(/.{2}/g)).size === 1) { // Check if all pairs are identical
                const withDelimiter = group.match(/.{1,2}/g).join(delimiter);
                hexFrequencies[withDelimiter] = (hexFrequencies[withDelimiter] || 0) + 1;
            }
        });

        return hexFrequencies;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

// Shift Hex
const shiftButton = document.getElementById("shifthexDecode");
shiftButton && shiftButton.addEventListener("click", function() {
    const shiftString = document.getElementById("shifthexText");
    let shiftValue = document.getElementById("shifthexValue");
    let shiftHexDelimiter = document.getElementById("shifthexDelimiter").value;

    if(!emptyContainerCheck(shiftString.value, shiftString)) {
        document.getElementById("text-tab-pane").textContent = "";
        document.getElementById("binary-tab-pane").textContent = "";
        document.getElementById("hex-tab-pane").textContent = "";
        document.getElementById("base64-tab-pane").textContent = "";
        document.getElementById("decimal-tab-pane").textContent = "";
        return false;
    }
    if(!emptyContainerCheck(shiftValue.value, shiftValue, "Please enter a number to shift the hex string by")) {
        return false;
    }
    if (!largeDataWarning(shiftString.value, shiftString)) {
        return false;
    }
    try {
        shiftHexString(cleanString(shiftString.value), shiftValue.value, shiftHexDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    document.getElementById("text-tab-pane").textContent = hexToString(shiftHexString(cleanString(shiftString.value), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter);
    document.getElementById("binary-tab-pane").textContent = stringToBinary(hexToString(shiftHexString(cleanString(shiftString.value), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
    document.getElementById("hex-tab-pane").textContent = shiftHexString(cleanString(shiftString.value), shiftValue.value, shiftHexDelimiter);
    document.getElementById("base64-tab-pane").textContent = stringToBase64(hexToString(shiftHexString(cleanString(shiftString.value), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
    document.getElementById("decimal-tab-pane").textContent =  stringToDecimal(hexToString(shiftHexString(cleanString(shiftString.value), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
});

// Reverse Hex
const reverseHexButton = document.getElementById("reversehexDecode");
reverseHexButton && reverseHexButton.addEventListener("click", function() {
    const reverseHexString = document.getElementById("reversehexText");
    let reverseHexDelimiter = document.getElementById("reversehexDelimiter").value;
    let reverseNibbles = document.getElementById("reverseNibbles");

    if(!emptyContainerCheck(reverseHexString.value, reverseHexString)) {
        return false;
    }
    if (!largeDataWarning(reverseHexString.value, reverseHexString)) {
        return false;
    }

    try {
        if(reverseNibbles.checked) {
            reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
        } else {
            reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
        } 
    } catch (e) {
        showToast("Error", `An error occurred trying to reverse the hex string: ${e.message}`, "danger");
        return;
    }

    let revHexContent;
    if(reverseNibbles.checked) {
        revHexContent = reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
    } else {
        revHexContent = reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
    } 
    document.getElementById("reversehexResults").textContent = revHexContent;
});

// Hex Frequencies
const freqButton = document.getElementById("hexfrequenciesDecode");
freqButton && freqButton.addEventListener("click", function() {
    const freqString = document.getElementById("hexfrequenciesText");
    let freqResults = document.getElementById("hexfrequenciesResults");
    let hexFrequenciesDelimiter = document.getElementById("hexfrequenciesDelimiter").value;

    freqResults.innerHTML = "";

    if(!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    try {
        generateHexFrequencies(freqString.value, hexFrequenciesDelimiter)
    } catch (e) {
        showToast("Error", `An error occurred trying to generate frequencies: ${e.message}`, "danger");
        return;
    }

    freqResults.insertAdjacentHTML("beforeend", `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Character count</span>&nbsp;<br /><code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${freqString.value.replaceAll(hexFrequenciesDelimiter, "").length}</code>&nbsp;<br /></div>`);
    freqResults.insertAdjacentHTML("beforeend", `${styledArrayFrequencies(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 2), "Hex frequencies")}`);
    if(objectSize(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 4)) > 0 ) {
        freqResults.insertAdjacentHTML("beforeend", `${styledArrayFrequencies(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 4), "Hex frequencies [double]", 8)}`);
    }
    if(objectSize(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 6)) > 0 ) {
        freqResults.insertAdjacentHTML("beforeend", `${styledArrayFrequencies(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 6), "Hex frequencies [triple]", 9)}`);
    }
    if(objectSize(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 8)) > 0 ) {
        freqResults.insertAdjacentHTML("beforeend", `${styledArrayFrequencies(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 7), "Hex frequencies [quad]", 10)}`);
    }
    if(objectSize(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 10)) > 0 ) {
        freqResults.insertAdjacentHTML("beforeend", `${styledArrayFrequencies(generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, 10), "Hex frequencies [quint]", 12)}`);
    }
});