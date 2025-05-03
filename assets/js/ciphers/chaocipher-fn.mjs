import { lettersOnly } from "../tools.mjs";
import { isUpperCase } from "../toolkit.mjs";

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