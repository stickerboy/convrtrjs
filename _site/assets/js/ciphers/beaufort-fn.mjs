import { atbashCipher } from "./atbash-fn.mjs";
import { vignereDecrypt } from "./vigenere-fn.mjs";
/**
 * Encrypts or decrypts a string using the Beaufort cipher.
 * The encryption and decryption process is identical.
 *
 * @param {string} string - The original string to be encrypted or decrypted.
 * @param {string} key - The encryption/decryption key.
 * @returns {string} - The encrypted or decrypted string.
 *
 * @example
 * // Input: "Hello, World!" with key "KEY"
 * // Output: Danzq Cwnnh!
 *
 * // Input: Encrypted text with key "KEY"
 * // Output: "Hello, World!"
 */
export function beaufortCipher(string, key) {
    const transformedString = atbashCipher(string);
    const transformedKey = atbashCipher(key);

    return vignereDecrypt(transformedString, transformedKey);
}