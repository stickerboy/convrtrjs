/**
 * Applies the ROT (Caesar cipher) encryption or decryption to a given string.
 * @param {string} string - The input string to be encoded or decoded.
 * @param {number} n - The rotation value (positive for encoding, negative for decoding).
 * @param {string} alpha - Custom alphabet (optional, defaults to English alphabet excluding 'a').
 * @returns {string} - The resulting string after applying the ROT transformation.
 */
function rot(string, n, alpha) {
    if (n == null) {
        // Use ROT-13 by default
        n = -13;
    }
    n = Number(n);
    string = String(string);
    if (n === 0) {
        return string;
    }
    if (n < 0) {
        // Decode instead of encode
        n += 26;
    }
    const ab = alpha ? alpha : alphabet.substring(1); // Custom alphabet (default: English alphabet trimming the initial space)
    const length = ab.length;
    let result = "";

    for (const char of string) {
        if (isLetter(char)) {
            const currentPosition = ab.indexOf(char.toUpperCase());
            let shiftedPosition = (currentPosition + n) % length;
            let shiftedChar = ab.charAt(shiftedPosition);

            if (isUpperCase(char)) {
                result += shiftedChar.toUpperCase();
            } else {
                result += shiftedChar.toLowerCase();
            }
        } else {
            result += char;
        }
    }
    return result;
}
