/**
 * Flips text upside down (custom alphabet mapping).
 *
 * @param {string} string - The input string to be flipped.
 * @param {string} [alphabet=alphabet] - The original alphabet (e.g., "abcdefghijklmnopqrstuvwxyz").
 * @param {string} [replacement=alphaFlip] - A string of replacement characters corresponding to each character in the alphabet.
 * @returns {string} - The flipped string.
 *
 * @example
 * // Input: "hello, world" with custom alphabet "abcdefghijklmnopqrstuvwxyz" and replacement string "z...a"
 * // Output: "pןɹoʍ oןןǝɥ"
 */
export function flipText(string, originalAlphabet = toolkit.alphabet, replacement = toolkit.alphaFlip) {
    const flipMap = Object.fromEntries([...originalAlphabet].map((char, index) => [char, replacement[index]]));
    return [...string].map(c => flipMap[c] || c).reverse().join("");
}