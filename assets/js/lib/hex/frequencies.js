import * as toolkit from "../toolkit.js";

/**
 * Splits hex into runs of the same byte, in order: "41 41 42" gives [{ byte: "41", length: 2 }, { byte: "42", length: 1 }].
 *
 * @param {string} string - The hex, with any separator between bytes, or none.
 * @returns {{byte: string, length: number}[]} Each run's byte, in capitals, and how many times it repeats.
 */
function hexRuns(string) {
    const runs = [];
    for (const byte of toolkit.hexToPairs(string)) {
        const upper = byte.toUpperCase();
        const last = runs.at(-1);
        if (last?.byte === upper) {
            last.length++;
        } else {
            runs.push({ byte: upper, length: 1 });
        }
    }
    return runs;
}

/**
 * Counts each byte in a string of hex, or with a chunkSize over 2, runs of the same byte repeated (4 for "41 41", 6
 * for "41 41 41"). A run is counted wherever it starts, and a longer run counts as several: five 41s are two runs of 2.
 *
 * @param {string} string - The input string containing hexadecimal values.
 * @param {string} delimiter - The delimiter to write the results with; the input can use any separator.
 * @param {number} chunkSize - How many hex digits to count together: 2 for single bytes, 4 for runs of 2, and so on.
 * @returns {Object} An object containing the frequency of each hexadecimal substring, in the order each first appears.
 *
 * @throws {Error} Throws an error if the hexadecimal contains invalid characters.
**/
export function generateHexFrequencies(string, delimiter, chunkSize = 2) {
    const runLength = chunkSize / 2;
    const hexFrequencies = {};
    for (const { byte, length } of hexRuns(string)) {
        const count = Math.floor(length / runLength);
        if (count > 0) {
            const withDelimiter = toolkit.joinHex(Array(runLength).fill(byte), delimiter);
            hexFrequencies[withDelimiter] = (hexFrequencies[withDelimiter] || 0) + count;
        }
    }
    return hexFrequencies;
}

/**
 * The longest run of the same byte in a string of hex: the first, if there's a tie.
 *
 * @param {string} string - The hex, with any separator between bytes, or none.
 * @returns {{byte: string, length: number}|null} The byte, in capitals, and how many times it repeats, or null with no hex.
 *
 * @example
 * // Input: "00 41 41 41 00"
 * // Output: { byte: "41", length: 3 }
 */
export function longestHexRun(string) {
    return hexRuns(string).reduce((longest, run) => (run.length > (longest?.length ?? 0) ? run : longest), null);
}
