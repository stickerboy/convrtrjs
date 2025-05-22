import { alphabet } from '../toolkit.mjs';
import { getCustomAlphabet } from './ciphers-fn.mjs';

/**
 * Encodes a string using a keyword by creating a substitution cipher that supports both uppercase and lowercase keys.
 *
 * @param {string} string - The input string to encode.
 * @param {string} key - The keyword used for encoding, supporting both uppercase and lowercase.
 * @returns {string} - The encoded string.
 */
export function keywordEncode(string, key) {
    const customAlphabet = getCustomAlphabet(key);
    const trans = customAlphabet;

    return string.replace(/[A-Za-z]/g, function (c) {
        return trans[alphabet.indexOf(c)];
    });
}

/**
 * Decodes an encoded string using a keyword by reversing the substitution cipher that supports both uppercase and lowercase keys.
 *
 * @param {string} string - The encoded string to decode.
 * @param {string} key - The keyword used for decoding, supporting both uppercase and lowercase.
 * @returns {string} - The decoded original string.
 */
export function keywordDecode(string, key) {
    const customAlphabet = getCustomAlphabet(key);
    const trans = customAlphabet;

    return string.replace(/./g, function (c) {
        const index = trans.indexOf(c); 
        return index !== -1 ? alphabet[index] : c; // Map back to the original alphabet or keep the character as-is
    });
}