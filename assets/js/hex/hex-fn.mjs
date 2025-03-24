import * as toolkit from '../toolkit.mjs';

/**
 * Shifts the hex values in a hexadecimal string by a given shift value.
 * 
 * @param {string} hexString - The input hexadecimal string.
 * @param {number} shiftValue - The value by which to shift each byte.
 * @param {string} delimiter - The delimiter used in the hex string.
 * @returns {string} - The shifted hexadecimal string.
 * 
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
 * 
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
 * 
 * @param {string} string - The input string.
 * @param {string} key - The key string.
 * @returns {string} - The shifted string.
 */
export function shiftHexKey(string, key) {
    const keyBytes = new TextEncoder().encode(key);
    return shiftHexPattern(string, keyBytes);
}

/**
 * Reverses the bits within a 4-bit nibble.
 *
 * @param {number} nibble - A 4-bit number (0-15) to reverse the bits of.
 * @returns {number} - The nibble with its bits reversed.
 *
 * @example
 * // Input: 0b1010 (10 in decimal)
 * // Output: 0b0101 (5 in decimal)
 * reverseBitsInNibble(10); // Returns 5
 */
function reverseBitsInNibble(string) {
    // Ensure the nibble is a 4-bit value
    string = string & 0xF;
    // Reverse the bits within the nibble
    return ((string & 0x1) << 3) | ((string & 0x2) << 1) | ((string & 0x4) >> 1) | ((string & 0x8) >> 3);
}

/**
 * Reverses the nibbles (4-bit segments) of a hexadecimal byte.
 *
 * @param {string} hexByte - A string representing a single hexadecimal byte (e.g., "A5").
 * @returns {string} - The hexadecimal byte with its nibbles reversed.
 *
 * @example
 * // Input: "A5" (binary: 10100101)
 * // Output: "5A" (binary: 01011010)
 * reverseHexNibble("A5"); // Returns "5A"
 */
function reverseHexNibble(string) {
    let byte = parseInt(string, 16) & 0xFF; // Convert the hex value to a byte
    let reversedHighNibble = reverseBitsInNibble((byte & 0xF0) >> 4);
    let reversedLowNibble = reverseBitsInNibble(byte & 0x0F);
    return ((reversedHighNibble << 4) | reversedLowNibble).toString(16).padStart(2, "0");
}

/**
 * Reverses the order of bits within each byte in a hex string.
 *
 * @param {string} string - The input hexadecimal string.
 * @param {string} delimiter - The delimiter used in the hexadecimal string.
 * @returns {string} - The hexadecimal string with bits reversed in each byt.
 *
 * @throws {Error} - If the input contains invalid characters or the delimiter is incorrect.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (hex for "hello"), delimiter: ""
 * // Output: "84 56 c6 c6 f6"
 * reverseHexBytes("48 65 6c 6c 6f", " ");
 */
export function reverseHexBytes(string, delimiter) {
    let reversedString;
    if (toolkit.isValidHex(string, delimiter)) {
        if (delimiter === "") {
            reversedString = toolkit.stringToArray(string, 2).map(toolkit.reverseString).join(delimiter);
        } else {
            reversedString = string.split(delimiter).map(toolkit.reverseString).join(delimiter);
        }
        return reversedString;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

/**
 * Reverses the order of bytes in a hex string.
 *
 * @param {string} string - The input hexadecimal string.
 * @param {string} delimiter - The delimiter used in the hexadecimal string.
 * @returns {string} - The reversed hexadecimal string.
 *
 * @throws {Error} - If the input contains invalid characters or the delimiter is incorrect.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (hex for "hello"), delimiter: " "
 * // Output: "6f 6c 6c 65 48"
 * reverseHexByteOrder("48 65 6c 6c 6f", " ");
 */
export function reverseHexByteOrder(string, delimiter) {
    let reversedString;
    if (toolkit.isValidHex(string, delimiter)) {
        if (delimiter === "") {
            reversedString = toolkit.stringToArray(string, 2).reverse().join(delimiter);
        } else {
            reversedString = string.split(delimiter).reverse().join(delimiter);
        }
        return reversedString;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

/**
 * Reverses the bits within each nibble (4 bits) of every byte in a hexadecimal string.
 * This is equivalent to converting the hex string to binary, reversing the bits in each nibble,
 * and converting it back to hexadecimal.
 *
 * @param {string} string - The input hexadecimal string.
 * @param {string} delimiter - The delimiter used to separate hexadecimal bytes in the input string.
 * @returns {string} - The hexadecimal string with reversed nibbles in each byte.
 *
 * @throws {Error} - If the input contains invalid characters or the delimiter is incorrect.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (hex for "hello"), delimiter: " "
 * // Output: "21 6A 36 36 F6"
 * reverseHexNibbles("48 65 6c 6c 6f", " ");
 */
export function reverseHexNibbles(string, delimiter) {
    let reversedString;
    if (toolkit.isValidHex(string, delimiter)) {
        if (delimiter === "") {
            reversedString = toolkit.stringToArray(string, 2).map(reverseHexNibble).join(delimiter);
        } else {
            reversedString = string.split(delimiter).map(reverseHexNibble).join(delimiter);
        }
        return reversedString;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

/** 
 * Generates a frequency map of hexadecimal substrings of a specified length from a given string. 
 * 
 * @param {string} string - The input string containing hexadecimal values. 
 * @param {string} delimiter - The delimiter used to separate hexadecimal values in the input string. 
 * @param {number} chunkSize - The size of the chunks to be considered for the frequency map. 
 * @returns {Object} An object containing the frequency of each hexadecimal substring. 
 * 
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