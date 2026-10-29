import * as toolkit from "../toolkit.js";

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
    const shift = parseInt(shiftValue);
    const shifted = toolkit.hexToBytes(hexString, delimiter).map(byte => (byte + shift) & 0xFF);
    return toolkit.bytesToHex(shifted, delimiter);
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