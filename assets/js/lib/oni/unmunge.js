/**
 * Unmunges a datanode using a given key: takes one character from each row of 10, at the column given by the key.
 * The key's character codes (mod 10) are followed by the key reversed, without the first digit,
 * e.g. digits 1 2 3 give columns 1 2 3 3 2 - as in the original ONI-Tools Ruby version. Rows count whole characters,
 * so an emoji is one character.
 *
 * @param {string} key - The key used for unmunging.
 * @param {string} datanode - The datanode to be unmunged.
 * @returns {string} - The unmunged data.
 */
export function unmunge(key, datanode) {
    let keyArray = Array.from(String(key), (char) => char.codePointAt(0) % 10);
    if (keyArray.length === 0) {
        throw new Error("The key can't be empty");
    }
    keyArray = keyArray.concat(keyArray.slice(1).reverse());
    const chars = Array.from(datanode);

    return Array.from({ length: Math.floor(chars.length / 10) }, (_, row) => {
        return chars[10 * row + keyArray[row % keyArray.length]];
    }).join("");
}
