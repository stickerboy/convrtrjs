import { getKeyValue } from '../toolkit.mjs';
var braille = [[" ", " "], ["⠀", " "], ["⠸", "_"], ["⠤", "-"], ["⠠", ","], ["⠰", ";"], ["⠱", ":"], ["⠮", "!"], ["⠹", "?"], ["⠨", "."], ["⠷", "("], ["⠪", "["], ["⠈", "@"], ["⠡", "*"], ["⠌", "/"], ["⠄", "'"], ["⠐", "\""], ["⠳", "\\"], ["⠯", "&"], ["⠩", "%"], ["⠘", "^"], ["⠬", "+"], ["⠣", "<"], ["⠜", ">"], ["⠫", "$"], ["⠴", "0"], ["⠂", "1"], ["⠆", "2"], ["⠒", "3"], ["⠲", "4"], ["⠢", "5"], ["⠖", "6"], ["⠶", "7"], ["⠦", "8"], ["⠔", "9"], ["⠁", "A"], ["⠃", "B"], ["⠉", "C"], ["⠙", "D"], ["⠑", "E"], ["⠋", "F"], ["⠛", "G"], ["⠓", "H"], ["⠊", "I"], ["⠚", "J"], ["⠅", "K"], ["⠇", "L"], ["⠍", "M"], ["⠝", "N"], ["⠕", "O"], ["⠏", "P"], ["⠟", "Q"], ["⠗", "R"], ["⠎", "S"], ["⠞", "T"], ["⠥", "U"], ["⠧", "V"], ["⠺", "W"], ["⠭", "X"], ["⠵", "Z"], ["⠻", "]"], ["⠼", "#"], ["⠽", "Y"], ["⠾", ")"], ["⠿", "="]];

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