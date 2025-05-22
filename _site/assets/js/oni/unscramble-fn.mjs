/**
 * Unscrambles a string by interleaving its characters.
 * e.g. "abcdef" => "badcfe"
 *
 * @param {string} string - The input scrambled string.
 * @returns {string} - The unscrambled string.
 */
export function unscramble(string) {
    const length = string.length;
    const part1 = [];
    const part2 = [];

    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            part2.push(string[i]);
        } else {
            part1.push(string[i]);
        }
    }

    let result = "";
    for (let i = 0; i < part1.length; i++) {
        result += part1[i] + (part2[i] || "");
    }

    return result;
}