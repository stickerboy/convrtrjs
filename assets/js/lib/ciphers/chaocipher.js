const LEFT = "HXUCZVAMDSLKPEFJRIGTWOBNYQ";
const RIGHT = "PTLNBQDEOYSFAVZKGJRIHWXUMC";
/**
 * Turns a wheel's letters into numbers, 0 for A to 25 for Z, which are quicker to move around than letters.
 *
 * @param {string} letters - The wheel's 26 uppercase letters, in order.
 * @returns {Uint8Array} - The letters as numbers.
 */
function toWheel(letters) {
    return Uint8Array.from(letters, (letter) => letter.charCodeAt(0) - 65);
}

/**
 * Rotates a wheel by a given number of steps.
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
 * Permutes a wheel after a letter: turns it so the letter at `turn` is at the top (the zenith), then takes out the
 * letter at `take` and puts it back at the bottom (the nadir, position 13). Writes into `into`, so nothing is created
 * for each letter.
 *
 * @param {Uint8Array} wheel - The wheel as it is, as letter numbers.
 * @param {Uint8Array} into - Where to write the permuted wheel, 26 long.
 * @param {number} turn - The position to turn to the top, 0 to 25.
 * @param {number} take - The position, after turning, of the letter that moves to the bottom, 0 to 25.
 * @returns {void}
 */
function permute(wheel, into, turn, take) {
    for (let i = 0; i < 26; i++) {
        into[i] = wheel[(i + turn) % 26];
    }
    const taken = into[take];
    if (take < 13) {
        into.copyWithin(take, take + 1, 14);
    } else if (take > 13) {
        into.copyWithin(14, 13, take);
    }
    into[13] = taken;
}

/**
 * Encodes a string using the Chaocipher algorithm. Letters keep their case; anything else passes through and doesn't
 * move the wheels.
 *
 * @param {string} string - The input string to encode.
 * @param {number} [inc_a=0] - The increment for rotating the left wheel.
 * @param {number} [del_a=1] - The position for deletion and re-insertion in the left wheel.
 * @param {number} [inc_b=1] - The increment for rotating the right wheel.
 * @param {number} [del_b=2] - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The encoded string.
 *
 * @example
 * // Input: "Hello World"
 * // Output: "Wahqz Iuets"
 */
export function chaocipherEncode(string, inc_a = 0, del_a = 1, inc_b = 1, del_b = 2) {
    return runChaocipher(string, "encode", inc_a, del_a, inc_b, del_b);
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
    let left = toWheel(mode === "decode" ? RIGHT : LEFT);
    let right = toWheel(mode === "decode" ? LEFT : RIGHT);
    let spareLeft = new Uint8Array(26);
    let spareRight = new Uint8Array(26);
    const takeA = ((del_a % 26) + 26) % 26;
    const takeB = ((del_b % 26) + 26) % 26;

    // Letters as character codes, so case is a single bit: A-Z are 65-90, and a-z are the same with 32 added
    const codes = new Uint16Array(string.length);
    for (let i = 0; i < string.length; i++) {
        const code = string.charCodeAt(i);
        const lower = code | 32;
        if (lower < 97 || lower > 122) {
            codes[i] = code;
            continue;
        }
        const index = right.indexOf(lower - 97);
        codes[i] = left[index] + 65 + (code & 32);

        permute(left, spareLeft, (index + inc_a) % 26, takeA);
        permute(right, spareRight, (index + inc_b) % 26, takeB);
        [left, spareLeft] = [spareLeft, left];
        [right, spareRight] = [spareRight, right];
    }
    // In slices, as String.fromCharCode takes a limited number of arguments
    let result = "";
    for (let i = 0; i < codes.length; i += 8192) {
        result += String.fromCharCode(...codes.subarray(i, i + 8192));
    }
    return result;
}
