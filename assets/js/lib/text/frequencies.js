// How many characters in a string match a pattern, counting each character once, emoji included
const countMatches = (string, pattern) => string.match(pattern)?.length ?? 0;

/**
 * Provides various information about a given string based on the specified stat. Letters and numbers include accented
 * and other alphabets' letters (é, ß, Ж), and spaces include tabs and new lines. Each character counts once, emoji included.
 *
 * @param {string} string - The input string to analyze.
 * @param {string} stat - The type of information to retrieve / statistic to calculate (e.g., "word-count", "char-count", etc.).
 * @param {string|RegExp} [delimiter] - What separates words (default: any spaces, tabs or new lines).
 * @returns {number|string} - The calculated statistic or an error message if the stat is not available.
 *
 * @example
 * // Input: "Hello, world!", stat: "word-count"
 * // Output: 2
 */
export function stringStats(string, stat, delimiter = /\s+/u) {
    // Mapping object for statistic functions
    const statFunctions = {
        "word-count":           str => str.trim() === "" ? 0 : str.trim().split(delimiter).filter(Boolean).length,
        "char-count":           str => [...str].length,
        "char-count-ns":        str => countMatches(str, /\S/gu),
        "letter-count":         str => countMatches(str, /\p{L}/gu),
        "letter-count-caps":    str => countMatches(str, /\p{Lu}/gu),
        "letter-count-low":     str => countMatches(str, /\p{Ll}/gu),
        "number-count":         str => countMatches(str, /\p{N}/gu),
        // Anything that isn't a letter (or an accent on one) or a number
        "special-count":        str => countMatches(str, /[^\p{L}\p{M}\p{N}]/gu),
        "special-count-ns":     str => countMatches(str, /[^\p{L}\p{M}\p{N}\s]/gu)
    };

    // Get the selected stat function
    const selectedStatFunction = statFunctions[stat];
    return selectedStatFunction ? selectedStatFunction(string) : "No statistic specified or statistic is not available";
}

/**
 * Counts each character in a string, in the order each first appears. Emoji count as one character.
 *
 * @param {string} string - The text to count.
 * @returns {{char: string, count: number, first: number}[]} Each character, how often it appears, and where it first
 *   appears (1 for the first character).
 *
 * @example
 * // Input: "hello"
 * // Output: [{ char: "h", count: 1, first: 1 }, { char: "e", count: 1, first: 2 }, { char: "l", count: 2, first: 3 }, { char: "o", count: 1, first: 5 }]
 */
export function characterFrequencies(string) {
    const counts = new Map();
    [...string].forEach((char, index) => {
        const entry = counts.get(char);
        if (entry) {
            entry.count++;
        } else {
            counts.set(char, { char, count: 1, first: index + 1 });
        }
    });
    return [...counts.values()];
}
