import { alphabet, isUpperCase, isLetter } from "./toolkit.mjs"; 

/**
 * Applies the ROT (Caesar cipher) encryption or decryption to a given string.
 * @param {string} string - The input string to be encoded or decoded.
 * @param {number} n - The rotation value (positive for encoding, negative for decoding).
 * @param {string} alpha - Custom alphabet (optional, defaults to English alphabet).
 * @returns {string} - The resulting string after applying the ROT transformation.
 */
export default function rot(string, n = -13, alpha = alphabet.substring(1)) {
    n = (n % 26 + 26) % 26; // Normalize n to ensure it's positive and within the alphabet range
    const length = alpha.length;
    let result = "";

    for (const char of string) {
        if (isLetter(char)) {
            const isUpper = isUpperCase(char);
            const baseChar = isUpper ? char.toUpperCase() : char.toLowerCase();
            const currentPosition = alpha.indexOf(baseChar.toUpperCase());
            const shiftedChar = alpha[(currentPosition + n) % length];
            
            result += isUpper ? shiftedChar.toUpperCase() : shiftedChar.toLowerCase();
        } else {
            result += char;
        }
    }
    return result;
}
