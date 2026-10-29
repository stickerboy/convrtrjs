/**
 * Performs a lookahead operation on the datanode using the given key.
 * The datanode is read in pairs of characters: if the first is odd, the key byte is added to the second, otherwise it's subtracted.
 *
 * @param {string} key - The key used for the lookahead operation.
 * @param {string} datanode - The datanode to process.
 * @returns {string} - The processed output, one character per byte.
 */
export function lookahead(key, datanode) {
    const keyArray = Array.from(key, char => char.charCodeAt(0));
    let output = "";

    for (let i = 0; i < datanode.length >> 1; i++) {
        const k = keyArray[i % keyArray.length];
        const a = datanode.charCodeAt(i << 1);
        const b = datanode.charCodeAt((i << 1) + 1);
        output += String.fromCharCode((a & 1 ? b + k : b - k) & 0xFF);
    }

    return output;
}