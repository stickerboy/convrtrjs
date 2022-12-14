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

// Reverse String
function reverseString(string) {
    return Array.from(string).reverse().join("");
}

// Split string every n items
// https://stackoverflow.com/a/12686829/3172872
function splitString(string, number) {
    return string.match(new RegExp('.{1,' + number + '}', 'g')).join(" ");
}

// Split string to array every n items
// https://stackoverflow.com/a/12686829/3172872
function stringToArray(string, number) {
    return string.match(new RegExp('.{1,' + number + '}', 'g'));
}

// Convert to Binary
function stringToBinary(string) {
    return Array.from(string).map(c => c.charCodeAt().toString(2).padStart(8,0)).join(" ");
}

// Decode Binary
function binaryToString(string) {
    return String.fromCharCode(
        ...string.split(' ').map(bin => parseInt(bin, 2))
      );
}

// Convert to Hex
// https://stackoverflow.com/a/69420340/3172872
function stringToHex(string, delimiter) { // UTF-8
    let hexDelimiter = delimiter ? delimiter : document.getElementById("hexDelimiter").value;
    let returnValue = Array.from(string).map(c => 
        c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : 
        encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
    ).join(`${hexDelimiter}`);
    
    return (hexDelimiter === "\\x" || hexDelimiter === "0x") ? hexDelimiter + returnValue : returnValue;
}

// Decode Hex to string
// https://stackoverflow.com/a/60505243/3172872
function hexToString(string) {
    return decodeURIComponent(
        string.replace(/\s|-|:|\.|\!|,|(0x)/g, '') // remove spaces
          .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
      );
}
// Previous method: https://stackoverflow.com/a/69420340/3172872
// return decodeURIComponent('%' + string.replace(/ /g, "").match(/.{1,2}/g).join('%'));


// Convert to Base64
// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function stringToBase64(string) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}
// Decode Base64
function base64ToString(string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(string).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// Rot 13: rotate chararcters 13 times
// https://stackoverflow.com/a/28490254/3172872
function rot13(string) {
    return /^[a-zA-Z]/.test(string) ? string.replace(/[A-Z]/gi, c => alphaRot[ alphabet.indexOf(c) ] ) : "";
}

// PHP's ord function recreated in JavaScript
function ord(string) {
    //  discuss at: https://locutus.io/php/ord/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //    input by: incidence
    //   example 1: ord('K')
    //   returns 1: 75
    //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
    //   returns 2: 65536
    const str = string + '';
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
    return string.trim().split(' ').map(c => String.fromCharCode(c)).join("");
}


// Morse code to String
function morseToString(string) {
    return /^[ /.-]*$/.test(string) ? string // test valid morse
            .replaceAll(" / "," ")
            .split(' ')
            .map(word => word
                        .split(' ') // get character code,
                        .map(character => morseTextDict[character])
                        .join('')
            )
            .join(' ')
            .trim() : "Morse code contains invalid characters";
}

// Convert to Morse
function stringToMorse(string) {
    return string
            .toUpperCase()
            .split(' ')
            .map(word => word
                        .split('') // get character code,
                        .map(character => textMorseDict[character])
                        .join(' ')
            )
            .join(' / ')
            .trim();
}

// Convert to Morsenary
function stringToMorsenary(string) {
    let morsenarySetting = document.getElementById("morsenarySetting").value;
    return morsenarySetting === "default" ? stringToBinary(string).replace(/ /g,"").replaceAll("0",".").replaceAll("1","-") :
                                            stringToBinary(string).replace(/ /g,"").replaceAll("1",".").replaceAll("0","-");
}

// Decode Morsenary to String
function morsenaryToString(string) {
    let morsenarySetting = document.getElementById("morsenarySetting").value;
    string = morsenarySetting === "default" ? string.replaceAll(".","0").replaceAll("-","1") : string.replaceAll(".","1").replaceAll("-","0");
    return binaryToString(splitString(string, 8));
}


// Flip text upside down
function flipText(string, alphabet, replacement) {
	return Array.from(string).map(c => 
        typeof replacement[alphabet.search(c)] == 'undefined' ? ' ' : replacement[alphabet.search(c)]
    ).join("");
}


// Convert Hex String to Binary
// https://newbedev.com/convert-hex-to-binary-in-javascript
function hexToBinary(string) {
    return string.split(' ').map(c => hex2Bin(c)).join("");
}

// Convert individual Hex char to Binary
function hex2Bin(string) {
    return parseInt(string, 16).toString(2).padStart(8, '0');
}


// Convert Hex to Decimal
// Returns: Decimal, space delimited
function hexToDecimal(string) {
    return string.split(' ').map(c =>
        hex2Dec(c)
    ).join(" ");
}

// Convert individual Hex char to Decimal
// Returns: Decimal
function hex2Dec(string) {
    return ord(hexToString(string));
}


// Shift Hex left or right
// Returns: Decimal, space delimited
function shiftHexString(string, shiftValue) {
    return hexToString(string).split("").map(c => 
            ord(c) + parseInt(shiftValue)
        ).join(" ");
}


// Reverse Hex nibbles
function reverseHex(string) {
    return stringToHex(hexToString(string), " ").split(" ").map(c => 
            reverseString(c)
           ).join(" ");
}