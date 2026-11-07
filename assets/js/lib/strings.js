import { graphemes, characterKinds } from "./toolkit.js";

/**
 * Strips spaces or all whitespace characters from a string.
 * @param {string} string - The input string to process.
 * @param {boolean} [removeAllWhitespace=false] - Flag to indicate if all whitespace should be removed.
 * @returns {string} - The resulting string after removing the specified characters.
 */
export function stripSpaces(string, removeAllWhitespace = false) {
    const regex = removeAllWhitespace ? /\s+/g : / /g;
    return string.replace(regex, "");
}

/**
 * Uppercase string
 * @param {string} string - The input string.
 * @returns {string} - The input string in uppercase.
 */
export function uppercase(string) {
    return string.toLocaleUpperCase();
}

/**
 * Lowercase string
 * @param {string} string - The input string.
 * @returns {string} - The input string in lowercase.
 */
export function lowercase(string) {
    return string.toLocaleLowerCase();
}

/**
 * Keeps the characters of a kind, as characterKind sorts them, and drops the rest. Characters are taken as they're
 * seen (see graphemes), so an accent goes with its letter and an emoji with a skin tone is kept or dropped whole.
 *
 * @param {string} string - The input string.
 * @param {(kind: ReturnType<typeof characterKind>) => boolean} keep - Whether to keep a character.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines too, so lines stay apart.
 * @returns {string} - The characters kept, in order.
 */
function keepCharacters(string, keep, preserveSpaces = false) {
    const kindOf = characterKinds();
    return graphemes(string).filter((char) => {
        const kind = kindOf(char);
        return (preserveSpaces === true && kind.space) || keep(kind);
    }).join("");
}

/**
 * Numbers only, including other numerals such as ², ½ and ٣
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines along with numbers.
 * @returns {string} - The input string with everything but numbers removed.
 */
export function numbersOnly(string, preserveSpaces) {
    return keepCharacters(string, (kind) => kind.number, preserveSpaces);
}

/**
 * Letters only, including accented and other alphabets' letters, such as é, ß and Ж
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines along with letters.
 * @returns {string} - The input string with everything but letters removed.
 */
export function lettersOnly(string, preserveSpaces) {
    return keepCharacters(string, (kind) => kind.letter, preserveSpaces);
}

/**
 * Capital letters only, including accented and other alphabets' capitals, such as É and Ж
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines along with capital letters.
 * @returns {string} - The input string with everything but capital letters removed.
 */
export function lettersOnlyCap(string, preserveSpaces) {
    return keepCharacters(string, (kind) => kind.upper, preserveSpaces);
}

/**
 * Lowercase letters only, including accented and other alphabets' lowercase letters, such as é, ß and ж
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines along with lowercase letters.
 * @returns {string} - The input string with everything but lowercase letters removed.
 */
export function lettersOnlyLow(string, preserveSpaces) {
    return keepCharacters(string, (kind) => kind.lower, preserveSpaces);
}

/**
 * Remove special characters: keeps only letters and numbers, of any alphabet
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines along with letters and numbers.
 * @returns {string} - The input string with special characters removed.
 */
export function stripSpecialChars(string, preserveSpaces) {
    return keepCharacters(string, (kind) => kind.letter || kind.number, preserveSpaces);
}

/**
 * Remove all letters, of any alphabet
 * @param {string} string - The input string.
 * @returns {string} - The input string with all letters removed.
 */
export function stripLetters(string) {
    return keepCharacters(string, (kind) => !kind.letter);
}

/**
 * Remove all numbers, including other numerals such as ² and ½
 * @param {string} string - The input string.
 * @returns {string} - The input string with all numbers removed.
 */
export function stripNumbers(string) {
    return keepCharacters(string, (kind) => !kind.number);
}

/**
 * Special characters only: everything that isn't a letter, number or space (including tabs and new lines), of any
 * alphabet
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, keeps spaces, tabs and new lines along with special characters.
 * @returns {string} - The input string containing only special characters.
 */
export function specialCharsOnly(string, preserveSpaces) {
    return keepCharacters(string, (kind) => !kind.letter && !kind.number && !kind.space, preserveSpaces);
}

/**
 * URL encode (a space is written as +, as in form data and query strings)
 * @param {string} string - The input string.
 * @returns {string} - The URL-encoded string.
 * @throws {Error} - If the text has half of an emoji or other character on its own, which can't be written as UTF-8.
 */
export function urlEncode(string) {
    try {
        return encodeURIComponent(string).replace(/%20/g, "+");
    } catch {
        // Only a lone surrogate, half of a character such as an emoji, can make encodeURIComponent throw
        throw new Error("The text has half of an emoji or other character on its own, which can't be URL encoded");
    }
}

/**
 * URL decode (+ is read as a space, as in form data and query strings)
 * @param {string} string - The URL-encoded string.
 * @returns {string} - The decoded string.
 * @throws {Error} - If a % isn't followed by a valid escape sequence.
 */
export function urlDecode(string) {
    try {
        return decodeURIComponent(string.replace(/\+/g, " "));
    } catch {
        throw new Error("Not a valid URL-encoded string, each % must be followed by two hex digits");
    }
}

/**
 * Convert letters to their alphabet number: A = 1, B = 2, Z = 26. Accents are taken off first, so é is 5, and letters
 * that aren't A to Z with or without an accent (ß, æ, Ж) are left out, as is everything that isn't a letter.
 * @param {string} string - The input string.
 * @returns {string} - A space-separated string of alphabet numbers.
 *
 * @example
 * // Input: "Café"
 * // Output: "3 1 6 5"
 */
export function lettersToNumbers(string) {
    // Each different character is worked out once: most texts use only a few
    const numbers = new Map();
    const out = [];
    for (const char of graphemes(string)) {
        let number = numbers.get(char);
        if (number === undefined) {
            // "é" comes apart into "e" and its accent, which is dropped; 0 for anything that isn't A to Z
            const base = char.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
            number = /^[a-z]$/.test(base) ? base.charCodeAt(0) - 96 : 0;
            numbers.set(char, number);
        }
        if (number) {
            out.push(number);
        }
    }
    return out.join(" ");
}

/**
 * Checks if a given string is valid JSON.
 *
 * @param {string} string - The string to test for JSON validity.
 * @returns {boolean} Returns true if the string is valid JSON, otherwise false.
 */
export const isLikelyJSON = (string) => {
    if (typeof string !== "string") return false;

        try {
            const parsed = JSON.parse(string);

            // Only treat as JSON if it's an object or array
            return typeof parsed === "object" && parsed !== null;
        } catch {
            return false;
        }
    };
