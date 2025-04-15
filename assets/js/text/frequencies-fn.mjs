import * as tools from '../tools.mjs';

/**
 * Provides various information about a given string based on the specified stat
 *
 * @param {string} string - The input string to analyze.
 * @param {string} stat - The type of information to retrieve / statistic to calculate (e.g., "word-count", "char-count", etc.).
 * @param {string} delimiter - Optional delimiter used for splitting words or characters.
 * @returns {number|string} - The calculated statistic or an error message if the stat is not available.
 *
 * @example
 * // Input: "Hello, world!", stat: "word-count", delimiter: " "
 * // Output: 2
 */
export function stringStats(string, stat, delimiter = " ") {
    // Mapping object for statistic functions
    const statFunctions = {
        "word-count":           str => str.split(delimiter).length,
        "char-count":           str => str.length,
        "char-count-ns":        str => tools.stripSpaces(str).length,
        "letter-count":         str => tools.lettersOnly(str).length,
        "letter-count-caps":    str => tools.lettersOnlyCap(str, true).length,
        "letter-count-low":     str => tools.lettersOnlyLow(str).length,
        "number-count":         str => tools.numbersOnly(str).length,
        "special-count":        str => tools.specialCharsOnly(str, true).length,
        "special-count-ns":     str => tools.specialCharsOnly(str).length
    };

    // Get the selected stat function
    const selectedStatFunction = statFunctions[stat];
    return selectedStatFunction ? selectedStatFunction(string) : "No statistic specified or statistic is not available";
}