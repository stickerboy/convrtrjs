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
 * Trims whitespace from the start and end of a string. 
 * @param {string} input - The input string to be trimmed. 
 * @returns {string} The trimmed string. 
 **/
 function cleanString(string) { 
    return string.trimStart().trim(); 
}

/**
 * Check if character/string is a letter
 * @param {string} string - The input character or string.
 * @returns {boolean} - True if the input is a letter, otherwise false.
 */
function isLetter(string) {
    return string.length === 1 && /[a-zA-Z]/.test(string);
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
 * Calculates the number of keys in an object.
 *
 * @param {Object} input - The input object to check the size of.
 * @returns {number} The number of keys in the object.
 * @throws {Error} Throws an error if the provided input is not an object.
 */
function objectSize(input) {
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
function inArray(string, array) {
    return array.includes(string);
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
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(string);
    return Array.from(uint8Array)
        .map(byte => byte.toString(2).padStart(8, "0"))
        .join(" ");
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
    let cleanStr = cleanString(string);
    return validHex.test(cleanStr);
}

/**
 * Convert to Hex
 * https://stackoverflow.com/a/69420340/3172872
 * @param {string} string - The input string.
 * @param {string} delimiter - The delimiter to use (e.g., '0x', '\\x').
 * @returns {string} - The hexadecimal representation of the input string.
 */
function stringToHex(string, delimiter) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(string);

    let returnValue = Array.from(uint8Array).map(byte =>
        byte.toString(16).padStart(2, '0')
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
        if (delimiter === "") {
            for (let i = 0; i < string.length; i += 2) {
                const chunk = string.slice(i, i + 2);
                hexArray.push(parseInt(chunk, 16));
            }
        } else {
            const hex = string.trim().split(delimiter);
            for (let i = 0; i < hex.length; i++) {
                if (hex[i]) { // Check to ensure non-empty string
                    hexArray.push(parseInt(hex[i], 16));
                }
            }
        }

        const uint8Array = new Uint8Array(hexArray);
        const decoder = new TextDecoder();
        return decoder.decode(uint8Array);
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
 * Returns the number used to represent a character in Unicode
 * @param {string} string - The input string.
 * @returns {number} - The Unicode character number.
 */
function ord(string) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(string);
    return encoded[0];
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
 * Return an array of unique character groups from a string, divided into chunks
 * @param {string} str - The input string.
 * @param {Number} [chunkSize=1] - The size of each chunk. Default is 1.
 * @returns {Array} - An array of unique character groups for each chunk.
 */
function uniqueArray(str, chunkSize = 1) {
    if (chunkSize <= 0) {
        throw new Error("Invalid chunk size");
    }

    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        const chunk = str.substring(i, i + chunkSize);
        chunks.push(chunk);
    }

    return [...new Set(chunks)];
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
    const regex = new RegExp(toReplace, `g${caseSensitive ? "" : "i"}`);
    if (!regex.test(string)) {
        throw new Error(`"${toReplace}" was not found within the original string.`);
    }
    return string.replaceAll(regex, replacement);
}

/**
 * Creates styled HTML elements for displaying unique characters from an array.
 *
 * @param {string[]} data - An array of unique characters.
 * @returns {string} - The HTML representation of the unique characters.
 *
 * @example
 * // Input: ["a", "b", "c"]
 * // Output: "<div class="g-col-12"> ..."
 */
function styledUniqueArrayItems(data) {
    let result = `<div class="g-col-12"><p class="display-5 fs-5 mt-4">Unique characters</p>
    <div class="grid mt-2 grid-auto" id="unique-chars">`;
    data.forEach(char => {
        result += `<code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2 me-2" style="width: max-content;" aria-label="${char.replace(/ /g, "Space").replace(/\t/g, "Tab")}" title="${char.replace(/ /g, "Space").replace(/\t/g, "Tab")}">
                ${char.replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;")}
            </code>`;
    });
    result += `</div></div>`;
    return result;
}

/**
 * Simple and efficient method of returning frequency counts of each unique grouping of the same characters in an array
 * If a delimiter is present, removes those characters from the string before processing.
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
function countArrayFreq(string, chunkSize = 1, delimiter) {
    // Remove the delimiter from the string if it is present
    if (delimiter) {
        string = string.split(delimiter).join('');
    }

    // Split the string into substrings of the specified chunk size
    let split = [];
    for (let i = 0; i <= string.length - chunkSize; i += chunkSize) {
        const chunk = string.substring(i, i + chunkSize);
        // Check if all characters in the chunk are the same
        if (chunk.split("").every(char => char === chunk[0])) {
            split.push(chunk);
        }
    }

    // Count the frequencies of the substrings
    return split.reduce((counts, curr) => {
        counts[curr] = (counts[curr] || 0) + 1;
        return counts;
    }, {});
}

/**
 * Creates styled HTML elements for displaying unique character frequencies.
 *
 * @param {Object} data - An object containing unique characters as keys and their frequencies as values.
 * @param {string} [title="Frequencies"] - The title to be displayed above the frequencies.
 * @param {number} [minColWidth=6] - The minimum column width for the grid.
 * @returns {string} - The HTML representation of the unique character frequencies.
 *
 * @example
 * // Input: { h: 1, e: 1, l: 3, o: 2, ',': 1, ' ': 1, w: 1, r: 1, d: 1, '!': 1 }, "Character Frequencies"
 * // Output: "<div class="g-col-12"> ..."
 */
function styledArrayFrequencies(data, title = "Frequencies", minColWidth = 6) {
    // Initialize the result string with the opening div and title
    let result = `<div class="g-col-12"><p class="display-5 fs-5 mt-4">${title}</p>
    <div class="grid grid--fill mt-2" style="--bs-column-fill: ${minColWidth}rem">`;

    // Iterate over the data object to generate HTML for each key-value pair
    for (let [key, value] of Object.entries(data)) {
        result += `<div>
                    <code tabindex="0" class="w-auto d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2 me-2" style="width: max-content;" aria-label="Frequency of ${key}" title="Frequency of ${key}">
                        ${key} - ${value}
                    </code>
                   </div>`;
    }

    // Close the div tags and return the result string
    result += `</div></div>`;
    return result;
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
        var tempAnchor = document.createElement("a");
        tempAnchor.download = filename;
        tempAnchor.href = url;
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        document.body.removeChild(tempAnchor);
        return null;
    } else {
        var img = new Image();
        img.src = url;
        return img;
    }
}
