import { isLetter, isUpperCase } from "../toolkit.mjs";

/**
 * Encrypts a string using the Vigenère cipher.
 *
 * @param {string} string - The original string to be encrypted.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted string.
 *
 * @example
 * // Input: "Hello, World!" with key "KEY"
 * // Output: "Rijvs Uyvjn!"
 */
export function vignereEncrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            const keyChar = key[j % key.length];
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 + keyChar.toUpperCase().charCodeAt(0) - 65) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) - 97 + keyChar.toLowerCase().charCodeAt(0) - 97) % 26 + 97);
            }
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

/**
 * Decrypts a string encrypted using the Vigenère cipher
 *
 * @param {string} string - The encrypted string to be decrypted.
 * @param {string} key - The decryption key.
 * @returns {string} - The original plaintext string.
 *
 * @example
 * // Input: "Rijvs Uyvjn!" with key "KEY"
 * // Output: "Hello, World!"
 */
export function vignereDecrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            const keyChar = key[j % key.length];
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - keyChar.toUpperCase().charCodeAt(0) + 26) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) - keyChar.toLowerCase().charCodeAt(0) + 26) % 26 + 97);
            }
            j++;
        } else {
            result += c;
        }
    }
    return result;
}
