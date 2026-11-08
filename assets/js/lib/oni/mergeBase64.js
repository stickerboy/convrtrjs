/**
 * Merges several Base64 strings by taking the most common character at each position, and counts the positions where
 * they didn't all agree. Only the strings long enough to reach a position count there, so the result is as long as the
 * longest string. A tie goes to the character seen first.
 *
 * @param {...string} args - The strings to merge, at least two.
 * @returns {{merged: string, disagreements: number}} - The merged string, and how many positions had more than one
 *   character.
 */
export function compareBase64(...args) {
    if (args.length < 2) {
        throw new Error("Give at least two strings to merge");
    }
    const charArrays = args.map((string) => Array.from(string));
    const length = Math.max(...charArrays.map((chars) => chars.length));
    let merged = "";
    let disagreements = 0;

    for (let i = 0; i < length; i++) {
        const counts = new Map();
        for (const chars of charArrays) {
            if (i < chars.length) {
                counts.set(chars[i], (counts.get(chars[i]) ?? 0) + 1);
            }
        }
        if (counts.size > 1) {
            disagreements++;
        }
        // A Map keeps the order characters were first seen, and only a higher count replaces the best, so ties go to the first
        let best = "";
        let bestCount = 0;
        for (const [char, count] of counts) {
            if (count > bestCount) {
                best = char;
                bestCount = count;
            }
        }
        merged += best;
    }

    return { merged, disagreements };
}

/**
 * Merges several Base64 strings by taking the most common character at each position (see compareBase64).
 *
 * @param {...string} args - The strings to merge, at least two.
 * @returns {string} - The merged string.
 */
export function mergeBase64(...args) {
    return compareBase64(...args).merged;
}
