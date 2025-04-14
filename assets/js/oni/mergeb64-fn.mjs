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