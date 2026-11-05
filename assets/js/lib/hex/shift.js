import * as toolkit from "../toolkit.js";

/**
 * Shifts each byte of hex up or down by the same amount, wrapping round past ff and 00.
 *
 * @param {string} hexString - The hex, with any of the usual separators between bytes, or none.
 * @param {number|string} shiftValue - A whole number of any size, positive or negative, or its text.
 * @returns {Uint8Array} - The shifted bytes.
 * @throws {Error} - If the hex contains invalid characters, or the shift isn't a whole number.
 */
export function shiftHexBytes(hexString, shiftValue) {
    let shift;
    try {
        // Worked out on the whole number, so a shift too big to hold exactly still wraps as it should
        shift = Number(BigInt(String(shiftValue).trim()) % 256n);
    } catch {
        throw new Error("The shift can only be a whole number, such as 1 or -3");
    }
    return Uint8Array.from(toolkit.hexToBytes(hexString), (byte) => (byte + shift) & 0xFF);
}

/**
 * Shifts each byte of hex up or down by the same amount, wrapping round past ff and 00, and writes it as hex.
 *
 * @param {string} hexString - The hex, with any of the usual separators between bytes, or none.
 * @param {number|string} shiftValue - A whole number of any size, positive or negative, or its text.
 * @param {string} delimiter - The delimiter to write the result with.
 * @returns {string} - The shifted hex.
 * @throws {Error} - If the hex contains invalid characters, or the shift isn't a whole number.
 *
 * @example
 * // Input: "48 65 6c 6c 6f" (Hello) shifted by 1, delimiter " "
 * // Output: "49 66 6d 6d 70" (Ifmmp)
 */
export function shiftHexString(hexString, shiftValue, delimiter) {
    return toolkit.bytesToHex(shiftHexBytes(hexString, shiftValue), delimiter);
}

/**
 * Shifts the bytes of the input string based on the provided key bytes.
 * 
 * @param {string} string - The input string.
 * @param {Uint8Array} keyBytes - The key bytes.
 * @returns {string} - The shifted string, as UTF-8, or one character per byte if the bytes aren't valid UTF-8.
 */
export function shiftHexPattern(string, keyBytes) {
    const inputBytes = new TextEncoder().encode(string);
    const shiftedBytes = inputBytes.map((byte, i) => (byte - keyBytes[i % keyBytes.length]) & 0xFF);
    return toolkit.bytesToString(shiftedBytes);
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