/**
 * Merges multiple Base64 strings by selecting the most frequent character at each position.
 *
 * @param {...string} args - The input strings to merge.
 * @returns {string} - The merged string.
 */
export function mergeBase64(...args) {
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
 * Performs a lookahead operation on the datanode using the given key.
 *
 * @param {string} key - The key used for the lookahead operation.
 * @param {string} datanode - The datanode to process.
 * @returns {string} - The processed output.
 */
function lookahead(key, datanode) {
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
    if (n < 1) {
        throw new Error("Minimum character count cannot be less than one");
    } else {
        // Regular expression to match sequences of at least `n` printable characters
        const regex = new RegExp(`[\\x20-\\x7E]{${n},}`, 'g');
        return string.match(regex) || [];
    }
}

/**
 * Extracts characters from the data string at specific positions based on calendar-like offsets.
 *
 * @param {string} string - The input string.
 * @returns {string} - The resulting string after extracting specific characters.
 */
function calendar(string) {
    const deltas = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    let out = "";
    const count = string.length;
    let offset = 31;
    let n = 1;

    while (offset < count) {
        out += string[offset];
        offset = deltas[n % 12] + n + Math.floor(n / 12) * 365;
        n += 1;
    }

    return out;
}

// Extract strings
const stringsDecodeButton = document.getElementById("stringsDecode");
if(stringsDecodeButton) {
    stringsDecodeButton.addEventListener("click", function () {
        const stringsString = document.getElementById("stringsText");
        const stringsKey = document.getElementById("stringsKey");

        if (!emptyContainerCheck(stringsString.value, stringsString)) {
            return false;
        }
        if (!largeDataWarning(stringsString.value, stringsString)) {
            return false;
        }

        document.getElementById("stringsResults").textContent = strings(stringsString.value);
    });
}