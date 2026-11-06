export const alphabet	= " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const alphaFlip	= " ⱯQƆPƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Zɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇnʌʍxʎz";
export const alphaRot  = " NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";

// Morse map
export const morseTextDict = {
    "-----": "0", ".----": "1", "..---": "2", "...--": "3", "....-": "4", ".....": "5", "-....": "6", "--...": "7", 
    "---..": "8", "----.": "9", ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F", "--.": "G", 
    "....": "H", "..": "I", ".---": "J", "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O", ".--.": "P", 
    "--.-": "Q", ".-.": "R", "...": "S", "-": "T", "..-": "U", "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y", 
    "--..": "Z", "-.-.--": "!", ".-.-.-": ".", "--..--": ",", "-..-.": "/", "..--..": "?", "-.--.-": ")", "-.--.": "(", 
    ".-...": "&", "---...": ":", "-.-.-.": ";", "-...-": "=", ".-.-.": "+", "-....-": "-", "..--.-": "_", "...-..-": "$", 
    ".--.-.": "@"
};
export const textMorseDict = Object.fromEntries(Object.entries(morseTextDict).map(([k, v]) => [v, k]));


/**
 * Trims whitespace from the start and end of a string. 
 * @param {string} input - The input string to be trimmed. 
 * @returns {string} The trimmed string. 
 **/
 export function cleanString(string) { 
    return string.trim(); 
}

/**
 * Check if character/string is a letter
 * @param {string} string - The input character or string.
 * @returns {boolean} - True if the input is a letter, otherwise false.
 */
export function isLetter(string) {
    return string.length === 1 && /[a-zA-Z]/.test(string);
}

/**
 * Check if character/string is uppercase or lowercase
 * @param {string} string - The input character or string.
 * @returns {boolean} - True if the input is in uppercase, otherwise false.
 */
export function isUpperCase(string) {
    if (typeof string !== 'string' || string.length === 0) {
        // Handle non-string or empty input
        return false;
    }
    return string === string.toLocaleUpperCase();
}

/**
 * Matches the case of a character based on the case of the input string.
 * @param {string} string - The input string (used to determine case).
 * @param {string} char - The character to match the case for.
 * @returns {string} - The character with the same case as the input string.
 */
export function matchCase(string, char) {
    if (string === string.toUpperCase()) {
        return char.toUpperCase();
    }
    return char.toLowerCase();
}

/**
 * Retrieves the value associated with a given key or the key associated with a given value from an array of key-value pairs.
 * @param {string} searchString - The key or value to search for.
 * @param {Array<Array<string>>} array - An array of key-value pairs.
 * @param {string} [searchBy='key'] - Specify 'key' to search by key or 'value' to search by value.
 * @returns {string|null} - The corresponding key or value, or null if not found.
 */
export function getKeyValue(searchString, array, searchBy = 'key') {
    for (const pair of array) {
        if (searchBy === 'key' && pair[0] === searchString) {
            return pair[1];
        } else if (searchBy === 'value' && pair[1] === searchString) {
            return pair[0];
        }
    }
    return null;
}

/**
 * Calculates the number of keys in an object.
 *
 * @param {Object} input - The input object to check the size of.
 * @returns {number} The number of keys in the object.
 * @throws {Error} Throws an error if the provided input is not an object.
 */
export function objectSize(input) {
    if (typeof input === 'object' && !Array.isArray(input) && input !== null) {
        return Object.keys(input).length;
    }
    throw new Error("Input provided is not an object");
}

/**
 * Checks if a string is included in an array (case sensitive)
 *
 * @param {string} string - The string to check for.
 * @param {Array} array - The array to search within.
 * @returns {boolean} - Returns true if the string is found in the array, otherwise false.
 */
export function inArray(string, array) {
    return array.includes(string);
}

/**
 * Reverse String
 * @param {string} string - The input string.
 * @returns {string} - The reversed string.
 */
export function reverseString(string) {
    return Array.from(string).reverse().join("");
}

/**
 * Split string every n items
 * https://stackoverflow.com/a/12686829/3172872
 * @param {string} string - The input string.
 * @param {number} number - The desired chunk length.
 * @returns {string} - The input string split into chunks.
 */
export function splitString(string, number) {
    return string.match(new RegExp(".{1," + number + "}", "g")).join(" ");
}

/**
 * Split string to array every n items
 * https://stackoverflow.com/a/12686829/3172872
 * @param {string} string - The input string.
 * @param {number} number - The desired chunk length.
 * @returns {Array<string>} - An array of chunks from the input string.
 */
export function stringToArray(string, number) {
    return string.match(new RegExp(".{1," + number + "}", "g"));
}

/**
 * Convert string to Binary
 * @param {string} string - The input string.
 * @returns {string} - The binary representation of the input string.
 */
export function stringToBinary(string) {
    return bytesToBinary(new TextEncoder().encode(string));
}

/**
 * Writes bytes as 8-digit binary, separated by spaces.
 *
 * @param {Iterable<number>} bytes - The byte values, 0 to 255.
 * @returns {string} - The binary, such as "01001000 01101001".
 */
export function bytesToBinary(bytes) {
    return Array.from(bytes, (byte) => byte.toString(2).padStart(8, "0")).join(" ");
}

/**
 * Writes bytes as decimal numbers, separated by spaces.
 *
 * @param {Iterable<number>} bytes - The byte values, 0 to 255.
 * @returns {string} - The numbers, such as "72 105".
 */
export function bytesToDecimal(bytes) {
    return Array.from(bytes).join(" ");
}

/**
 * Writes bytes as Base64. Builds the text btoa needs in slices, as String.fromCharCode takes a limited number of
 * arguments.
 *
 * @param {Uint8Array|number[]} bytes - The byte values, 0 to 255.
 * @returns {string} - The Base64.
 */
export function bytesToBase64(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.slice(i, i + 8192));
    }
    return btoa(binary);
}


// What can separate hex bytes when reading it, in any mix: whitespace (including new lines), hyphens, colons, commas,
// semicolons, and the prefixes 0x, \x (either case) and % (URL encoding). So "48 65", "48-65", "0x48, 0x65",
// "\x48\x65", "%48%65" and "4865" all read the same.
const HEX_SEPARATORS = /(?:0x|\\x|%|[\s,;:-])+/gi;

/**
 * Checks that a string is hex: hex digits, with any of the separators above between them.
 *
 * @param {string} string - The input string containing hexadecimal characters.
 * @returns {boolean} True if the input string is valid hexadecimal, otherwise false.
 */
export function isValidHex(string) {
    const digits = string.replace(HEX_SEPARATORS, "");
    return digits.length > 0 && /^[0-9a-f]+$/i.test(digits);
}

/**
 * Splits hex into its bytes, as 2-digit hex strings (keeping their case), whichever separators it uses. A group of
 * several bytes between separators (e.g. "4869 21") is split into pairs, and a lone digit is read as 0-padded.
 *
 * @param {string} string - The input hexadecimal string.
 * @returns {Array<string>} - The 2-digit hex string for each byte.
 * @throws {Error} - If the hexadecimal contains invalid characters.
 */
export function hexToPairs(string) {
    if (!isValidHex(string)) {
        throw new Error("Hexadecimal contains invalid characters: use 0-9 and a-f, separated by spaces, hyphens, colons, commas, semicolons, 0x, \\x or %, or not at all");
    }
    return string.split(HEX_SEPARATORS)
        .filter(Boolean)
        .flatMap((group) => stringToArray(group, 2))
        .map((pair) => pair.padStart(2, "0"));
}

/**
 * Parses hex into its byte values, whichever separators it uses.
 *
 * @param {string} string - The input hexadecimal string.
 * @returns {Array<number>} - The byte values.
 * @throws {Error} - If the hexadecimal contains invalid characters.
 */
export function hexToBytes(string) {
    return hexToPairs(string).map((pair) => parseInt(pair, 16));
}

// Delimiters that go before every byte, as [prefix, what joins the bytes]. "0x, " is the style of code byte arrays.
const PREFIXED_DELIMITERS = {
    "\\x": ["\\x", "\\x"],
    "0x": ["0x", "0x"],
    "%": ["%", "%"],
    "0x, ": ["0x", ", 0x"],
};

/**
 * Joins 2-digit hex strings with a delimiter. Prefix-style delimiters ('0x', '\\x', '%', '0x, ') also go before the
 * first byte, so "0x, " gives "0x48, 0x69".
 *
 * @param {Array<string>} pairs - The 2-digit hex strings.
 * @param {string} delimiter - The delimiter to use.
 * @returns {string} - The joined hex string.
 */
export function joinHex(pairs, delimiter) {
    const [prefix, join] = PREFIXED_DELIMITERS[delimiter] ?? ["", delimiter];
    return pairs.length ? prefix + pairs.join(join) : "";
}

/**
 * Formats byte values as hex.
 *
 * @param {Iterable<number>} bytes - The byte values.
 * @param {string} delimiter - The delimiter to use (e.g., ' ', '0x', '\\x', or '' for none).
 * @returns {string} - The hex string.
 */
export function bytesToHex(bytes, delimiter) {
    return joinHex(Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")), delimiter);
}

/**
 * Convert to Hex
 * https://stackoverflow.com/a/69420340/3172872
 * @param {string} string - The input string.
 * @param {string} delimiter - The delimiter to use (e.g., '0x', '\\x').
 * @returns {string} - The hexadecimal representation of the input string.
 */
export function stringToHex(string, delimiter) {
    return bytesToHex(new TextEncoder().encode(string), delimiter);
}

/**
 * Decode Hex to string, as UTF-8, or one character per byte if the bytes aren't valid UTF-8. Any of the separators
 * hexToPairs accepts can be used.
 * @param {string} string - The input hexadecimal string.
 * @returns {string} - The decoded string.
 * @throws {Error} - If the hexadecimal contains invalid characters.
 */
export function hexToString(string) {
    return bytesToString(hexToBytes(string));
}

/**
 * Converts a string to Base64 encoding.
 * @param {string} string - The input string to encode.
 * @returns {string} - The Base64-encoded string.
 */
export function stringToBase64(string) {
    return bytesToBase64(new TextEncoder().encode(string));
}

/**
 * Applies the Rot13 algorithm to the string
 * @param {string} string - The input string.
 * @returns {string} - The Rot13-transformed string.
 */
export function rot13(string) {
    return string.replace(/[A-Za-z]/g, c => alphaRot[alphabet.indexOf(c)]);
}

/**
 * Turns bytes back into text: as UTF-8 if they're valid UTF-8, otherwise one character per byte (Latin-1),
 * so both UTF-8 text and older single-byte data decode as expected.
 * @param {number[]|Uint8Array} bytes - Byte values (0-255).
 * @returns {string} - The decoded text.
 */
export function bytesToString(bytes) {
    const array = Uint8Array.from(bytes);
    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(array);
    } catch {
        // Not valid UTF-8 - one character per byte, in chunks to stay within argument limits on large input
        let result = "";
        for (let i = 0; i < array.length; i += 8192) {
            result += String.fromCharCode(...array.subarray(i, i + 8192));
        }
        return result;
    }
}

/**
 * Returns the number used to represent a character in Unicode (its code point)
 * @param {string} string - The input string (only its first character is used).
 * @returns {number} - The Unicode code point.
 */
export function ord(string) {
    return string.codePointAt(0);
}

/**
 * Convert string to space-separated string Decimals (one number per UTF-8 byte, like binary and hex)
 * @param {string} string - The input string.
 * @returns {string} - A space-separated string of decimal byte values.
 *
 * @example
 * // Input: "Hé"
 * // Output: "72 195 169"
 */
export function stringToDecimal(string) {
    return bytesToDecimal(new TextEncoder().encode(string));
}

/**
 * Converts an individual character to Decimal
 * @param {string} string - The input character.
 * @returns {number} - The decimal Unicode code point value.
 */
export function string2Dec(string) {
    return ord(string);
}

/**
 * Decimal to String. Numbers up to 255 are read as bytes (see bytesToString); if any number is larger,
 * they're all read as Unicode code points instead (e.g. "8364" is €).
 * @param {string} string - The input string containing space-separated decimal values.
 * @returns {string} - The decoded string.
 * @throws {Error} - If a value isn't a whole number, or is beyond the Unicode range.
 */
export function decimalToString(string) {
    const trimmed = string.trim();
    if (trimmed === "") {
        return "";
    }

    const numbers = trimmed.split(/\s+/).map(Number);
    if (numbers.some((n) => !Number.isInteger(n) || n < 0 || n > 0x10FFFF)) {
        throw new Error("Decimal contains invalid values, only whole numbers separated by spaces are supported");
    }
    return numbers.every((n) => n <= 255) ? bytesToString(numbers) : numbers.map((n) => String.fromCodePoint(n)).join("");
}

/**
 * Return an array of unique character groups from a string, divided into chunks. Emoji count as one character.
 * @param {string} str - The input string.
 * @param {Number} [chunkSize=1] - The size of each chunk. Default is 1.
 * @returns {Array} - An array of unique character groups for each chunk.
 */
export function uniqueArray(str, chunkSize = 1) {
    if (chunkSize <= 0) {
        throw new Error("Invalid chunk size");
    }

    const characters = [...str];
    const chunks = [];
    for (let i = 0; i < characters.length; i += chunkSize) {
        chunks.push(characters.slice(i, i + chunkSize).join(""));
    }

    return [...new Set(chunks)];
}

/**
 * Simple and efficient method of returning frequency counts of each unique grouping of the same characters in an array
 * If a delimiter is present, removes those characters from the string before processing. Emoji count as one character.
 * Based on code from this stackoverflow post
 * https://stackoverflow.com/a/66002712/3172872
 *
 * @param {string} string - The input string to be split and analyzed.
 * @param {number} chunkSize - The number of characters in each substring segment.
 * @param {string} [delimiter] - The delimiter used to separate characters in the input string (optional).
 * @returns {Object} An object containing substrings as keys and their frequencies as values.
 *
 * @example
 * // Input: "he:ll:oh:el:lo", 2, ":"
 * // Output: { he: 1, ll: 1, oh: 1, el: 1, lo: 1 }
 */
export function countArrayFreq(string, chunkSize = 1, delimiter) {
    // Remove the delimiter from the string if it is present
    if (delimiter) {
        string = string.split(delimiter).join("");
    }

    // Split the string into substrings of the specified chunk size
    const characters = [...string];
    let split = [];
    for (let i = 0; i <= characters.length - chunkSize; i += chunkSize) {
        const chunk = characters.slice(i, i + chunkSize);
        // Check if all characters in the chunk are the same
        if (chunk.every(char => char === chunk[0])) {
            split.push(chunk.join(""));
        }
    }

    // Count the frequencies of the substrings
    return split.reduce((counts, curr) => {
        counts[curr] = (counts[curr] || 0) + 1;
        return counts;
    }, {});
}
