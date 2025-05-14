import { alphabet } from '../toolkit.mjs';

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

