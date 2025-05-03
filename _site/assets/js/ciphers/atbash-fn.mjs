import { alphabet } from '../toolkit.mjs';

/**
 * Atbash cipher - reverses the alphabet for the given string.
 * Transforms 'A' to 'Z', 'B' to 'Y', etc.
 *
 * @param {string} string - The original string to be transformed.
 * @returns {string} - The transformed string with reversed alphabet.
 *
 * @example
 * // Input: "ABCxyz"
 * // Output: "ZYXcba"
 */
export function atbashCipher(string) {
    const lowerAlphabet = alphabet.slice(27, 53);
    const upperAlphabet = alphabet.slice(1, 27);
    const reversedLower = lowerAlphabet.split("").reverse().join("");
    const reversedUpper = upperAlphabet.split("").reverse().join("");

    return string.replace(/[a-z]/g, c => reversedLower[lowerAlphabet.indexOf(c)])
        .replace(/[A-Z]/g, c => reversedUpper[upperAlphabet.indexOf(c)]);
}