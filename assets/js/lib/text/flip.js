import * as toolkit from '../toolkit.js';

/**
 * Turns each character upside down where it is, without reversing the text (custom alphabet mapping). Characters are
 * taken as they're seen, so an accent stays on its letter and an emoji stays whole.
 *
 * @param {string} string - The input string to be flipped.
 * @param {string} [originalAlphabet=alphabet] - The original alphabet (e.g., "abcdefghijklmnopqrstuvwxyz").
 * @param {string} [replacement=alphaFlip] - A string of replacement characters corresponding to each character in the alphabet.
 * @returns {string} - Each character turned upside down, in reading order.
 *
 * @example
 * // Input: "hello"
 * // Output: "ɥǝןןo"
 */
export function flipCharacters(string, originalAlphabet = toolkit.alphabet, replacement = toolkit.alphaFlip) {
    return flipEach(string, originalAlphabet, replacement).join("");
}

/**
 * Turns each character upside down, giving the characters, so they can be reversed without splitting the text again.
 *
 * @param {string} string - The input string to be flipped.
 * @param {string} originalAlphabet - The original alphabet.
 * @param {string} replacement - A string of replacement characters corresponding to each character in the alphabet.
 * @returns {string[]} - Each character turned upside down, in reading order.
 */
function flipEach(string, originalAlphabet, replacement) {
    const flipped = [...replacement];
    const flipMap = Object.fromEntries([...originalAlphabet].map((char, index) => [char, flipped[index]]));
    return toolkit.graphemes(string).map((c) => flipMap[c] || c);
}

/**
 * Flips text upside down, as if the page were turned round: each character turned over, and the text reversed.
 *
 * @param {string} string - The input string to be flipped.
 * @param {string} [originalAlphabet=alphabet] - The original alphabet (e.g., "abcdefghijklmnopqrstuvwxyz").
 * @param {string} [replacement=alphaFlip] - A string of replacement characters corresponding to each character in the alphabet.
 * @returns {string} - The flipped string.
 *
 * @example
 * // Input: "hello, world"
 * // Output: "pןɹoʍ ,oןןǝɥ"
 */
export function flipText(string, originalAlphabet = toolkit.alphabet, replacement = toolkit.alphaFlip) {
    return flipEach(string, originalAlphabet, replacement).reverse().join("");
}
