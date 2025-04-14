import { lettersOnly } from '../tools.mjs';

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

    return railStrings.flat().join("");
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
    const railStrings = Array.from({ length: rails }, (_, i) => string.slice(i > 0 ? railLengths.slice(0, i).reduce((a, b) => a + b, 0) : 0, railLengths.slice(0, i + 1).reduce((a, b) => a + b, 0)).split(""));

    // Reconstruct the original message by reading the rails in the correct order
    let decoded = "";
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
