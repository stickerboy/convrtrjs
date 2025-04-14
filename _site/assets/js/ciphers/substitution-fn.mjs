import { matchCase } from '../toolkit.mjs';
import { getCustomAlphabet } from "./ciphers-fn.mjs";

/**
 * Substitutes each letter in the a string with a corresponding letter from a custom alphabet
 * Custom alphabet is built using a user specified text string
 * @param {string} string - The original string to be modified.
 * @param {string} key - A user-specified text string used to create the custom alphabet.
 * @returns {string} - The modified string with letters replaced according to the custom alphabet.
 *
 * @example
 * // Input: "Hello, World!" with key "TEST"
 * // Output: "Tqxxa, Tqxxa!"
 */
export function substituteChars(string, key) {
    const alpha = getCustomAlphabet(key);
    return string.split("").map((char) => {
        if (char >= "a" && char <= "z" || char >= "A" && char <= "Z") {
            // Return the corresponding letter from the custom alphabet
            // Get the index of the original letter in the standard alphabet
            let index = char.toLowerCase().charCodeAt(0) - 97;
            index = index % 26; // handle uppercase characters
            return matchCase(char, alpha.charAt(index));
        } else {
            // Return the original character
            return char;
        }
    }).join("");
}
