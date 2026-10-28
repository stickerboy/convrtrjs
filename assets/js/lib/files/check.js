import HEADERS from "../../data/headers.json" with { type: "json" };

/**
 * Reads the first 16 bytes of a file and tries to match them against known file headers.
 *
 * @param {Blob} file - The file to analyze.
 * @returns {Promise<{hex: string, text: string, label: string|null}>} - The header bytes as hex and as text,
 * and the matching file type's label (null if there's no match).
 */
export async function getFileHeader(file) {
    const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const hex = convertToHexString(bytes);

    return { hex, text: String.fromCharCode(...bytes), label: matchFileHeader(hex) };
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
 * Matches a file header against known headers.
 *
 * @param {string} hexString - The hexadecimal string representation of the file header.
 * @returns {string|null} - The label of the first matching file type, or null if no match is found.
 */
export function matchFileHeader(hexString) {
    const hex = hexString.toUpperCase();
    return HEADERS.find((header) => header.hex.some((item) => hex.includes(item)))?.label ?? null;
}
