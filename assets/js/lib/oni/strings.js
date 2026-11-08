/**
 * Finds the runs of printable characters in a string, and where each starts.
 *
 * @param {string} string - The input string to be scanned.
 * @param {number} [n=4] - The minimum length of a run, a whole number of at least 1.
 * @returns {Array<{text: string, position: number}>} - Each run of at least `n` printable characters, with its position:
 *   how many characters come before it, counting an emoji as one, from 0.
 */
export function findStrings(string, n = 4) {
    const min = Number(n);
    if (!Number.isInteger(min)) {
        throw new Error("The minimum character count must be a whole number");
    }
    if (min < 1) {
        throw new Error("Minimum character count cannot be less than one");
    }
    // Regular expression to match sequences of at least `min` printable characters
    const regex = new RegExp(`[\\x20-\\x7E]{${min},}`, "g");
    const runs = [];
    // Positions are counted from the end of the last run, so the string is only walked once
    let position = 0;
    let index = 0;
    for (const match of string.matchAll(regex)) {
        position += Array.from(string.slice(index, match.index)).length;
        runs.push({ text: match[0], position });
        position += match[0].length;
        index = match.index + match[0].length;
    }
    return runs;
}

/**
 * Extracts sequences of printable characters from a string.
 *
 * @param {string} string - The input string to be scanned.
 * @param {number} [n=4] - The minimum length of sequences to extract, a whole number of at least 1.
 * @returns {Array<string>} - An array of sequences of printable characters of at least length `n`.
 */
export function strings(string, n = 4) {
    return findStrings(string, n).map((run) => run.text);
}
