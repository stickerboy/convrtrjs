/**
 * Pulls the first 16 bytes from a file and tries to match the header.
 *
 * @param {File} file - The file to analyze.
 * @returns {void} - Displays the file header information in the specified format.
 */
export function getFileHeader(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer.slice(0, 16));
        const hexString = convertToHexString(uint8Array);
        const textString = new Option(String.fromCharCode(...uint8Array)).innerHTML;

        const fileInfo = matchFileHeader(hexString, textString) || generateNoMatchInfo(hexString, textString);

        document.getElementById("checkResults").innerHTML = fileInfo;
    };

    reader.onerror = function (error) {
        console.error('Error reading the file:', error.message);
        document.getElementById("checkResults").textContent = error.message;
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * @param {Uint8Array} uint8Array - The Uint8Array to convert.
 * @returns {string} - The hexadecimal string representation.
 */
export function convertToHexString(uint8Array) {
    return Array.from(uint8Array, byte => byte.toString(16).padStart(2, "0")).join(" ");
}

/**
 * Matches the file header with known headers.
 *
 * @param {string} hexString - The hexadecimal string representation of the file header.
 * @param {string} textString - The text string representation of the file header.
 * @returns {string|null} - The matched file info or null if no match is found.
 */
function matchFileHeader(hexString, textString) {
    for (const header of HEADERS) {
        for (const item of header.hex) {
            if (hexString.toUpperCase().includes(item)) {
                return `<code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">File match</code>
<br />${hexString}
<br /><strong>${header.label}</strong>
<br /><code class="d-inline-flex px-2 bg-dark bg-opacity-10 border border-dark border-opacity-10 rounded-2">${textString}</code>`;
            }
        }
    }
    return null;
}

/**
 * Generates the no-match information.
 *
 * @param {string} hexString - The hexadecimal string representation of the file header.
 * @param {string} textString - The text string representation of the file header.
 * @returns {string} - The no-match info HTML string.
 */
function generateNoMatchInfo(hexString, textString) {
    return `<code class="d-inline-flex px-2 bg-danger bg-opacity-10 border border-danger border-opacity-10 rounded-2">No match</code>
<br />This file header is not on our list:
<br />${hexString}
<br /><code class="d-inline-flex px-2 bg-dark bg-opacity-10 border border-dark border-opacity-10 rounded-2">${textString}</code>`;
}