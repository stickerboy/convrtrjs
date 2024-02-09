const alphabet	= " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const alphaFlip	= " ⱯQƆPƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Zɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇnʌʍxʎz";
const alphaRot  = " NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";

// Morse map
const morseTextDict = {  
    "-----":"0", ".----":"1", "..---":"2", "...--":"3", "....-":"4", ".....":"5", "-....":"6", "--...":"7", 
    "---..":"8", "----.":"9", ".-":"A", "-...":"B", "-.-.":"C", "-..":"D", ".":"E", "..-.":"F", "--.":"G", 
    "....":"H", "..":"I", ".---":"J", "-.-":"K", ".-..":"L", "--":"M", "-.":"N", "---":"O", ".--.":"P", 
    "--.-":"Q", ".-.":"R", "...":"S", "-":"T", "..-":"U", "...-":"V", ".--":"W", "-..-":"X", "-.--":"Y", 
    "--..":"Z", "-.-.--":"!", ".-.-.-":".", "--..--":","
}
const textMorseDict = {
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.", "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", 
    "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", 
    "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", 
    "Z": "--..", "!": "-.-.--", ".": ".-.-.-", ",": "--..--"
}

// Check if character/string is a letter
function isLetter(string) {
    return string.length === 1 && string.match(/[a-zA-Z]/i);
}

// Check is character/string is uppercase or lowecase
function isUpperCase(string) {
    if (string === string.toLocaleUpperCase()) {
        return true;
    }
    if (string === string.toLocaleLowerCase()) {
        return false;
    }
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

// Convert to Hex
// https://stackoverflow.com/a/69420340/3172872
function stringToHex(string, delimiter) { // UTF-8
    console.log(delimiter);
    let returnValue = Array.from(string).map(c => 
        c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16).padStart(2, '0') : 
        encodeURIComponent(c).replace(/\%/g,"").toLowerCase()
    ).join(`${delimiter}`);

    return (delimiter === "\\x" || delimiter === "0x") ? delimiter + returnValue : returnValue;
}

// Decode Hex to string
// https://stackoverflow.com/a/60505243/3172872
function hexToString(string, delimiter) {
    let validHex = /[0-9A-Fa-f]+$/g;

    if (validHex.test(string)) {
        const hex = Array.from(string.trim().split(delimiter));
        const len = hex.length;
        let hexArray = [];

        for (let i = 0; i < len; i++) {
            hexArray.push(String.fromCharCode(parseInt(hex[i], 16)));
        }
        return hexArray.join("");
    } else {
        throw new Error("Hexadecimal contains invalid characters");
    }
}

// Convert to Base64
// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function stringToBase64(string) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
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

// Convert Hex String to Binary
// https://newbedev.com/convert-hex-to-binary-in-javascript
function hexToBinary(string) {
    return string.split(" ").map(c => hex2Bin(c)).join("");
}

// Convert individual Hex char to Binary
function hex2Bin(string) {
    return parseInt(string, 16).toString(2).padStart(8, "0");
}

// Convert Hex to Decimal
// Returns: Decimal, space delimited
function hexToDecimal(string) {
    return string.split(" ").map(c =>
        hex2Dec(c)
    ).join(" ");
}

// Convert individual Hex char to Decimal
// Returns: Decimal
function hex2Dec(string) {
    return ord(hexToString(string));
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