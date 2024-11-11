const alphabet	= " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const alphaFlip	= " ⱯQƆPƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Zɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇnʌʍxʎz";
const alphaRot  = " NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";

// Morse map
const morseTextDict = {  
    "-----":"0", ".----":"1", "..---":"2", "...--":"3", "....-":"4", ".....":"5", "-....":"6", "--...":"7", 
    "---..":"8", "----.":"9", ".-":"A", "-...":"B", "-.-.":"C", "-..":"D", ".":"E", "..-.":"F", "--.":"G", 
    "....":"H", "..":"I", ".---":"J", "-.-":"K", ".-..":"L", "--":"M", "-.":"N", "---":"O", ".--.":"P", 
    "--.-":"Q", ".-.":"R", "...":"S", "-":"T", "..-":"U", "...-":"V", ".--":"W", "-..-":"X", "-.--":"Y", 
    "--..":"Z", "-.-.--":"!", ".-.-.-":".", "--..--":",", "-..-.": "/", "..--..": "?", "-.--.-": ")", "-.--.": "(", ".-...": "&", "---...": ":", "-.-.-.": ";", "-...-": "=", ".-.-.": "+", "-....-": "-", "..--.-": "_", "...-..-": "$", ".--.-.": "@"

}
const textMorseDict = {
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.", "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", 
    "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", 
    "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", 
    "Z": "--..", "!": "-.-.--", ".": ".-.-.-", ",": "--..--", "/": "-..-.", "?": "..--..", ")": "-.--.-", "(": "-.--.", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", "$": "...-..-", "@": ".--.-."
}

/**
 * Check if character/string is a letter
 * @param {string} string - The input character or string.
 * @returns {boolean} - True if the input is a letter, otherwise false.
 */
function isLetter(string) {
    return string.length === 1 && string.match(/[a-zA-Z]/i);
}

/**
 * Check if character/string is uppercase or lowercase
 * @param {string} string - The input character or string.
 * @returns {boolean} - True if the input is in uppercase, otherwise false.
 */
function isUpperCase(string) {
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
function matchCase(string, char) {
    // If the character is uppercase, return the char in uppercase
    if (string === string.toUpperCase()) {
        return char.toUpperCase();
    }
    // Otherwise, return the char in lowercase
    return char.toLowerCase();
}

/**
 * Retrieves the value associated with a given key or the key associated with a given value from an array of key-value pairs.
 * @param {string} searchString - The key or value to search for.
 * @param {Array<Array<string>>} array - An array of key-value pairs.
 * @param {string} [searchBy='key'] - Specify 'key' to search by key or 'value' to search by value.
 * @returns {string|null} - The corresponding key or value, or null if not found.
 */
function getKeyValue(searchString, array, searchBy = 'key') {
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
 * Reverse String
 * @param {string} string - The input string.
 * @returns {string} - The reversed string.
 */
function reverseString(string) {
    return Array.from(string).reverse().join("");
}

/**
 * Split string every n items
 * https://stackoverflow.com/a/12686829/3172872
 * @param {string} string - The input string.
 * @param {number} number - The desired chunk length.
 * @returns {string} - The input string split into chunks.
 */
function splitString(string, number) {
    return string.match(new RegExp(".{1," + number + "}", "g")).join(" ");
}

/**
 * Split string to array every n items
 * https://stackoverflow.com/a/12686829/3172872
 * @param {string} string - The input string.
 * @param {number} number - The desired chunk length.
 * @returns {Array<string>} - An array of chunks from the input string.
 */
function stringToArray(string, number) {
    return string.match(new RegExp(".{1," + number + "}", "g"));
}

/**
 * Convert string to Binary
 * @param {string} string - The input string.
 * @returns {string} - The binary representation of the input string.
 */
function stringToBinary(string) {
    return Array.from(string).map(c => c.charCodeAt().toString(2).padStart(8, 0)).join(" ");
}

/**
 * Validate hexadecimal characters
 *
 * @param {string} string - The input string containing hexadecimal characters.
 * @param {string} delimiter - The delimiter used to separate hex characters in the input string (e.g., '0x', '\\x').
 * @returns {boolean} True if the input string is valid hexadecimal, otherwise false.
 */
function isValidHex(string, delimiter) {
    const validHex = new RegExp(`^[0-9a-fA-F${delimiter}]+$`);
    return validHex.test(string);
}

/**
 * Convert to Hex
 * https://stackoverflow.com/a/69420340/3172872
 * @param {string} string - The input string.
 * @param {string} delimiter - The delimiter to use (e.g., '0x', '\\x').
 * @returns {string} - The hexadecimal representation of the input string.
 */
function stringToHex(string, delimiter) { // UTF-8
    let returnValue = Array.from(string).map(c =>
        c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16).padStart(2, '0') :
        encodeURIComponent(c).replace(/\%/g, "").toLowerCase()
    ).join(`${delimiter}`);

    return (delimiter === "\\x" || delimiter === "0x") ? delimiter + returnValue : returnValue;
}

/**
 * Decode Hex to string
 * https://stackoverflow.com/a/60505243/3172872
 * @param {string} string - The input hexadecimal string.
 * @param {string} delimiter - The delimiter used in the string (e.g., '0x', '\\x').
 * @returns {string} - The decoded string.
 * @throws {Error} - If the hexadecimal contains invalid characters.
 */
function hexToString(string, delimiter) {
    if (isValidHex(string, delimiter)) {
        let hexArray = [];
        const len = string.length;
        if (delimiter === "") {
            for (let i = 0; i < len; i += 2) {
                const chunk = string.slice(i, i + 2);
                hexArray.push(String.fromCharCode(parseInt(chunk, 16)));
            }
        } else {
            const hex = Array.from(string.trim().split(delimiter));
            const len = hex.length;
            for (let i = 0; i < len; i++) {
                hexArray.push(String.fromCharCode(parseInt(hex[i], 16)));
            }
        }
        return hexArray.join("");
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

/**
 * Convert to Base64
 * https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
 * @param {string} string - The input string.
 * @returns {string} - The Base64-encoded string.
 */
function stringToBase64(string) {
    // First, use encodeURIComponent to get percent-encoded UTF-8,
    // then convert the percent encodings into raw bytes which can be fed into btoa.
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
        }));
}

/**
 * Applies the Rot13 algorithm to the string
 * https://stackoverflow.com/a/28490254/3172872
 * @param {string} string - The input string.
 * @returns {string} - The Rot13-transformed string.
 */
function rot13(string) {
    // Non-letter characters will not be replaced, preserving the string
    return /^[a-zA-Z]/.test(string) ? string.replace(/[A-Z]/gi, c => alphaRot[alphabet.indexOf(c)]) : "";
}

/**
 * PHP's ord function recreated in JavaScript
 * Returns the Unicode code point value of the first character in the input string.
 * @param {string} string - The input string.
 * @returns {number} - The Unicode code point value.
 */
function ord(string) {
    //  discuss at: https://locutus.io/php/ord/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //    input by: incidence
    //   example 1: ord("K")
    //   returns 1: 75
    //   example 2: ord("\uD800\uDC00"); // surrogate pair to create a single Unicode character
    //   returns 2: 65536
    const str = string + "";
    const code = str.charCodeAt(0);
    if (code >= 0xD800 && code <= 0xDBFF) {
        // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        const hi = code;
        if (str.length === 1) {
            // This is just a high surrogate with no following low surrogate, so we return its value;
            return code;
            // we could also throw an error as it is not a complete character,
            // but someone may want to know
        }
        const low = str.charCodeAt(1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
        // This is just a low surrogate with no preceding high surrogate, so we return its value;
           return code;
        // we could also throw an error as it is not a complete character, but someone may want to know
    }
    return code;
}

/**
 * Convert string to space-separated string Decimals
 * @param {string} string - The input string.
 * @returns {string} - A space-separated string of decimal code point values.
 */
function stringToDecimal(string) {
    return Array.from(string).map(c => ord(c)).join(" ");
}

/**
 * Converts an individual character to Decimal
 * @param {string} string - The input character.
 * @returns {number} - The decimal Unicode code point value.
 */
function string2Dec(string) {
    return ord(string);
}

/**
 * Decimal to String
 * @param {string} string - The input string containing decimal code point values.
 * @returns {string} - The decoded string.
 */
function decimalToString(string) {
    return string.trim().split(" ").map(c => String.fromCharCode(c)).join("");
}

/**
 * Return an array of unique values from an array
 * @param {Array} string - The input array.
 * @returns {Array} - An array with unique values.
 */
function uniqueArray(string) {
    return [...new Set(string)];
}

/**
 * Replace characters in a string, works for any unicode characters
 * Can also pass your own regex for replacements
 * @param {string} string - The input string.
 * @param {string} toReplace - The substring to replace.
 * @param {string} replacement - The replacement string.
 * @param {boolean} [caseSensitive=false] - If true, performs case-sensitive replacements.
 * @returns {string} - The modified string with replacements.
 */
function replaceChars(string, toReplace, replacement, caseSensitive) {
    return string.replaceAll(new RegExp(toReplace, `g${caseSensitive === true ? "" : "i"}`), replacement);
}

/**
 * Create an image from a specific container, with specified dimensions and content.
 * Provides an option to either download the image or return it for injection into a container.
 * @param {number} width - The desired width of the image.
 * @param {number} height - The desired height of the image.
 * @param {string} filename - The suggested filename for downloading the image.
 * @param {HTMLAnchorElement} element - The anchor element used for downloading the image.
 * @param {string} string - The text to display in the image.
 * @param {object} [options] - Optional parameters.
 * @param {string} [options.bgcolor='white'] - The background color of the image.
 * @param {string} [options.textcolor='black'] - The text color of the image.
 * @param {string} [options.font="5.5rem 'TerminalGlyphs'"] - The font of the text in the image.
 * @param {number} [options.paddingTop=90] - The padding from the top of the image to the start of the text.
 * @param {boolean} [options.download=true] - Whether to download the image or return it for injection.
 * @param {boolean} [options.fontAdjust=false] - Whether to adjust the font position based on its metrics.
 * @returns {HTMLImageElement|null} - The generated image element if download is false, otherwise null.
 */
function createImage(width, height, filename, element, string, options = {}) {
    var canvas = document.createElement("canvas");
    canvas.width = (width * 1.5) + 20;
    canvas.height = height * 1.5;
    var ctx = canvas.getContext("2d");

    var bgcolor = options.bgcolor || 'white';
    var textcolor = options.textcolor || 'black';
    var font = options.font || "5.5rem 'TerminalGlyphs'";
    var paddingTop = options.paddingTop || 90;
    var download = options.download !== undefined ? options.download : true;
    var fontAdjust = options.fontAdjust !== undefined ? options.fontAdjust : false;

    ctx.fillStyle = bgcolor;
    ctx.fillRect(10, 10, canvas.width, canvas.height);

    ctx.font = font;
    ctx.fillStyle = textcolor;

    if (fontAdjust) {
        var textMetrics = ctx.measureText(string);
        var textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

        // Adjust the position so the text is centered vertically
        var textY = paddingTop + textHeight;

        if (textY + textHeight > canvas.height) {
            textY = canvas.height - textHeight;
        }

        ctx.fillText(string, 10, textY);
    } else {
        ctx.fillText(string, 10, paddingTop);
    }

    var url = canvas.toDataURL();

    if (download) {
        element.download = filename;
        element.href = url;
        return null;
    } else {
        var img = new Image();
        img.src = url;
        return img;
    }
}
