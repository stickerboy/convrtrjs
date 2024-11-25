/**
 * Shifts the hex values in a hexadecimal string by a given shift value.
 * @param {string} hexString - The input hexadecimal string.
 * @param {number} shiftValue - The value by which to shift each byte.
 * @param {string} delimiter - The delimiter used in the hex string.
 * @returns {string} - The shifted hexadecimal string.
 * @throws {Error} - If the input hex string contains invalid characters.
 */
function shiftHexString(hexString, shiftValue, delimiter) {
    if (!isValidHex(hexString, delimiter)) {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
    hexString = cleanString(hexString);

    // Convert hex string to byte array
    const hexArray = hexString.split(delimiter).map(byte => parseInt(byte, 16));

    // Shift each byte value
    const shiftedHexArray = hexArray.map(byte => (byte + parseInt(shiftValue)) & 0xFF);

    // Convert byte array back to a hex string
    const result = shiftedHexArray.map(byte => byte.toString(16).padStart(2, '0')).join(delimiter);

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
        var shiftedHexString = shiftHexString(shiftString.value, shiftValue.value, shiftHexDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    document.getElementById("text-tab-pane").textContent = hexToString(shiftedHexString, shiftHexDelimiter);
    document.getElementById("binary-tab-pane").textContent = stringToBinary(hexToString(shiftedHexString, shiftHexDelimiter));
    document.getElementById("hex-tab-pane").textContent = shiftedHexString;
    document.getElementById("base64-tab-pane").textContent = stringToBase64(hexToString(shiftedHexString, shiftHexDelimiter));
    document.getElementById("decimal-tab-pane").textContent =  stringToDecimal(hexToString(shiftedHexString, shiftHexDelimiter));
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
    const freqResults = document.getElementById("hexfrequenciesResults");
    const hexFrequenciesDelimiter = document.getElementById("hexfrequenciesDelimiter").value;

    freqResults.innerHTML = "";

    if (!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    try {
        generateHexFrequencies(freqString.value, hexFrequenciesDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to generate frequencies: ${e.message}`, "danger");
        return;
    }

    // Stats to display
    const stats = [
        { label: "Character count", value: freqString.value.replaceAll(hexFrequenciesDelimiter, "").length }
    ];

    // Insert each stat result
    stats.forEach(({ label, value }) => {
        freqResults.insertAdjacentHTML(
            "beforeend",
            `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3">
                <span class="display-6 fs-5">${label}</span>&nbsp;<br />
                <code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                    ${value}
                </code>&nbsp;<br />
            </div>`
        );
    });

    // Insert hex frequency results
    const hexFrequencies = [
        { delimiterLength: 2, label: "Hex frequencies" },
        { delimiterLength: 4, label: "Hex frequencies [double]", minSize: 8 },
        { delimiterLength: 6, label: "Hex frequencies [triple]", minSize: 9 },
        { delimiterLength: 7, label: "Hex frequencies [quad]", minSize: 10 },
        { delimiterLength: 10, label: "Hex frequencies [quint]", minSize: 12 }
    ];

    hexFrequencies.forEach(({ delimiterLength, label, minSize = 0 }) => {
        const frequencies = generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, delimiterLength);
        if (objectSize(frequencies) > 0) {
            freqResults.insertAdjacentHTML(
                "beforeend",
                `${styledArrayFrequencies(frequencies, label, minSize)}`
            );
        }
    });
});
