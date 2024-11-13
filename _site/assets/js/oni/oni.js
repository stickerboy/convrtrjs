/**
 * Merges multiple Base64 strings by selecting the most frequent character at each position.
 *
 * @param {...string} args - The input strings to merge.
 * @returns {string} - The merged string.
 */
function mergeBase64(...args) {
    // Convert each string to an array of characters
    let charArrays = args.map(string => string.split(""));

    // Zip the arrays together
    let zipped = [];
    for (let i = 0; i < charArrays[0].length; i++) {
        zipped.push(charArrays.map(arr => arr[i]));
    }

    // Select the most frequent character at each position
    let merged = zipped.map(arr => {
        return arr.reduce((a, b, _, arr) => 
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        );
    });

    // Join the array back into a string
    return merged.join('');
}

/**
 * Unmunges a datanode using a given key.
 *
 * @param {string} key - The key used for unmunging.
 * @param {string} datanode - The datanode to be unmunged.
 * @returns {string} - The unmunged data.
 */
function unmunge(key, datanode) {
    let keyArray = Array.from(key, char => char.charCodeAt(0) % 10);
    keyArray = keyArray.concat(keyArray.slice(0, keyArray.length - 1).reverse());

    return Array.from({ length: Math.floor(datanode.length / 10) }, (_, row) => {
        return datanode[10 * row + keyArray[row % keyArray.length]];
    }).join('');
}

/**
 * Unscrambles a string by interleaving its characters.
 * e.g. "abcdef" => "badcfe"
 *
 * @param {string} string - The input scrambled string.
 * @returns {string} - The unscrambled string.
 */
function unscramble(string) {
    const length = string.length;
    const part1 = [];
    const part2 = [];

    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            part2.push(string[i]);
        } else {
            part1.push(string[i]);
        }
    }

    let result = "";
    for (let i = 0; i < part1.length; i++) {
        result += part1[i] + (part2[i] || "");
    }

    return result;
}

/**
 * Interleaves the characters of two strings.
 *
 * @param {string} string1 - The first string.
 * @param {string} string2 - The second string.
 * * @param {string} delimiter - An optional delimiter which may be useful when interleaving hexadecimal strings.
 * @returns {string} - The interleaved string.
 */
function interleave(string1, string2, delimiter = "") {
    let result = [];
    let length = Math.min(string1.length, string2.length);

    for (let i = 0; i < length; i++) {
        result.push(string1[i], string2[i]);
    }

    // If string1 is longer, add the remaining characters
    if (string1.length > string2.length) {
        result.push(...string1.slice(length));
    }

    // If string2 is longer, add the remaining characters
    if (string2.length > string1.length) {
        result.push(...string2.slice(length));
    }

    return result.join(delimiter);
}

/**
 * Extracts sequences of printable characters from a string.
 *
 * @param {string} data - The input string to be scanned.
 * @param {number} [n=4] - The minimum length of sequences to extract.
 * @returns {Array<string>} - An array of sequences of printable characters of at least length `n`.
 */
function strings(string, n = 4) {
    // Regular expression to match sequences of at least `n` printable characters
    const regex = new RegExp(`[\\x20-\\x7E]{${n},}`, 'g');
    return string.match(regex) || [];
}