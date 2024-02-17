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

// Check if character/string is a letter
function isLetter(string) {
    return string.length === 1 && string.match(/[a-zA-Z]/i);
}

// Check is character/string is uppercase or lowecase
function isUpperCase(string) {
    if (typeof string !== 'string' || string.length === 0) {
        // Handle non-string or empty input
        return false;
    }
    return string === string.toLocaleUpperCase();
}

function matchCase(string, char) {
  // If the character is uppercase, return the char in uppercase
  if (string === string.toUpperCase()) {
    return char.toUpperCase();
  }
  // Otherwise, return the char in lowercase
  return char.toLowerCase();
}

function getKeyValue(string, array) {
    for (const pair of array) {
        if (pair[0] === string) {
            return pair[1];
        }
    }
    return null;
}

// Reverse String
function reverseString(string) {
    return Array.from(string).reverse().join("");
}

// Split string every n items
// https://stackoverflow.com/a/12686829/3172872
function splitString(string, number) {
    return string.match(new RegExp(".{1," + number + "}", "g")).join(" ");
}

// Split string to array every n items
// https://stackoverflow.com/a/12686829/3172872
function stringToArray(string, number) {
    return string.match(new RegExp(".{1," + number + "}", "g"));
}

// Convert to Binary
function stringToBinary(string) {
    return Array.from(string).map(c => c.charCodeAt().toString(2).padStart(8,0)).join(" ");
}

function isValidHex(string, delimiter) {
    const validHex = /^[0-9A-Fa-f]+$/g;
    let hexTest = string.replaceAll(delimiter, "");
    return validHex.test(hexTest);
}

// Convert to Hex
// https://stackoverflow.com/a/69420340/3172872
function stringToHex(string, delimiter) { // UTF-8
    let returnValue = Array.from(string).map(c => 
        c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16).padStart(2, '0') : 
        encodeURIComponent(c).replace(/\%/g,"").toLowerCase()
    ).join(`${delimiter}`);

    return (delimiter === "\\x" || delimiter === "0x") ? delimiter + returnValue : returnValue;
}

// Decode Hex to string
// https://stackoverflow.com/a/60505243/3172872
function hexToString(string, delimiter) {
    if (isValidHex(string, delimiter)) {
        let hexArray = [];
        const len = string.length;
        if(delimiter === "") {
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

// Convert to Base64
// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function stringToBase64(string) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which can be fed into btoa.
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
    }));
}

// Rot 13: rotate chararcters 13 times
// https://stackoverflow.com/a/28490254/3172872
function rot13(string) {
    // Non-letter characters will not be replaced and we don't error out to preserve the string
    return /^[a-zA-Z]/.test(string) ? string.replace(/[A-Z]/gi, c => alphaRot[ alphabet.indexOf(c) ] ) : "";
}

// PHP's ord function recreated in JavaScript
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

// Convert to Decimal
function stringToDecimal(string) {
    return Array.from(string).map(c => ord(c)).join(" ");
}

// Convert individual char to Decimal
function string2Dec(string) {
    return ord(string);
}

// Decimal to String
function decimalToString(string) {
    return string.trim().split(" ").map(c => String.fromCharCode(c)).join("");
}

// Return unique values from an array
function uniqueArray(string) {
    return [...new Set(string)];
}

// Replace characters in a string, works for any unicode characters
// Can also pass your own regex for replacements
function replaceChars(string, toReplace, replacement, caseSensitive) {
    return string.replaceAll(new RegExp(toReplace, `g${caseSensitive === true ? "" : "i"}`), replacement);
}