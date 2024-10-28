/**
 * Remove spaces
 * @param {string} string - The input string.
 * @returns {string} - The input string with spaces removed.
 */
function stripSpaces(string) {
    return string.replace(/ /g, "");
}

/**
 * Uppercase string
 * @param {string} string - The input string.
 * @returns {string} - The input string in uppercase.
 */
function uppercase(string) {
    return string.toLocaleUpperCase();
}

/**
 * Lowercase string
 * @param {string} string - The input string.
 * @returns {string} - The input string in lowercase.
 */
function lowercase(string) {
    return string.toLocaleLowerCase();
}

/**
 * Numbers only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with numbers.
 * @returns {string} - The input string with non-numeric characters removed.
 */
function numbersOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^0-9 ]/g : /[^0-9]/g;
    return string.replace(regex, "");
}

/**
 * Letters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with letters.
 * @returns {string} - The input string with non-letter characters removed.
 */
function lettersOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Za-z ]/g : /[^A-Za-z]/g;
    return string.replace(regex, "");
}

/**
 * Capital letters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with uppercase letters.
 * @returns {string} - The input string with non-uppercase letter characters removed.
 */
function lettersOnlyCap(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Z ]/g : /[^A-Z]/g;
    return string.replace(regex, "");
}

/**
 * Lowercase letters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with lowercase letters.
 * @returns {string} - The input string with non-lowercase letter characters removed.
 */
function lettersOnlyLow(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^a-z ]/g : /[^a-z]/g;
    return string.replace(regex, "");
}

/**
 * Remove special characters
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with alphanumeric characters.
 * @returns {string} - The input string with special characters removed.
 */
function stripSpecialChars(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^0-9A-Za-z ]/g : /[^0-9A-Za-z]/g;
    return string.replace(regex, "");
}

/**
 * Remove all letters
 * @param {string} string - The input string.
 * @returns {string} - The input string with all letters removed.
 */
function stripLetters(string) {
    return string.replace(/[A-Za-z]/g, "");
}

/**
 * Remove all numbers
 * @param {string} string - The input string.
 * @returns {string} - The input string with all numbers removed.
 */
function stripNumbers(string) {
    return string.replace(/[0-9]/g, "");
}

/**
 * Special characters only
 * @param {string} string - The input string.
 * @param {boolean} [preserveSpaces=false] - If true, preserves spaces along with special characters.
 * @returns {string} - The input string containing only special characters.
 */
function specialCharsOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[0-9A-Za-z]/g : /[0-9A-Za-z ]/g;
    return string.replace(regex, "");
}

/**
 * URL encode
 * @param {string} string - The input string.
 * @returns {string} - The URL-encoded string.
 */
function urlEncode(string) {
    return encodeURIComponent(string).replace(/%20/g, "+");
}

/**
 * URL decode
 * @param {string} string - The URL-encoded string.
 * @returns {string} - The decoded string.
 */
function urlDecode(string) {
    return decodeURIComponent(string).replace(/\+/g, " ");
}

/**
 * Convert letters to their alphabet number: A = 1, B = 2, Z = 26
 * @param {string} string - The input string.
 * @returns {string} - A space-separated string of alphabet numbers.
 */
function lettersToNumbers(string) {
    string = lettersOnly(string);
    const numbers = [];
    string.split("").forEach((s) => { 
        numbers.push(s.toLowerCase().charCodeAt(0) - 97 + 1);
    });
    return numbers.join(" ");
}