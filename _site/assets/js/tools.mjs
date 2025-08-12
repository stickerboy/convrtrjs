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
 * Numbers only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with numbers.
 * @returns {string} - The input string with non-numeric characters removed.
 */
export function numbersOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^0-9 ]/g : /[^0-9]/g;
    return string.replace(regex, "");
}

/**
 * Letters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with letters.
 * @returns {string} - The input string with non-letter characters removed.
 */
export function lettersOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Za-z ]/g : /[^A-Za-z]/g;
    return string.replace(regex, "");
}

/**
 * Capital letters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with uppercase letters.
 * @returns {string} - The input string with non-uppercase letter characters removed.
 */
export function lettersOnlyCap(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Z ]/g : /[^A-Z]/g;
    return string.replace(regex, "");
}

/**
 * Lowercase letters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with lowercase letters.
 * @returns {string} - The input string with non-lowercase letter characters removed.
 */
export function lettersOnlyLow(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^a-z ]/g : /[^a-z]/g;
    return string.replace(regex, "");
}

/**
 * Remove special characters
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with alphanumeric characters.
 * @returns {string} - The input string with special characters removed.
 */
export function stripSpecialChars(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^0-9A-Za-z ]/g : /[^0-9A-Za-z]/g;
    return string.replace(regex, "");
}

/**
 * Remove all letters
 * @param {string} string - The input string.
 * @returns {string} - The input string with all letters removed.
 */
export function stripLetters(string) {
    return string.replace(/[A-Za-z]/g, "");
}

/**
 * Remove all numbers
 * @param {string} string - The input string.
 * @returns {string} - The input string with all numbers removed.
 */
export function stripNumbers(string) {
    return string.replace(/[0-9]/g, "");
}

/**
 * Special characters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with special characters.
 * @returns {string} - The input string containing only special characters.
 */
export function specialCharsOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[0-9A-Za-z]/g : /[0-9A-Za-z ]/g;
    return string.replace(regex, "");
}

/**
 * URL encode
 * @param {string} string - The input string.
 * @returns {string} - The URL-encoded string.
 */
export function urlEncode(string) {
    return encodeURIComponent(string).replace(/%20/g, "+");
}

/**
 * URL decode
 * @param {string} string - The URL-encoded string.
 * @returns {string} - The decoded string.
 */
export function urlDecode(string) {
    return decodeURIComponent(string).replace(/\+/g, "%20");
}

/**
 * Convert letters to their alphabet number: A = 1, B = 2, Z = 26
 * @param {string} string - The input string.
 * @returns {string} - A space-separated string of alphabet numbers.
 */
export function lettersToNumbers(string) {
    // Ensure only letters are processed
    const lettersOnlyString = lettersOnly(string);
    // Map letters to their corresponding numbers and join with spaces
    return lettersOnlyString
        .toLowerCase()
        .split("")
        .map(char => char.charCodeAt(0) - 97 + 1)
        .join(" ");
}

/**
 * Checks if a given string is valid JSON.
 *
 * @param {string} string - The string to test for JSON validity.
 * @returns {boolean} Returns true if the string is valid JSON, otherwise false.
 */
export function isJSON(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}