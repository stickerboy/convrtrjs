/**
 * Splits a hex string into chunks of a specified size and pads each chunk if necessary.
 * 
 * This function takes a hexadecimal string and splits it into chunks of the specified size.
 * If a chunk has fewer characters than the specified size, it pads the chunk with the specified padding character
 * (either "0" or "F") to reach the desired length. Each chunk is then prefixed with "#" to form valid hex color codes.
 * 
 * @param {string} hex - The hexadecimal string to be split into chunks.
 * @param {number} chunkSize - The size of each chunk.
 * @param {string} [paddingChar="F"] - The character to pad chunks with, default is "F".
 * @returns {string[]} An array of hex color codes, each prefixed with "#".
 * @throws {Error} Throws an error if the padding character is not "0" or "F".
 */
export function hexToChunks(hex, chunkSize, paddingChar = "F") {
    // Validate the padding character
    if (paddingChar !== "0" && paddingChar !== "F") {
        throw new Error(`Invalid padding character. Only "0" or "F" are allowed.`);
    }

    let chunks = [];
    for (let i = 0; i < hex.length; i += chunkSize) {
        let chunk = hex.slice(i, i + chunkSize);
        // Pad chunk with the specified padding character if it's less than chunk size
        chunk = chunk.padEnd(chunkSize, paddingChar);
        chunks.push(`<div class="color-block" style="background-color:#${chunk}" title="#${chunk}">
                        <span class="visually-hidden">#${chunk}</span>
                     </div>`);
    }
    return chunks.join("");
}
