import * as toolkit from "../toolkit.js";

/**
 * Reverses the 4 bits of a nibble: 0b1000 becomes 0b0001.
 *
 * @param {number} nibble - A number from 0 to 15.
 * @returns {number} - The nibble with its bits in reverse order.
 *
 * @example
 * // Input: 0b1010 (10)
 * // Output: 0b0101 (5)
 */
function reverseNibbleBits(nibble) {
    return ((nibble & 0x1) << 3) | ((nibble & 0x2) << 1) | ((nibble & 0x4) >> 1) | ((nibble & 0x8) >> 3);
}

// Every byte's answer worked out once, as there are only 256: the bits of each nibble reversed in place, and all 8 bits
// reversed (which is the same as reversing each nibble's bits and swapping the two nibbles)
const NIBBLE_BITS_REVERSED = Array.from({ length: 256 }, (_, byte) =>
    ((reverseNibbleBits(byte >> 4) << 4) | reverseNibbleBits(byte & 0xF)).toString(16).padStart(2, "0"));
const BITS_REVERSED = Array.from({ length: 256 }, (_, byte) =>
    ((reverseNibbleBits(byte & 0xF) << 4) | reverseNibbleBits(byte >> 4)).toString(16).padStart(2, "0"));

/**
 * Swaps the two hex digits of each byte, so 48 becomes 84. This is the same as swapping each byte's two nibbles, and as
 * rev_n in the original Ruby (Sepheus/ONI-Tools).
 *
 * @param {string} string - The hex, with any of the usual separators between bytes, or none.
 * @param {string} delimiter - The delimiter to write the result with.
 * @returns {string} - The hex with the digits of each byte swapped.
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (Hello), delimiter " "
 * // Output: "84 56 c6 c6 f6"
 */
export function reverseHexDigits(string, delimiter) {
    return toolkit.joinHex(toolkit.hexToPairs(string).map((pair) => pair[1] + pair[0]), delimiter);
}

/**
 * Reverses all 8 bits of each byte, so 48 (01001000) becomes 12 (00010010).
 *
 * @param {string} string - The hex, with any of the usual separators between bytes, or none.
 * @param {string} delimiter - The delimiter to write the result with.
 * @returns {string} - The hex with the bits of each byte in reverse order.
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (Hello), delimiter " "
 * // Output: "12 a6 36 36 f6"
 */
export function reverseHexBits(string, delimiter) {
    return toolkit.joinHex(toolkit.hexToBytes(string).map((byte) => BITS_REVERSED[byte]), delimiter);
}

/**
 * Reverses the bits within each nibble (4 bits) of every byte, leaving the nibbles where they are, so 48 (0100 1000)
 * becomes 21 (0010 0001).
 *
 * @param {string} string - The hex, with any of the usual separators between bytes, or none.
 * @param {string} delimiter - The delimiter to write the result with.
 * @returns {string} - The hex with the bits of each nibble in reverse order.
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (Hello), delimiter " "
 * // Output: "21 6a 63 63 6f"
 */
export function reverseHexNibbles(string, delimiter) {
    return toolkit.joinHex(toolkit.hexToBytes(string).map((byte) => NIBBLE_BITS_REVERSED[byte]), delimiter);
}

/**
 * Reverses the order of the bytes, leaving each byte as it is.
 *
 * @param {string} string - The hex, with any of the usual separators between bytes, or none.
 * @param {string} delimiter - The delimiter to write the result with.
 * @returns {string} - The hex with its bytes in reverse order.
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (Hello), delimiter " "
 * // Output: "6f 6c 6c 65 48"
 */
export function reverseHexByteOrder(string, delimiter) {
    return toolkit.joinHex(toolkit.hexToPairs(string).reverse(), delimiter);
}
