import { graphemes, characterKinds } from "../toolkit.js";

/**
 * Works out every statistic for a text in one pass over its characters. Characters are counted as they're seen (see
 * graphemes): 👍🏽 and 🇬🇧 are one character each. Letters and numbers include accented and other alphabets' letters
 * (é, ß, Ж), spaces include tabs and new lines, and special characters are everything that isn't a letter or number.
 *
 * @param {string} string - The text to analyze.
 * @param {string[]} [chars=graphemes(string)] - Its characters, if they've been split already, so they aren't again.
 * @param {string|RegExp} [delimiter=/\s+/u] - What separates words.
 * @returns {Object<string, number>} Each statistic, by the names stringStats takes.
 *
 * @example
 * // Input: "Hi 👍🏽"
 * // Output: { "word-count": 2, "char-count": 4, "char-count-ns": 3, "letter-count": 2, ... "special-count": 2, ... }
 */
export function textStats(string, chars = graphemes(string), delimiter = /\s+/u) {
    const kindOf = characterKinds();
    let letters = 0, upper = 0, lower = 0, numbers = 0, spaces = 0;
    for (const char of chars) {
        const kind = kindOf(char);
        letters += kind.letter;
        upper += kind.upper;
        lower += kind.lower;
        numbers += kind.number;
        spaces += kind.space;
    }
    const trimmed = string.trim();
    const special = chars.length - letters - numbers;
    return {
        "word-count": trimmed === "" ? 0 : trimmed.split(delimiter).filter(Boolean).length,
        "char-count": chars.length,
        "char-count-ns": chars.length - spaces,
        "letter-count": letters,
        "letter-count-caps": upper,
        "letter-count-low": lower,
        "number-count": numbers,
        "special-count": special,
        "special-count-ns": special - spaces,
    };
}

/**
 * Gives one statistic about a text: see textStats, which works them all out at once.
 *
 * @param {string} string - The input string to analyze.
 * @param {string} stat - The statistic to calculate (e.g., "word-count", "char-count", etc.).
 * @param {string|RegExp} [delimiter] - What separates words (default: any spaces, tabs or new lines).
 * @returns {number|string} - The calculated statistic or an error message if the stat is not available.
 *
 * @example
 * // Input: "Hello, world!", stat: "word-count"
 * // Output: 2
 */
export function stringStats(string, stat, delimiter = /\s+/u) {
    const stats = textStats(string, graphemes(string), delimiter);
    return stat in stats ? stats[stat] : "No statistic specified or statistic is not available";
}

/**
 * Counts each character in a string, in the order each first appears. Characters are counted as they're seen (see
 * graphemes), so 👍🏽 is one character, not 👍 and a skin tone.
 *
 * @param {string} string - The text to count.
 * @param {string[]} [chars=graphemes(string)] - Its characters, if they've been split already, so they aren't again.
 * @returns {{char: string, count: number, first: number}[]} Each character, how often it appears, and where it first
 *   appears (1 for the first character).
 *
 * @example
 * // Input: "hello"
 * // Output: [{ char: "h", count: 1, first: 1 }, { char: "e", count: 1, first: 2 }, { char: "l", count: 2, first: 3 }, { char: "o", count: 1, first: 5 }]
 */
export function characterFrequencies(string, chars = graphemes(string)) {
    const counts = new Map();
    chars.forEach((char, index) => {
        const entry = counts.get(char);
        if (entry) {
            entry.count++;
        } else {
            counts.set(char, { char, count: 1, first: index + 1 });
        }
    });
    return [...counts.values()];
}
