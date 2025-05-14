/**
 * Interleaves the characters of two strings.
 *
 * @param {string} string1 - The first string.
 * @param {string} string2 - The second string.
 * * @param {string} delimiter - An optional delimiter which may be useful when interleaving hexadecimal strings.
 * @returns {string} - The interleaved string.
 */
export function interleave(string1, string2, delimiter = "") {
    let result = [];
    let length = Math.min(string1.length, string2.length);

    for (let i = 0; i < length; i++) {
        result.push(string1[i], string2[i]);
    }

    // If string1 is longer, add the remaining characters
    if (string1.length > string2.length) {
        result.push(...string1.slice(length));
    }

    // If string2 is longer, add the remaining characters
    if (string2.length > string1.length) {
        result.push(...string2.slice(length));
    }

    return result.join(delimiter);
}