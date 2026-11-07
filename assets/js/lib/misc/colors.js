import { bytesToString } from "../toolkit.js";

/**
 * Turns text into hex colours: its UTF-8 bytes, three to a colour (red, green and blue), with the last colour padded if
 * it runs short.
 *
 * @param {string} text - The text to turn into colours.
 * @param {string} [paddingChar="F"] - What to pad the last colour with, "F" or "0".
 * @returns {{hex: string, text: string, padded: boolean}[]} Each colour as 6 hex digits in capitals (no #), the
 *   characters it holds, and whether it was padded.
 *
 * @example
 * // Input: "Hello"
 * // Output: [{ hex: "48656C", text: "Hel", padded: false }, { hex: "6C6FFF", text: "lo", padded: true }]
 */
export function textToColours(text, paddingChar = "F") {
    if (paddingChar !== "0" && paddingChar !== "F") {
        throw new Error(`Invalid padding character. Only "0" or "F" are allowed.`);
    }
    const bytes = new TextEncoder().encode(text);
    const decoder = new TextDecoder();
    const colours = [];
    for (let i = 0; i < bytes.length; i += 3) {
        const chunk = bytes.subarray(i, i + 3);
        colours.push({
            hex: Array.from(chunk, (byte) => byte.toString(16).toUpperCase().padStart(2, "0")).join("").padEnd(6, paddingChar),
            // A character split between two colours shows as part of neither
            text: decoder.decode(chunk).replace(/�/g, ""),
            padded: chunk.length < 3,
        });
    }
    return colours;
}

/**
 * Reads text back from hex colours, as textToColours makes them: with or without # or 0x, separated by spaces, commas,
 * semicolons or new lines, or run together. Padding (F or 0) at the end of the last colour is dropped.
 *
 * @param {string} input - The colours.
 * @returns {{text: string, colours: string[]}} The text, and each colour as 6 hex digits in capitals.
 * @throws {Error} If there are no colours, or something that isn't a 6-digit hex colour.
 *
 * @example
 * // Input: "#48656C #6C6FFF"
 * // Output: { text: "Hello", colours: ["48656C", "6C6FFF"] }
 */
export function coloursToText(input) {
    const tokens = input.replace(/#|0x/gi, " ").split(/[\s,;]+/).filter(Boolean);
    if (tokens.length === 0) {
        throw new Error("There are no colors to read");
    }
    const invalid = tokens.find((token) => !/^(?:[0-9a-f]{6})+$/i.test(token));
    if (invalid) {
        throw new Error(`"${invalid}" isn't a hex color: use 6 digits from 0-9 and A-F, such as #48656C`);
    }
    const colours = tokens.join("").toUpperCase().match(/.{6}/g);
    const bytes = colours.join("").match(/../g).map((pair) => parseInt(pair, 16));
    // Padding fills at most the last 2 bytes; neither 0xFF nor 0x00 is a character in text
    for (let i = 0; i < 2 && (bytes.at(-1) === 0xFF || bytes.at(-1) === 0x00); i++) {
        bytes.pop();
    }
    return { text: bytesToString(bytes), colours };
}
