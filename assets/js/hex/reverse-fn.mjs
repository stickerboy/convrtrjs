import * as toolkit from "../toolkit.mjs";

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