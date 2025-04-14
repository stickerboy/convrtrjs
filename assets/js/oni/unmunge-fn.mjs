/**
 * Unmunges a datanode using a given key.
 *
 * @param {string} key - The key used for unmunging.
 * @param {string} datanode - The datanode to be unmunged.
 * @returns {string} - The unmunged data.
 */
export function unmunge(key, datanode) {
    let keyArray = Array.from(key, char => char.charCodeAt(0) % 10);
    keyArray = keyArray.concat(keyArray.slice(0, keyArray.length - 1).reverse());

    return Array.from({ length: Math.floor(datanode.length / 10) }, (_, row) => {
        return datanode[10 * row + keyArray[row % keyArray.length]];
    }).join("");
}