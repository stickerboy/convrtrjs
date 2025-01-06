import { getKeyValue } from '../toolkit.mjs';

// Braille
var braille = [[" ", " "], ["⠀", " "], ["⠸", "_"], ["⠤", "-"], ["⠠", ","], ["⠰", ";"], ["⠱", ":"], ["⠮", "!"], ["⠹", "?"], ["⠨", "."], ["⠷", "("], ["⠪", "["], ["⠈", "@"], ["⠡", "*"], ["⠌", "/"], ["⠄", "'"], ["⠐", "\""], ["⠳", "\\"], ["⠯", "&"], ["⠩", "%"], ["⠘", "^"], ["⠬", "+"], ["⠣", "<"], ["⠜", ">"], ["⠫", "$"], ["⠴", "0"], ["⠂", "1"], ["⠆", "2"], ["⠒", "3"], ["⠲", "4"], ["⠢", "5"], ["⠖", "6"], ["⠶", "7"], ["⠦", "8"], ["⠔", "9"], ["⠁", "A"], ["⠃", "B"], ["⠉", "C"], ["⠙", "D"], ["⠑", "E"], ["⠋", "F"], ["⠛", "G"], ["⠓", "H"], ["⠊", "I"], ["⠚", "J"], ["⠅", "K"], ["⠇", "L"], ["⠍", "M"], ["⠝", "N"], ["⠕", "O"], ["⠏", "P"], ["⠟", "Q"], ["⠗", "R"], ["⠎", "S"], ["⠞", "T"], ["⠥", "U"], ["⠧", "V"], ["⠺", "W"], ["⠭", "X"], ["⠵", "Z"], ["⠻", "]"], ["⠼", "#"], ["⠽", "Y"], ["⠾", ")"], ["⠿", "="]];

// Forerunner
export const fralphabet = [[" ", " "], ["…", "0"], ["†", "1"], ["‡", "2"], ["ˆ", "3"], ["Š", "4"], ["Œ", "5"], ["Ž", "6"], ["‘", "7"], ["’", "8"], ["“", "9"], ["™", "A"], ["š", "B"], ["œ", "C"], ["ž", "D"], ["Ÿ", "E"], ["¡", "F"], ["¤", "G"], ["¥", "H"], ["¦", "I"], ["§", "J"], ["«", "K"], ["¬", "L"], ["®", "M"], ["¯", "N"], ["±", "O"], ["²", "P"], ["´", "Q"], ["µ", "R"], ["º", "S"], ["»", "T"], ["½", "U"], ["¾", "V"], ["¿", "W"], ["À", "X"], ["Â", "Y"], ["Ã", "Z"], ["Å", "Æ"]
];

/**
 * Converts between Braille and text using a specified map.
 * If `mode` is "braille", converts from Braille to text.
 * If `mode` is "text", converts from text to Braille.
 * @param {string} string - The string to convert.
 * @param {string} mode - The mode of conversion, either "braille" or "text".
 * @param {Array<Array<string>>} [map=braille] - The custom map to use for conversion. Defaults to the "braille" map.
 * @returns {string} - The converted string.
 */
export function convertBraille(string, mode, map = braille) {
    if (mode === "braille") {
        return string.split("").map(b => getKeyValue(b.toUpperCase(), map)).join("");
    } else if (mode === "text") {
        return string.split("").map(b => getKeyValue(b.toUpperCase(), map, "value")).join("");
    } else {
        throw new Error(`Invalid mode "${mode}". Use "braille" or "text".`);
    }
}

/**
 * Splits a hex string into chunks of a specified size and pads each chunk if necessary.
 * 
 * This function takes a hexadecimal string and splits it into chunks of the specified size.
 * If a chunk has fewer characters than the specified size, it pads the chunk with the specified padding character
 * (either "0" or "F") to reach the desired length. Each chunk is then prefixed with "#" to form valid hex color codes.
 * 
 * @param {string} hex - The hexadecimal string to be split into chunks.
 * @param {number} chunkSize - The size of each chunk.
 * @param {string} [paddingChar="F"] - The character to pad chunks with, default is "F".
 * @returns {string[]} An array of hex color codes, each prefixed with "#".
 * @throws {Error} Throws an error if the padding character is not "0" or "F".
 */
export function hexToChunks(hex, chunkSize, paddingChar = "F") {
    // Validate the padding character
    if (paddingChar !== "0" && paddingChar !== "F") {
        throw new Error(`Invalid padding character. Only "0" or "F" are allowed.`);
    }

    let chunks = [];
    for (let i = 0; i < hex.length; i += chunkSize) {
        let chunk = hex.slice(i, i + chunkSize);
        // Pad chunk with the specified padding character if it's less than chunk size
        chunk = chunk.padEnd(chunkSize, paddingChar);
        chunks.push(`<div class="color-block" style="background-color:#${chunk}" title="#${chunk}">
                        <span class="visually-hidden">#${chunk}</span>
                     </div>`);
    }
    return chunks.join("");
}

/**
 * Converts periodic elements from a string representation to their corresponding target property values.
 * @param {string} string - The input string containing element representations.
 * @param {string} sourceProp - The property used for matching elements in the input string.
 * @param {string} targetProp - The target property whose value should be extracted.
 * @param {boolean} removeDelimiters - Whether to remove delimiters (optional, default is false).
 * @returns {string} - The resulting string after converting elements.
 * @throws {Error} - Throws an error if an element with the specified source property is not found,
 * or if the target property does not exist for a matched element.
 */
export function convertElements(string, sourceProp, targetProp, removeDelimiters) {
    const strings = string.trim().split(/[ ,:;\-]+/);
    const results = [];

    for (const str of strings) {
        let found = false;

        for (const el of ELEMENTS) {
            if (el.hasOwnProperty(sourceProp)) {
                // Compare the value regardless of its type (string or number)
                if (el[sourceProp] === str || el["number"] === Number(str)) {
                    if (el.hasOwnProperty(targetProp)) {
                        const targetValue = el[targetProp];
                        results.push(targetValue);
                        found = true;
                        break;
                    } else {
                        throw new Error(`Property "${targetProp}" does not exist for ${el.name}`);
                    }
                }
            }
        }

        if (!found) {
            throw new Error(`Element with ${sourceProp} "${str}" not found`);
        }
    }

    let convertedElements;
    if (removeDelimiters && removeDelimiters === true) {
        convertedElements = results.join("");
    } else {
        convertedElements = results.join(string.match(/[ ,\-]+/));
    }
    return convertedElements;
}