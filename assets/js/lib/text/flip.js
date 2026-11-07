import * as toolkit from '../toolkit.js';

// Each character and how it looks upside down. Every pair works both ways, and every upside-down character is used
// once, so flipping flipped text gives the original back. None of them reads right to left: Hebrew ן for l and פ for
// G, which flip tables often use, make the browser reorder the text around them. Characters that look the same upside
// down (H, I, N, O, S, X, Z, o, s, x, z, 0, 8 and spaces) aren't listed, as they stay as they are.
const FLIP_PAIRS = [
    // Capitals
    ["A", "Ɐ"], ["B", "ᗺ"], ["C", "Ɔ"], ["D", "ᗡ"], ["E", "Ǝ"], ["F", "Ⅎ"], ["G", "⅁"], ["J", "ſ"], ["K", "ꓘ"],
    ["L", "⅂"], ["M", "W"], ["P", "Ԁ"], ["Q", "Ό"], ["R", "ᴚ"], ["T", "⊥"], ["U", "∩"], ["V", "Λ"], ["Y", "⅄"],
    // Lowercase
    ["a", "ɐ"], ["b", "q"], ["c", "ɔ"], ["d", "p"], ["e", "ǝ"], ["f", "ɟ"], ["g", "ƃ"], ["h", "ɥ"], ["i", "ᴉ"],
    ["j", "ɾ"], ["k", "ʞ"], ["l", "ꞁ"], ["m", "ɯ"], ["n", "u"], ["r", "ɹ"], ["t", "ʇ"], ["v", "ʌ"], ["w", "ʍ"],
    ["y", "ʎ"],
    // Digits: ↊ and ↋ are Unicode's own turned 2 and 3
    ["1", "Ɩ"], ["2", "↊"], ["3", "↋"], ["4", "ᔭ"], ["5", "ϛ"], ["6", "9"], ["7", "𝘓"],
    // Punctuation
    [".", "˙"], [",", "'"], ["\"", "„"], ["?", "¿"], ["!", "¡"], ["(", ")"], ["[", "]"], ["{", "}"], ["<", ">"],
    ["_", "‾"], ["&", "⅋"], [";", "⸵"],
];

// Both ways round: M and W, b and q, 6 and 9, ( and ) and the like are each other's pair already
const FLIP = new Map(FLIP_PAIRS.flatMap(([char, flipped]) => [[char, flipped], [flipped, char]]));

/**
 * Turns each character upside down, giving the characters, so they can be reversed without splitting the text again.
 * Characters are taken as they're seen, so an accent stays on its letter and an emoji stays whole.
 *
 * @param {string} string - The text to flip.
 * @returns {string[]} - Each character turned upside down, in reading order.
 */
function flipEach(string) {
    return toolkit.graphemes(string).map((char) => FLIP.get(char) ?? char);
}

/**
 * Turns each character upside down where it is, without reversing the text. Flipping the result again gives the
 * original back.
 *
 * @param {string} string - The text to flip.
 * @returns {string} - Each character turned upside down, in reading order.
 *
 * @example
 * // Input: "Hello!"
 * // Output: "Hǝꞁꞁo¡"
 */
export function flipCharacters(string) {
    return flipEach(string).join("");
}

/**
 * Flips text upside down, as if the page were turned round: each character turned over, and the text reversed.
 * Flipping the result again gives the original back.
 *
 * @param {string} string - The text to flip.
 * @returns {string} - The flipped string.
 *
 * @example
 * // Input: "hello, world"
 * // Output: "pꞁɹoʍ 'oꞁꞁǝɥ"
 */
export function flipText(string) {
    return flipEach(string).reverse().join("");
}
