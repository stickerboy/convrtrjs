/**
 * Unscrambles a string by swapping each pair of characters.
 * e.g. "abcdef" => "badcfe", "abcde" => "badce" (or "badc" with dropUnpaired)
 *
 * @param {string} string - The input scrambled string.
 * @param {boolean} [dropUnpaired=false] - Drop an unpaired last character, as the original ONI-Tools Ruby version does.
 * @returns {string} - The unscrambled string.
 */
export function unscramble(string, dropUnpaired = false) {
    const chars = Array.from(string);
    if (dropUnpaired && chars.length % 2 === 1) {
        chars.pop();
    }
    for (let i = 0; i + 1 < chars.length; i += 2) {
        [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
    }
    return chars.join("");
}