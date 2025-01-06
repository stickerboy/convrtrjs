import * as toolkit from '../toolkit.mjs';

/**
 * Shifts the hex values in a hexadecimal string by a given shift value.
 * @param {string} hexString - The input hexadecimal string.
 * @param {number} shiftValue - The value by which to shift each byte.
 * @param {string} delimiter - The delimiter used in the hex string.
 * @returns {string} - The shifted hexadecimal string.
 * @throws {Error} - If the input hex string contains invalid characters.
 */
export function shiftHexString(hexString, shiftValue, delimiter) {
    if (!toolkit.isValidHex(hexString, delimiter)) {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
    hexString = toolkit.cleanString(hexString);

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
export function shiftHexPattern(string, keyBytes) {
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
export function shiftHexKey(string, key) {
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
export function reverseHex(string, delimiter) {
    let reversedString;
    if (toolkit.isValidHex(string, delimiter)) {
        if (delimiter === "") {
            reversedString = toolkit.stringToArray(string, 2).map((c) => toolkit.reverseString(c)).join(delimiter);
        } else {
            reversedString = string.split(delimiter).map((c) => toolkit.reverseString(c)).join(delimiter);
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
export function reverseHexNibbles(string, delimiter) {
    if (toolkit.isValidHex(string, delimiter)) {
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
export function generateHexFrequencies(string, delimiter, chunkSize = 1) {
    if (toolkit.isValidHex(string, delimiter)) {
        const hexFrequencies = {};
        let cleanStr = toolkit.cleanString(string);

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