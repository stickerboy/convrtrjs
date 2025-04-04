import { alphabet, isUpperCase, isLetter, matchCase } from '../toolkit.mjs';
import { lettersOnly } from '../tools.mjs';

/**
 * Builds a custom alphabet using a given key.
 * @param {string} string - A user-specified text string.
 * @returns {string} - A string containing the custom alphabet formed by combining unique characters from the input string and the standard alphabet.
 *
 * @example
 * // Input: "TEST"
 * // Output: "TESABCDFGHIJKLMNOPQRUVWXYZ"
 */
export function getCustomAlphabet(string) {
    let stringArr = [...new Set(string.trim())];
    let alphaArr = [...new Set(alphabet.trim())];
    return [...new Set(stringArr.concat(alphaArr))].join("");
}

/**
 * Atbash cipher - reverses the alphabet for the given string.
 * Transforms 'A' to 'Z', 'B' to 'Y', etc.
 *
 * @param {string} string - The original string to be transformed.
 * @returns {string} - The transformed string with reversed alphabet.
 *
 * @example
 * // Input: "ABCxyz"
 * // Output: "ZYXcba"
 */
export function atbashCipher(string) {
    const lowerAlphabet = alphabet.slice(27, 53);
    const upperAlphabet = alphabet.slice(1, 27);
    const reversedLower = lowerAlphabet.split('').reverse().join('');
    const reversedUpper = upperAlphabet.split('').reverse().join('');

    return string.replace(/[a-z]/g, c => reversedLower[lowerAlphabet.indexOf(c)])
        .replace(/[A-Z]/g, c => reversedUpper[upperAlphabet.indexOf(c)]);
}

/**
 * Substitutes each letter in the a string with a corresponding letter from a custom alphabet
 * Custom alphabet is built using a user specified text string
 * @param {string} string - The original string to be modified.
 * @param {string} key - A user-specified text string used to create the custom alphabet.
 * @returns {string} - The modified string with letters replaced according to the custom alphabet.
 *
 * @example
 * // Input: "Hello, World!" with key "TEST"
 * // Output: "Tqxxa, Tqxxa!"
 */
export function substituteChars(string, key) {
    const alpha = getCustomAlphabet(key);
    return string.split("").map((char) => {
        if (char >= "a" && char <= "z" || char >= "A" && char <= "Z") {
            // Return the corresponding letter from the custom alphabet
            // Get the index of the original letter in the standard alphabet
            let index = char.toLowerCase().charCodeAt(0) - 97;
            index = index % 26; // handle uppercase characters
            return matchCase(char, alpha.charAt(index));
        } else {
            // Return the original character
            return char;
        }
    }).join("");
}

/**
 * Generates a hash for the given string based on the specified hash method.
 *
 * @param {string} string - The input string to be hashed.
 * @param {string} hash - The hash method to be used (e.g., "MD5", "SHA1", etc.).
 * @returns {string} - The generated hash value or an error message if the method is invalid or not supported.
 *
 * @example
 * // Input: "Hello, World!" with hash method "MD5"
 * // Output: "65a8e27d8879283831b664bd8b7f0ad4"
 */
export function generateHashes(string, hash) {
    const hashFunctions = {
        MD5: CryptoJS.MD5,
        SHA1: CryptoJS.SHA1,
        SHA256: CryptoJS.SHA256,
        SHA512: CryptoJS.SHA512,
        SHA3512: string => CryptoJS.SHA3(string, { outputLength: 512 }),
        SHA3384: string => CryptoJS.SHA3(string, { outputLength: 384 }),
        SHA3256: string => CryptoJS.SHA3(string, { outputLength: 256 }),
        SHA3224: string => CryptoJS.SHA3(string, { outputLength: 224 })
    };

    const selectedHashFunction = hashFunctions[hash];
    return selectedHashFunction ? selectedHashFunction(string).toString() : "Invalid hash method provided or not supported";
}

/**
 * Encrypts a string using the Vigenère cipher.
 *
 * @param {string} string - The original string to be encrypted.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted string.
 *
 * @example
 * // Input: "Hello, World!" with key "KEY"
 * // Output: "Rijvs Uyvjn!"
 */
export function vignereEncrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            const keyChar = key[j % key.length];
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 + keyChar.toUpperCase().charCodeAt(0) - 65) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) - 97 + keyChar.toLowerCase().charCodeAt(0) - 97) % 26 + 97);
            }
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

/**
 * Decrypts a string encrypted using the Vigenère cipher
 *
 * @param {string} string - The encrypted string to be decrypted.
 * @param {string} key - The decryption key.
 * @returns {string} - The original plaintext string.
 *
 * @example
 * // Input: "Rijvs Uyvjn!" with key "KEY"
 * // Output: "Hello, World!"
 */
export function vignereDecrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            const keyChar = key[j % key.length];
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - keyChar.toUpperCase().charCodeAt(0) + 26) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) - keyChar.toLowerCase().charCodeAt(0) + 26) % 26 + 97);
            }
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

/**
 * Encrypts or decrypts a string using the Beaufort cipher.
 * The encryption and decryption process is identical.
 *
 * @param {string} string - The original string to be encrypted or decrypted.
 * @param {string} key - The encryption/decryption key.
 * @returns {string} - The encrypted or decrypted string.
 *
 * @example
 * // Input: "Hello, World!" with key "KEY"
 * // Output: Danzq Cwnnh!
 *
 * // Input: Encrypted text with key "KEY"
 * // Output: "Hello, World!"
 */
export function beaufortCipher(string, key) {
    const transformedString = atbashCipher(string);
    const transformedKey = atbashCipher(key);

    return vignereDecrypt(transformedString, transformedKey);
}

/**
 * Generates a Fibonacci sequence of a given length.
 * 
 * @param {number} length - The length of the Fibonacci sequence to generate.
 * @returns {number[]} An array containing the Fibonacci sequence up to the specified length.
 */
export function fibonacci(length) {
    const fib = [1, 1];
    for (let i = 2; i < length; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib;
}

/**
 * Encrypts text using the Smithy cipher, which is based on the Fibonacci sequence.
 * 
 * This function encrypts the input string using a keyword. The Smithy code applies shifts based on the Fibonacci sequence
 * and the ASCII values of the characters in the keyword. Each alphabetic character is shifted, while non-alphabetic characters remain unchanged.
 * 
 * @param {string} string - The text to be encrypted.
 * @param {string} key - The keyword used to determine the shifts based on the Fibonacci sequence and character values.
 * @returns {string} The encrypted text.
 */
export function smithyEncrypt(string, key) {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(string);
    const fib = fibonacci(key.length);
    const keywordShifts = key.split("").map((char, index) => (fib[index % fib.length] + char.charCodeAt(0)) % 26);

    let ciphertext = "";
    for (let i = 0; i < encodedText.length; i++) {
        const byte = encodedText[i];
        if (byte >= 65 && byte <= 90 || byte >= 97 && byte <= 122) { // A-Z or a-z
            const base = byte >= 65 && byte <= 90 ? 65 : 97;
            const shift = keywordShifts[i % key.length];
            const encryptedByte = ((byte - base + shift) % 26) + base;
            ciphertext += String.fromCharCode(encryptedByte);
        } else {
            ciphertext += String.fromCharCode(byte); // Non-alphabetic characters remain unchanged
        }
    }

    return ciphertext;
}

/**
 * Decrypts text using the Smithy c=ipher.
 * 
 * This function decrypts the input string using a keyword. The Smithy code reverses shifts based on the Fibonacci sequence
 * and the ASCII values of the characters in the keyword. Each alphabetic character is shifted back, while non-alphabetic characters remain unchanged.
 * 
 * @param {string} string - The text to be decrypted.
 * @param {string} key - The keyword used to determine the shifts based on the Fibonacci sequence and character values.
 * @returns {string} The decrypted text.
 */
export function smithyDecrypt(string, key) {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(string);
    const fib = fibonacci(key.length);
    const keywordShifts = key.split("").map((char, index) => (fib[index % fib.length] + char.charCodeAt(0)) % 26);

    let plaintext = '';
    for (let i = 0; i < encodedText.length; i++) {
        const byte = encodedText[i];
        if (byte >= 65 && byte <= 90 || byte >= 97 && byte <= 122) { // A-Z or a-z
            const base = byte >= 65 && byte <= 90 ? 65 : 97;
            const shift = keywordShifts[i % key.length];
            const decryptedByte = ((byte - base - shift + 26) % 26) + base;
            plaintext += String.fromCharCode(decryptedByte);
        } else {
            plaintext += String.fromCharCode(byte); // Non-alphabetic characters remain unchanged
        }
    }

    return plaintext;
}


/**
 * Encodes a string using a keyword by creating a substitution cipher that supports both uppercase and lowercase keys.
 *
 * @param {string} string - The input string to encode.
 * @param {string} key - The keyword used for encoding, supporting both uppercase and lowercase.
 * @returns {string} - The encoded string.
 */
export function keywordEncode(string, key) {
    // Normalize the key to ensure unique characters
    let uniqueKey = key.split('').filter((item, pos, self) => self.indexOf(item) === pos).join('');
    let upperKey = uniqueKey.toUpperCase();
    let lowerKey = uniqueKey.toLowerCase();

    // Create the translation string
    let transUpper = upperKey + alphabet.slice(1, 27).replace(new RegExp(`[${upperKey}]`, 'g'), '');
    let transLower = lowerKey + alphabet.slice(27).replace(new RegExp(`[${lowerKey}]`, 'g'), '');
    let trans = transUpper + transLower;

    // Translate the string using the custom alphabet
    return string.replace(/[A-Za-z]/g, function (c) {
        return trans[alphabet.indexOf(c)];
    });
}

/**
 * Decodes an encoded string using a keyword by reversing the substitution cipher that supports both uppercase and lowercase keys.
 *
 * @param {string} string - The encoded string to decode.
 * @param {string} key - The keyword used for decoding, supporting both uppercase and lowercase.
 * @returns {string} - The decoded original string.
 */
export function keywordDecode(string, key) {
    // Normalize the key to ensure unique characters
    let uniqueKey = key.split('').filter((item, pos, self) => self.indexOf(item) === pos).join('');
    let upperKey = uniqueKey.toUpperCase();
    let lowerKey = uniqueKey.toLowerCase();

    // Create the translation string
    let transUpper = upperKey + alphabet.slice(1, 27).replace(new RegExp(`[${upperKey}]`, 'g'), '');
    let transLower = lowerKey + alphabet.slice(27).replace(new RegExp(`[${lowerKey}]`, 'g'), '');
    let trans = transUpper + transLower;

    // Reverse translate the string using the custom alphabet
    return string.replace(new RegExp(`[${trans}]`, 'g'), function (c) {
        return alphabet[trans.indexOf(c)];
    });
}

/**
 * Encodes a string using the Rail Fence Cipher.
 *
 * @param {string} string - The input string to encode.
 * @param {number} rails - The number of rails for the Rail Fence Cipher.
 * @returns {string} - The encoded string.
 */
export function railFenceEncode(string, rails) {
    if (rails < 2) {
        throw new Error("A minimum of 2 rails is required to make the cipher work effectively");
    }

    string = string = lettersOnly(string);
    const railStrings = Array.from({ length: rails }, () => []);

    let rail = 0;
    let direction = 1;

    for (let i = 0; i < string.length; i++) {
        railStrings[rail].push(string[i]);
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
            direction *= -1;  // Change direction at the top and bottom
        }
    }

    return railStrings.flat().join('');
}

/**
 * Decodes a string encoded with the Rail Fence Cipher.
 *
 * @param {string} string - The encoded string to decode.
 * @param {number} rails - The number of rails used for the Rail Fence Cipher.
 * @returns {string} - The decoded original string.
 */
export function railFenceDecode(string, rails) {
    if (rails < 2) {
        throw new Error("A minimum of 2 rails is required to make the cipher work effectively");
    }

    string = lettersOnly(string);
    const railLengths = Array.from({ length: rails }, () => 0);

    let rail = 0;
    let direction = 1;

    // Determine the length of each rail
    for (let i = 0; i < string.length; i++) {
        railLengths[rail]++;
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
            direction *= -1;
        }
    }

    // Fill the rails with characters from the encoded string
    const railStrings = Array.from({ length: rails }, (_, i) => string.slice(i > 0 ? railLengths.slice(0, i).reduce((a, b) => a + b, 0) : 0, railLengths.slice(0, i + 1).reduce((a, b) => a + b, 0)).split(''));

    // Reconstruct the original message by reading the rails in the correct order
    let decoded = '';
    rail = 0;
    direction = 1;

    for (let i = 0; i < string.length; i++) {
        if (railStrings[rail].length) {
            decoded += railStrings[rail].shift();
        }
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
            direction *= -1;
        }
    }
    return decoded;
}

/**
 * Rotates the wheel by a given number of steps.
 *
 * @param {Array} wheel - The wheel array to rotate.
 * @param {number} steps - The number of steps to rotate.
 * @returns {Array} - The rotated wheel.
 */
export function rotateWheel(wheel, steps) {
    if (steps < 0) {
        steps = wheel.length + steps;
    }
    return wheel.slice(steps).concat(wheel.slice(0, steps));
}

/**
 * Encodes a string using the Chaocipher algorithm.
 *
 * @param {string} string - The input string to encode.
 * @param {number} [inc_a=0] - The increment for rotating the left wheel.
 * @param {number} [del_a=1] - The position for deletion and re-insertion in the left wheel.
 * @param {number} [inc_b=1] - The increment for rotating the right wheel.
 * @param {number} [del_b=2] - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The encoded string.
 */
export function chaocipherEncode(string, inc_a = 0, del_a = 1, inc_b = 1, del_b = 2) {
    return runChaocipher(lettersOnly(string), "encode", inc_a, del_a, inc_b, del_b);
}

/**
 * Decodes a string using the Chaocipher algorithm.
 *
 * @param {string} string - The input string to decode.
 * @param {number} [inc_a=1] - The increment for rotating the left wheel.
 * @param {number} [del_a=2] - The position for deletion and re-insertion in the left wheel.
 * @param {number} [inc_b=0] - The increment for rotating the right wheel.
 * @param {number} [del_b=1] - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The decoded string.
 */
export function chaocipherDecode(string, inc_a = 1, del_a = 2, inc_b = 0, del_b = 1) {
    return runChaocipher(string, "decode", inc_a, del_a, inc_b, del_b);
}

/**
 * The core function that performs encoding or decoding using the Chaocipher algorithm.
 *
 * @param {string} string - The input string to process.
 * @param {string} mode - The mode ('encode' or 'decode') to determine the operation.
 * @param {number} inc_a - The increment for rotating the left wheel.
 * @param {number} del_a - The position for deletion and re-insertion in the left wheel.
 * @param {number} inc_b - The increment for rotating the right wheel.
 * @param {number} del_b - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The processed (encoded or decoded) string.
 */
export function runChaocipher(string, mode, inc_a, del_a, inc_b, del_b) {
    let left = ["H", "X", "U", "C", "Z", "V", "A", "M", "D", "S", "L", "K", "P", "E", "F", "J", "R", "I", "G", "T", "W", "O", "B", "N", "Y", "Q"];
    let right = ["P", "T", "L", "N", "B", "Q", "D", "E", "O", "Y", "S", "F", "A", "V", "Z", "K", "G", "J", "R", "I", "H", "W", "X", "U", "M", "C"];

    if (mode === "decode") {
        [left, right] = [right, left];
    }

    return Array.from(string).map(char => {
        if (/[A-Za-z]/.test(char)) {
            const index = right.indexOf(char.toUpperCase());
            let out = left[index];
            out = isUpperCase(char) ? out : out.toLowerCase();

            left = rotateWheel(left, index + inc_a);
            const delIndexA = (del_a < 0) ? left.length + del_a : del_a;
            left.splice(13, 0, left.splice(delIndexA, 1)[0]);

            right = rotateWheel(right, index + inc_b);
            const delIndexB = (del_b < 0) ? right.length + del_b : del_b;
            right.splice(13, 0, right.splice(delIndexB, 1)[0]);

            return out;
        }
        return char;
    }).join("");
}