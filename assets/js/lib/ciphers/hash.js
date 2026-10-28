// Hashing via @noble/hashes (https://github.com/paulmillr/noble-hashes), loaded on first use
const loadNoble = () => Promise.all([
    import("@noble/hashes/legacy.js"),
    import("@noble/hashes/sha2.js"),
    import("@noble/hashes/sha3.js"),
    import("@noble/hashes/utils.js"),
]).then(([legacy, sha2, sha3, utils]) => ({ ...legacy, ...sha2, ...sha3, ...utils }));

// CRC-32 (IEEE 802.3, as used by ZIP and PNG) lookup table
const CRC32_TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    return c >>> 0;
});

/**
 * Calculates the CRC-32 checksum of a string (encoded as UTF-8).
 *
 * @param {string} string - The input string.
 * @returns {string} - The checksum as 8 lowercase hex characters.
 *
 * @example
 * // Input: "123456789"
 * // Output: "cbf43926"
 */
export function crc32(string) {
    let crc = 0xFFFFFFFF;
    for (const byte of new TextEncoder().encode(string)) {
        crc = CRC32_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
    }
    return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, "0");
}

/**
 * Generates a hash for the given string based on the specified hash method.
 *
 * Methods: MD5, SHA1, RIPEMD160, SHA224, SHA256, SHA384, SHA512, SHA3224, SHA3256, SHA3384, SHA3512,
 * KECCAK224, KECCAK256, KECCAK384, KECCAK512 and CRC32.
 * Keccak is the pre-standard version of SHA-3 (Keccak-256 is used by Ethereum); the outputs differ.
 *
 * @param {string} string - The input string to be hashed (encoded as UTF-8).
 * @param {string} hash - The hash method to be used (e.g., "MD5", "SHA1", etc.).
 * @returns {Promise<string>} - The generated hash value or an error message if the method is invalid or not supported.
 *
 * @example
 * // Input: "Hello, World!" with hash method "MD5"
 * // Output: "65a8e27d8879283831b664bd8b7f0ad4"
 */
export async function generateHashes(string, hash) {
    if (hash === "CRC32") {
        return crc32(string);
    }

    const noble = await loadNoble();
    const hashFunctions = {
        MD5: noble.md5,
        SHA1: noble.sha1,
        RIPEMD160: noble.ripemd160,
        SHA224: noble.sha224,
        SHA256: noble.sha256,
        SHA384: noble.sha384,
        SHA512: noble.sha512,
        SHA3224: noble.sha3_224,
        SHA3256: noble.sha3_256,
        SHA3384: noble.sha3_384,
        SHA3512: noble.sha3_512,
        KECCAK224: noble.keccak_224,
        KECCAK256: noble.keccak_256,
        KECCAK384: noble.keccak_384,
        KECCAK512: noble.keccak_512
    };

    const selectedHashFunction = hashFunctions[hash];
    return selectedHashFunction ? noble.bytesToHex(selectedHashFunction(noble.utf8ToBytes(string))) : "Invalid hash method provided or not supported";
}
