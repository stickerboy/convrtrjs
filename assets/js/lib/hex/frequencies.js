import * as toolkit from "../toolkit.js";

/**
 * Splits bytes into runs of the same byte, in order: "41 41 42" gives [{ byte: "41", length: 2 }, { byte: "42",
 * length: 1 }]. Read the hex once with this, then count it as many ways as needed.
 *
 * @param {string|string[]} hex - The hex, with any separator between bytes, or none; or its bytes from hexToPairs.
 * @returns {{byte: string, length: number}[]} Each run's byte, in capitals, and how many times it repeats.
 * @throws {Error} - If hex is text with invalid characters.
 */
export function hexRuns(hex) {
    const runs = [];
    let last = null;
    for (const pair of typeof hex === "string" ? toolkit.hexToPairs(hex) : hex) {
        const upper = pair.toUpperCase();
        if (last?.byte === upper) {
            last.length++;
        } else {
            last = { byte: upper, length: 1 };
            runs.push(last);
        }
    }
    return runs;
}

/**
 * Counts each byte, or with a runLength over 1, runs of the same byte repeated that many times. A run is counted
 * wherever it starts, and a longer run counts as several: five 41s are two runs of 2.
 *
 * @param {{byte: string, length: number}[]} runs - The runs, from hexRuns.
 * @param {string} delimiter - The delimiter to write each run's bytes with.
 * @param {number} runLength - How many of the same byte to count together: 1 for single bytes.
 * @returns {Object<string, number>} How many times each byte or run appears, in the order each first appears.
 */
export function countHexRuns(runs, delimiter, runLength) {
    const counts = {};
    for (const { byte, length } of runs) {
        const count = Math.floor(length / runLength);
        if (count > 0) {
            const key = toolkit.joinHex(Array(runLength).fill(byte), delimiter);
            counts[key] = (counts[key] || 0) + count;
        }
    }
    return counts;
}

/**
 * Counts each byte in a string of hex, or with a chunkSize over 2, runs of the same byte repeated (4 for "41 41", 6
 * for "41 41 41"). A run is counted wherever it starts, and a longer run counts as several: five 41s are two runs of 2.
 * To count the same hex several ways, read it once with hexRuns and use countHexRuns.
 *
 * @param {string} string - The input string containing hexadecimal values.
 * @param {string} delimiter - The delimiter to write the results with; the input can use any separator.
 * @param {number} chunkSize - How many hex digits to count together: 2 for single bytes, 4 for runs of 2, and so on.
 * @returns {Object<string, number>} The frequency of each byte or run, in the order each first appears.
 * @throws {Error} Throws an error if the hexadecimal contains invalid characters.
 */
export function generateHexFrequencies(string, delimiter, chunkSize = 2) {
    return countHexRuns(hexRuns(string), delimiter, chunkSize / 2);
}

/**
 * The longest run of the same byte: the first, if there's a tie.
 *
 * @param {string|{byte: string, length: number}[]} hex - The hex, with any separator between bytes, or none; or its
 *   runs from hexRuns.
 * @returns {{byte: string, length: number}|null} The byte, in capitals, and how many times it repeats, or null with no hex.
 *
 * @example
 * // Input: "00 41 41 41 00"
 * // Output: { byte: "41", length: 3 }
 */
export function longestHexRun(hex) {
    const runs = typeof hex === "string" ? hexRuns(hex) : hex;
    return runs.reduce((longest, run) => (run.length > (longest?.length ?? 0) ? run : longest), null);
}
