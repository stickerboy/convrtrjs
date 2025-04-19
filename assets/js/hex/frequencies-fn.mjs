import * as toolkit from "../toolkit.mjs";

/** 
 * Generates a frequency map of hexadecimal substrings of a specified length from a given string. 
 * 
 * @param {string} string - The input string containing hexadecimal values. 
 * @param {string} delimiter - The delimiter used to separate hexadecimal values in the input string. 
 * @param {number} chunkSize - The size of the chunks to be considered for the frequency map. 
 * @returns {Object} An object containing the frequency of each hexadecimal substring. 
 * 
 * @throws {Error} Throws an error if the hexadecimal contains invalid characters. 
**/
export function generateHexFrequencies(string, delimiter, chunkSize = 1) {
    if (toolkit.isValidHex(string, delimiter)) {
        const hexFrequencies = {};
        let cleanStr = toolkit.cleanString(string);

        // Remove delimiters and convert input to uppercase for case insensitivity
        const upperInput = cleanStr.replace(new RegExp(delimiter, 'g'), '').toUpperCase();

        // Function to update frequencies for the given group size
        const split = upperInput.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
        split.forEach((group) => {
            if (group.length === chunkSize && new Set(group.match(/.{2}/g)).size === 1) { // Check if all pairs are identical
                const withDelimiter = group.match(/.{1,2}/g).join(delimiter);
                hexFrequencies[withDelimiter] = (hexFrequencies[withDelimiter] || 0) + 1;
            }
        });

        return hexFrequencies;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}