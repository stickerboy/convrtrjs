import { lettersOnly } from '../strings.js';

/**
 * The letters and number of rails to use: letters only, as the rail fence is traditionally written, and no more rails
 * than letters. Extra rails would only ever hold nothing, so capping them leaves the result the same, and saves setting
 * aside room for millions of empty rails.
 *
 * @param {string} string - The text to encode or decode.
 * @param {number|string} rails - The number of rails asked for, as a number or the text of the tool's field.
 * @returns {{letters: string, rails: number}} - The text's letters, and the number of rails to use.
 * @throws {Error} - If rails isn't a whole number of 2 or more.
 */
function prepare(string, rails) {
    const count = Number(rails);
    if (!Number.isInteger(count) || count < 2) {
        throw new Error("A minimum of 2 rails is required to make the cipher work effectively");
    }
    const letters = lettersOnly(string);
    return { letters, rails: Math.min(count, Math.max(letters.length, 2)) };
}

/**
 * Where each rail's letters start in the encoded text. Letters zigzag down and up the rails, so the pattern repeats every
 * 2 × (rails - 1) letters, and the rail for letter i is worked out from where i falls in that cycle.
 *
 * @param {number} length - The number of letters.
 * @param {number} rails - The number of rails, 2 or more.
 * @returns {{starts: number[], cycle: number}} - Each rail's first position in the encoded text, and the length of the
 *   zigzag's cycle.
 */
function railStarts(length, rails) {
    const cycle = 2 * (rails - 1);
    const counts = new Array(rails).fill(0);
    for (let i = 0; i < length; i++) {
        const step = i % cycle;
        counts[step < rails ? step : cycle - step]++;
    }
    const starts = new Array(rails);
    for (let rail = 0, total = 0; rail < rails; rail++) {
        starts[rail] = total;
        total += counts[rail];
    }
    return { starts, cycle };
}

/**
 * Encodes a string using the Rail Fence Cipher. Only letters are kept.
 *
 * @param {string} string - The input string to encode.
 * @param {number|string} rails - The number of rails, 2 or more.
 * @returns {string} - The encoded string.
 *
 * @example
 * // Input: "WE ARE DISCOVERED. FLEE AT ONCE" on 3 rails
 * // Output: "WECRLTEERDSOEEFEAOCAIVDEN"
 */
export function railFenceEncode(string, rails) {
    const { letters, rails: count } = prepare(string, rails);
    const { starts, cycle } = railStarts(letters.length, count);
    const out = new Array(letters.length);
    for (let i = 0; i < letters.length; i++) {
        const step = i % cycle;
        out[starts[step < count ? step : cycle - step]++] = letters[i];
    }
    return out.join("");
}

/**
 * Decodes a string encoded with the Rail Fence Cipher. Only letters are kept.
 *
 * @param {string} string - The encoded string to decode.
 * @param {number|string} rails - The number of rails used, 2 or more.
 * @returns {string} - The decoded string.
 */
export function railFenceDecode(string, rails) {
    const { letters, rails: count } = prepare(string, rails);
    const { starts, cycle } = railStarts(letters.length, count);
    const out = new Array(letters.length);
    for (let i = 0; i < letters.length; i++) {
        const step = i % cycle;
        out[i] = letters[starts[step < count ? step : cycle - step]++];
    }
    return out.join("");
}
