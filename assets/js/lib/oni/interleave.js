/**
 * Interleaves the characters of two strings, then adds the rest of the longer one. Whole characters are taken, so an
 * emoji isn't split in half.
 *
 * @param {string} string1 - The first string.
 * @param {string} string2 - The second string.
 * @param {string} [delimiter=""] - Put between every character, which may be useful when interleaving hexadecimal strings.
 * @returns {string} - The interleaved string.
 */
export function interleave(string1, string2, delimiter = "") {
    const first = Array.from(string1);
    const second = Array.from(string2);
    const result = [];

    for (let i = 0; i < Math.max(first.length, second.length); i++) {
        if (i < first.length) {
            result.push(first[i]);
        }
        if (i < second.length) {
            result.push(second[i]);
        }
    }

    return result.join(delimiter);
}
