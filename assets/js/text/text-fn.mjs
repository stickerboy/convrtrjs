import * as toolkit from '../toolkit.mjs';

/**
 * Checks for a valid binary string length (multiple of 8)
 *
 * @param {string} string - The binary string to validate.
 * @returns {boolean} - `true` if the length is valid, otherwise `false`.
 * @throws {Error} - If the input is not a valid binary string.
 */
export function isValidBinaryLength(string) {
    return tools.numbersOnly(string).length % 8 === 0;
}

/**
 * Converts a valid binary string to its corresponding ASCII string
 *
 * @param {string} string - The binary string to convert.
 * @returns {string} - The resulting ASCII string.
 * @throws {Error} - If the input is not a valid binary string.
 */
export function binaryToString(string) {
    if (isValidBinaryLength(string)) {
        string = string.replace(/[^10\s]/g, "");

        let charCodes = string.split(" ").map(bin => {
            bin = bin.padStart(8, "0");
            return parseInt(bin, 2);
        });

        return String.fromCharCode(...charCodes);
    } else {
        throw new Error("Not a valid Binary string, length is not divisible by 8");
    }
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
 * @returns {string} - The Morsenary code representation of the input string.
 *
 * @example
 * // Input: "hello world" with default setting
 * // Output: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
 * // Input: "hello world" with custom setting (e.g., "default" or "reverse")
 * // Output: "01001000 01000101 01001100 01001100 01001111 00101100 00100000 01010111 01001111 01010010 01001100 01000100"
 */
export function stringToMorsenary(string) {
    const morsenarySetting = document.getElementById("morsenarySetting").value;
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
 * @returns {string} - The original plaintext string.
 *
 * @throws {Error} - If the input contains invalid characters.
 *
 * @example
 * // Input: "01001000 01000101 01001100 01001100 01001111 00101100 00100000 01010111 01001111 01010010 01001100 01000100" with default setting
 * // Output: "hello, world"
 */
export function morsenaryToString(string) {
    if (!/^[\s./-]*$/.test(string)) {
        throw new Error("Morsenary contains invalid characters");
    }

    const morsenarySetting = document.getElementById("morsenarySetting").value;

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

// Re-code Hex on delimiter change
let hexDelimiterSelect = document.getElementById("convrtrsDelimiter");
hexDelimiterSelect.addEventListener("change", function () {
    let hexData = document.getElementById("form-hex").value;
    if (hexData === "") {
        return;
    }
    document.getElementById("encode").click();
});

// Re-code Morsenary on delimiter change
let morsenarySelect = document.getElementById("morsenarySetting");
morsenarySelect.addEventListener("change", function () {
    let morsenaryData = document.getElementById("form-morsenary").value;
    if (morsenaryData === "") {
        return;
    }
    document.getElementById("mrsnryDecode").click();
});