/**
 * Extracts characters from the data string at specific positions based on calendar-like offsets.
 *
 * @param {string} string - The input string.
 * @returns {string} - The resulting string after extracting specific characters.
 */
export function calendar(string) {
    const deltas = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    let out = "";
    const count = string.length;
    let offset = 31;
    let n = 1;

    while (offset < count) {
        out += string[offset];
        offset = deltas[n % 12] + n + Math.floor(n / 12) * 365;
        n += 1;
    }

    return out;
}