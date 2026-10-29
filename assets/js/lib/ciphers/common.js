export const upperAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Builds a custom (uppercase, 26-letter) alphabet using a given key: the key's unique letters, then the rest of the alphabet.
 * The key's case doesn't matter, and anything other than A-Z is ignored.
 * @param {string} string - A user-specified text string.
 * @returns {string} - The custom alphabet.
 *
 * @example
 * // Input: "TEST" or "test"
 * // Output: "TESABCDFGHIJKLMNOPQRUVWXYZ"
 */
export function getCustomAlphabet(string) {
    const keyLetters = string.toUpperCase().replace(/[^A-Z]/g, "");
    return [...new Set(keyLetters + upperAlphabet)].join("");
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

