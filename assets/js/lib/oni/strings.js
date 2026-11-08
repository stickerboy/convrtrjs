/**
 * Extracts sequences of printable characters from a string.
 *
 * @param {string} string - The input string to be scanned.
 * @param {number} [n=4] - The minimum length of sequences to extract, a whole number of at least 1.
 * @returns {Array<string>} - An array of sequences of printable characters of at least length `n`.
 */
export function strings(string, n = 4) {
    const min = Number(n);
    if (!Number.isInteger(min)) {
        throw new Error("The minimum character count must be a whole number");
    }
    if (min < 1) {
        throw new Error("Minimum character count cannot be less than one");
    }
    // Regular expression to match sequences of at least `min` printable characters
    const regex = new RegExp(`[\\x20-\\x7E]{${min},}`, "g");
    return string.match(regex) || [];
}
