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