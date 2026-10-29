import { isLetter, matchCase } from "../toolkit.js";
import { upperAlphabet } from "./common.js";

/**
 * Applies the ROT (Caesar cipher) encryption or decryption to a given string.
 * @param {string} string - The input string to be encoded or decoded.
 * @param {number} n - The rotation value (positive for encoding, negative for decoding).
 * @param {string} alpha - Custom uppercase alphabet, e.g. from getCustomAlphabet (optional, defaults to A-Z).
 * @returns {string} - The resulting string after applying the ROT transformation.
 */
export default function rot(string, n = -13, alpha = upperAlphabet) {
    const length = alpha.length;
    n = (n % length + length) % length; // Normalize n to ensure it's positive and within the alphabet range
    let result = "";
    for (const char of string) {
        if (isLetter(char)) {
            const currentPosition = alpha.indexOf(char.toUpperCase());
            result += matchCase(char, alpha[(currentPosition + n) % length]);
        } else {
            result += char;
        }
    }
    return result;
}
