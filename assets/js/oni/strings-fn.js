/**
 * Extracts sequences of printable characters from a string.
 *
 * @param {string} data - The input string to be scanned.
 * @param {number} [n=4] - The minimum length of sequences to extract.
 * @returns {Array<string>} - An array of sequences of printable characters of at least length `n`.
 */
export function strings(string, n = 4) {
    if (n < 1) {
        throw new Error("Minimum character count cannot be less than one");
    } else {
        // Regular expression to match sequences of at least `n` printable characters
        const regex = new RegExp(`[\\x20-\\x7E]{${n},}`, 'g');
        return string.match(regex) || [];
    }
}