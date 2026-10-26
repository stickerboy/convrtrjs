/**
 * Converts periodic elements from a string representation to their corresponding target property values.
 * @param {string} string - The input string containing element representations.
 * @param {string} sourceProp - The property used for matching elements in the input string.
 * @param {string} targetProp - The target property whose value should be extracted.
 * @param {boolean} removeDelimiters - Whether to remove delimiters (optional, default is false).
 * @returns {string} - The resulting string after converting elements.
 * @throws {Error} - Throws an error if an element with the specified source property is not found,
 * or if the target property does not exist for a matched element.
 */
export function convertElements(string, sourceProp, targetProp, removeDelimiters) {
    const strings = string.trim().split(/[ ,:;\-]+/);
    const results = [];

    for (const str of strings) {
        let found = false;

        for (const el of ELEMENTS) {
            if (el.hasOwnProperty(sourceProp)) {
                // Compare the value regardless of its type (string or number)
                if (el[sourceProp] === str || el["number"] === Number(str)) {
                    if (el.hasOwnProperty(targetProp)) {
                        const targetValue = el[targetProp];
                        results.push(targetValue);
                        found = true;
                        break;
                    } else {
                        throw new Error(`Property "${targetProp}" does not exist for ${el.name}`);
                    }
                }
            }
        }

        if (!found) {
            throw new Error(`Element with ${sourceProp} "${str}" not found`);
        }
    }

    let convertedElements;
    if (removeDelimiters && removeDelimiters === true) {
        convertedElements = results.join("");
    } else {
        convertedElements = results.join(string.match(/[ ,\-]+/));
    }
    return convertedElements;
}