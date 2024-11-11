/**
 * Shifts a hex string left or right by a specified value
 *
 * @param {string} string - The input hexadecimal string.
 * @param {number} shiftValue - The value to shift by (positive for left, negative for right).
 * @param {string} delimiter - The delimiter used in the hexadecimal string.
 * @returns {string} - The resulting shifted hexadecimal string (space delimited).
 *
 * @throws {Error} - If the input contains invalid characters or the delimiter is incorrect.
 *
 * @example
 * // Input: "74657374" (hex for "test"), shiftValue: 2, delimiter: ""
 * // Output: "76 65 73 74"
 */
function shiftHexString(string, shiftValue, delimiter) {
    if(isValidHex(string, delimiter)) {
        return hexToString(string, delimiter).split("").map(c => (ord(c) + parseInt(shiftValue)).toString(16)).join(delimiter);
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
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
 * Calculates the frequencies of hexadecimal groups of the same characters in different sizes (2, 4, 6, 8).
 * Converts the input to uppercase for case insensitivity.
 * Only includes groups where all hex pairs are identical.
 * 
 * @param {string} string - The input string containing hexadecimal characters.
 * @param {string} delimiter - The delimiter used to separate hex characters in the input string.
 * @returns {Object} An object containing the frequencies of hex groups for sizes 2, 4, 6, and 8.
 * @throws {Error} If the hexadecimal input contains invalid characters.
 */
function generateHexFrequencies(string, delimiter) {

    if (isValidHex(string, delimiter)) {
        const hexFrequencies = {
            2: {},
            4: {},
            6: {},
            8: {}
        };

        const upperInput = string.toUpperCase();

        /**
         * Updates the frequencies for a given group size.
         * 
         * @param {number} size - The size of the hex group (2, 4, 6, or 8 characters).
         */
        function updateHexFrequencies(size) {
            const split = upperInput.match(new RegExp(`.{1,${size}}`, 'g')) || [];
            split.forEach((group) => {
                if (group.length === size && new Set(group.match(/.{2}/g)).size === 1) { // Check if all pairs are identical
                    hexFrequencies[size][group] = (hexFrequencies[size][group] || 0) + 1;
                }
            });
        }

        [2, 4, 6, 8].forEach(updateHexFrequencies);

        return hexFrequencies;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

// Shift Hex
const shiftButton = document.getElementById("shiftDecode");
shiftButton.addEventListener("click", function() {
    const shiftString = document.getElementById("shiftText");
    let shiftValue = document.getElementById("shiftValue");
    let shiftHexDelimiter = document.getElementById("shiftHexDelimiter").value;

    if(!emptyContainerCheck(shiftString.value, shiftString)) {
        document.getElementById("text-tab-pane").textContent = "";
        document.getElementById("binary-tab-pane").textContent = "";
        document.getElementById("hex-tab-pane").textContent = "";
        document.getElementById("base64-tab-pane").textContent = "";
        document.getElementById("decimal-tab-pane").textContent = "";
        return false;
    }
    if(!emptyContainerCheck(shiftValue.value, shiftValue)) {
        return false;
    }
    if (!largeDataWarning(shiftString.value, shiftString)) {
        return false;
    }

    try {
        shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter);
    } catch (e) {
        showToast("Error", `An error occured trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    document.getElementById("text-tab-pane").textContent = hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter);
    document.getElementById("binary-tab-pane").textContent = stringToBinary(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
    document.getElementById("hex-tab-pane").textContent = shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter);
    document.getElementById("base64-tab-pane").textContent = stringToBase64(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
    document.getElementById("decimal-tab-pane").textContent =  stringToDecimal(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
});

// Reverse Hex
const reverseHexButton = document.getElementById("reverseHexDecode");
reverseHexButton.addEventListener("click", function() {
    const reverseHexString = document.getElementById("reverseHexText");
    let reverseHexDelimiter = document.getElementById("reverseHexDelimiter").value;
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
        showToast("Error", `An error occured trying to reverse the hex string: ${e.message}`, "danger");
        return;
    }

    let revHexContent;
    if(reverseNibbles.checked) {
        revHexContent = reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
    } else {
        revHexContent = reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
    } 
    document.getElementById("reverseHexResults").textContent = revHexContent;
});
