import HEADERS from "../../data/headers.json" with { type: "json" };

// How much of a file is read: enough for the longest header in the list
export const HEADER_LENGTH = 36;

/**
 * @typedef {object} HeaderMatch
 * @property {string} name - The file type, e.g. "PNG image".
 * @property {string} description - More about the type.
 * @property {string[]} extensions - The type's usual extensions, without dots.
 * @property {string} header - The header that matched, as hex with ?? for any byte.
 * @property {boolean[]} mask - For each byte of the header, whether it had to match (false for ??).
 */

/**
 * Reads the first 36 bytes of a file and tries to match them against known file headers.
 *
 * @param {Blob} file - The file to analyze.
 * @returns {Promise<{bytes: Uint8Array, hex: string, text: string, match: HeaderMatch|null}>} - The bytes read, as hex and
 *   as text, and the type they match (null if there's no match).
 */
export async function getFileHeader(file) {
    const bytes = new Uint8Array(await file.slice(0, HEADER_LENGTH).arrayBuffer());
    return { bytes, hex: convertToHexString(bytes), text: String.fromCharCode(...bytes), match: matchFileHeader(bytes) };
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * @param {Uint8Array} uint8Array - The Uint8Array to convert.
 * @returns {string} - The hexadecimal string representation.
 */
export function convertToHexString(uint8Array) {
    return Array.from(uint8Array, byte => byte.toString(16).padStart(2, "0")).join(" ");
}

/**
 * Matches the start of a file against known headers. A header matches from the file's first byte, with ?? matching any
 * byte. When several match, the one with the most bytes that had to match wins, so "FF FE 00 00" (UTF-32) beats
 * "FF FE" (UTF-16), and "RIFF ???? WEBP" beats "RIFF".
 *
 * @param {Uint8Array|number[]|string} start - The file's first bytes, or them as hex with any separator.
 * @returns {HeaderMatch|null} - The best match, or null if no header matches.
 */
export function matchFileHeader(start) {
    const bytes = typeof start === "string"
        ? (start.replace(/[^0-9a-f]/gi, "").match(/../g) ?? []).map((pair) => parseInt(pair, 16))
        : [...start];
    let best = null;
    for (const type of HEADERS) {
        for (const header of type.hex) {
            const wanted = header.split(" ").map((byte) => (byte === "??" ? null : parseInt(byte, 16)));
            const fits = wanted.length <= bytes.length && wanted.every((byte, i) => byte === null || byte === bytes[i]);
            const known = wanted.filter((byte) => byte !== null).length;
            if (fits && known > (best?.known ?? 0)) {
                best = { type, header, wanted, known };
            }
        }
    }
    return best && {
        name: best.type.name,
        description: best.type.description,
        extensions: best.type.extensions.split(",").map((extension) => extension.trim()).filter(Boolean),
        header: best.header,
        mask: best.wanted.map((byte) => byte !== null),
    };
}
