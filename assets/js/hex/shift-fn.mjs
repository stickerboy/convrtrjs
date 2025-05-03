import * as toolkit from "../toolkit.mjs";

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