// HTML for the frequency tools (Text Frequencies, Hex Frequencies); the counting lives in lib/toolkit.js

/**
 * Creates styled HTML elements for displaying unique characters from an array.
 *
 * @param {string[]} data - An array of unique characters.
 * @returns {string} - The HTML representation of the unique characters.
 *
 * @example
 * // Input: ["a", "b", "c"]
 * // Output: "<div class="g-col-12"> ..."
 */
export function styledUniqueArrayItems(data) {
    const uniqueCharsHTML = data.map(char => {
        const sanitizedChar = char.replace(/ /g, "Space").replace(/\t/g, "Tab");
        const displayChar = char.replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;");
        return `<code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2 me-2" style="width: max-content;" title="${sanitizedChar}" role="note">
                    ${displayChar}
                </code>`;
    }).join("");

    return `
        <div class="g-col-12">
            <p class="display-5 fs-5 mt-4">Unique characters</p>
            <div class="grid mt-2 grid-auto" id="unique-chars">
                ${uniqueCharsHTML}
            </div>
        </div>`;
}

/**
 * Creates styled HTML elements for displaying unique character frequencies.
 *
 * @param {Object} data - An object containing unique characters as keys and their frequencies as values.
 * @param {string} [title="Frequencies"] - The title to be displayed above the frequencies.
 * @param {number} [minColWidth=6] - The minimum column width for the grid.
 * @returns {string} - The HTML representation of the unique character frequencies.
 *
 * @example
 * // Input: { h: 1, e: 1, l: 3, o: 2, ',': 1, ' ': 1, w: 1, r: 1, d: 1, '!': 1 }, "Character Frequencies"
 * // Output: "<div class="g-col-12"> ..."
 */
export function styledArrayFrequencies(data, title = "Frequencies", minColWidth = 6) {
    // Bail out early if data is falsy or has no entries
    if (!data || Object.keys(data).length === 0) {
        return "";
    }

    // Generate HTML for each key-value pair
    const itemsHTML = Object.entries(data).map(([key, value]) => {
        return `<div>
                    <code tabindex="0" class="w-auto d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2 me-2" style="width: max-content;" title="Frequency of ${key}" role="note">
                        ${key} - ${value}
                    </code>
                </div>`;
    }).join("");

    // Construct the final HTML structure
    return `
        <div class="g-col-12">
            <p class="display-5 fs-5 mt-4">${title}</p>
            <div class="grid grid--fill mt-2" style="--bs-column-fill: ${minColWidth}rem">
                ${itemsHTML}
            </div>
        </div>`;
}
