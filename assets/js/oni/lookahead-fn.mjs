/**
 * Performs a lookahead operation on the datanode using the given key.
 *
 * @param {string} key - The key used for the lookahead operation.
 * @param {string} datanode - The datanode to process.
 * @returns {string} - The processed output.
 */
export function lookahead(key, datanode) {
    const size = datanode.length >> 1;
    let a, b, k = 0;

    const keyArray = Array.from(key, char => char.charCodeAt(0));
    const s = keyArray.length;

    const datanodeArray = Array.from(datanode, char => char.charCodeAt(0));
    let output = [];

    const outByte = {
        default: (b, keyByte) => (b - keyByte) & 0xFF,
        1: (b, keyByte) => (b + keyByte) & 0xFF
    };

    for (let i = 0; i < size; i++) {
        k = keyArray[i % s];
        a = datanodeArray[i << 1];
        b = datanodeArray[(i << 1) + 1];
        output.push(outByte[a & 1 in outByte ? a & 1 : "default"](b, k));
    }

    return String.fromCharCode(...output);
}