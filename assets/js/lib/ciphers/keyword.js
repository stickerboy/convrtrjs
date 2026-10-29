import { matchCase } from '../toolkit.js';
import { getCustomAlphabet, upperAlphabet } from './common.js';

/**
 * Replaces each letter found in one alphabet with the letter at the same position in another, keeping its case.
 */
function translate(string, from, to) {
    return string.replace(/[A-Za-z]/g, (c) => matchCase(c, to[from.indexOf(c.toUpperCase())]));
}

/**
 * Encodes a string using a keyword by creating a substitution cipher. The key's case doesn't matter and the input's case is kept.
 *
 * @param {string} string - The input string to encode.
 * @param {string} key - The keyword used for encoding.
 * @returns {string} - The encoded string.
 */
export function keywordEncode(string, key) {
    return translate(string, upperAlphabet, getCustomAlphabet(key));
}

/**
 * Decodes an encoded string using a keyword by reversing the substitution cipher. The key's case doesn't matter and the input's case is kept.
 *
 * @param {string} string - The encoded string to decode.
 * @param {string} key - The keyword used for decoding.
 * @returns {string} - The decoded original string.
 */
export function keywordDecode(string, key) {
    return translate(string, getCustomAlphabet(key), upperAlphabet);
}