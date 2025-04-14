import { fibonacci } from "./ciphers-fn.mjs";

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
 * Decrypts text using the Smithy cipher.
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