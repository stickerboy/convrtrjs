import * as toolkit from '../toolkit.js';

/**
 * Checks for a valid binary string length (a whole number of bytes)
 *
 * @param {string} string - The binary string to validate (anything other than 0 and 1 is ignored).
 * @returns {boolean} - `true` if the number of bits is a multiple of 8, otherwise `false`.
 */
export function isValidBinaryLength(string) {
    return string.replace(/[^01]/g, "").length % 8 === 0;
}

/**
 * Converts a binary string to text. The bits are read 8 at a time, however they're spaced (spaces, none,
 * new lines, commas), and decoded as UTF-8, or one character per byte if they aren't valid UTF-8.
 *
 * @param {string} string - The binary string to convert.
 * @returns {string} - The resulting text.
 * @throws {Error} - If the number of bits isn't a multiple of 8.
 *
 * @example
 * // Input: "01001000 01101001" or "0100100001101001"
 * // Output: "Hi"
 */
export function binaryToString(string) {
    if (!isValidBinaryLength(string)) {
        throw new Error("Not a valid Binary string, length is not divisible by 8");
    }
    const bytes = (string.replace(/[^01]/g, "").match(/.{8}/g) ?? []).map((bin) => parseInt(bin, 2));
    return toolkit.bytesToString(bytes);
}

/**
 * Converts a Base64 encoded string to a regular string.
 * @param {string} base64 - The Base64 encoded string.
 * @returns {string} - The decoded string.
 * @throws {Error} - If the input is not a valid Base64 string.
 */
export function base64ToString(base64) {
    try {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error("Not a valid Base64 string");
    }
}

/**
 * Converts Morse code to string
 *
 * @param {string} string - The Morse code string to convert.
 * @returns {string} - The resulting plain text string.
 * @throws {Error} - If the input contains invalid Morse code characters.
 */
export function morseToString(string) {
    if (!/^[\s./-]*$/.test(string)) {
        throw new Error("Morse code contains invalid characters");
    }

    return string
        .split(" / ")
        .map(word => word
            .split(" ")
            .map(character => toolkit.morseTextDict[character])
            .join("")
        )
        .join(" ")
        .trim();
}

/**
 * Converts a string to Morse code
 *
 * @param {string} string - The input string to be converted.
 * @returns {string} - The Morse code representation of the input string.
 * 
 * @example
 * // Input: "hello world"
 * // Output: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
 */
export function stringToMorse(string) {
    return string
        .toUpperCase()
        .split(" ")
        .map(word => word
            .split("")
            .map(character => toolkit.textMorseDict[character] || "")
            .join(" ")
        )
        .join(" / ")
        .trim();
}

/**
 * Converts a string to Morsenary code (binary-based Morse code)
 *
 * @param {string} string - The input string to be converted.
 * @param {string} [morsenarySetting="default"] - "default" maps . to 0 and - to 1; any other value ("flipped") swaps them.
 * @returns {string} - The Morsenary code representation of the input string.
 *
 * @example
 * // Input: "hello world" with default setting
 * // Output: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
 * // Input: "hello world" with custom setting (e.g., "default" or "reverse")
 * // Output: "01001000 01000101 01001100 01001100 01001111 00101100 00100000 01010111 01001111 01010010 01001100 01000100"
 */
export function stringToMorsenary(string, morsenarySetting = "default") {
    const binaryString = toolkit.stringToBinary(string).replace(/ /g, "");

    return binaryString.replace(/[01]/g, match => {
        if (morsenarySetting === "default") {
            return match === "1" ? "-" : ".";
        } else {
            return match === "1" ? "." : "-";
        }
    });
}

/**
 * Converts Morsenary code (binary-based Morse code) back to a string
 *
 * @param {string} string - The Morsenary code to be converted.
 * @param {string} [morsenarySetting="default"] - "default" maps . to 0 and - to 1; any other value ("flipped") swaps them.
 * @returns {string} - The original plaintext string.
 *
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "01001000 01000101 01001100 01001100 01001111 00101100 00100000 01010111 01001111 01010010 01001100 01000100" with default setting
 * // Output: "hello, world"
 */
export function morsenaryToString(string, morsenarySetting = "default") {
    if (!/^[\s./-]*$/.test(string)) {
        throw new Error("Morsenary contains invalid characters");
    }


    // Replace Morsenary code with binary representation
    const binaryString = string.replace(/[.-]/g, match => {
        if (morsenarySetting === "default") {
            return match === "." ? "0" : "1";
        } else {
            return match === "." ? "1" : "0";
        }
    });

    // Convert binary string back to text
    return binaryToString(binaryString.match(/.{1,8}/g).join(" "));
}
