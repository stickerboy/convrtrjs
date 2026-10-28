import { fibonacci } from "./common.js";

/**
 * Shifts each ASCII letter of the text by the Smithy keyword shifts (direction 1 encrypts, -1 decrypts).
 * The text is processed as UTF-8 bytes - the key position advances once per byte - and everything other than
 * A-Z / a-z is left unchanged, so non-ASCII characters come through intact.
 */
function smithyShift(string, key, direction) {
    const fib = fibonacci(key.length);
    const keywordShifts = key.split("").map((char, index) => (fib[index % fib.length] + char.charCodeAt(0)) % 26);

    const bytes = new TextEncoder().encode(string).map((byte, i) => {
        if (byte >= 65 && byte <= 90 || byte >= 97 && byte <= 122) { // A-Z or a-z
            const base = byte >= 65 && byte <= 90 ? 65 : 97;
            const shift = keywordShifts[i % key.length] * direction;
            return ((byte - base + shift + 26) % 26) + base;
        }
        return byte;
    });
    return new TextDecoder().decode(bytes);
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
    return smithyShift(string, key, 1);
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
    return smithyShift(string, key, -1);
}
