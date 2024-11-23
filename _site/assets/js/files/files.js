/**
 * Pulls the first 16 bytes from a file and tries to match the header
 *
 * @param {File} file - The file to analyze.
 * @returns {void} - Displays the file header information in the specified format.
 *
 * @example
 * // Input: A file with specific content
 * // Output: Displays whether the file header matches any predefined headers.
 */
function getFileHeader(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer.slice(0, 16));

        // Convert the bytes to a hexadecimal string
        const hexString = Array.from(uint8Array, (byte) => byte.toString(16).padStart(2, "0")).join(" ");
        const textString = new Option(String.fromCharCode(...uint8Array)).innerHTML;
        let fileInfo;

        HEADERS.forEach((header) => {
            header.hex.forEach((item) => {
                if(hexString.toUpperCase().includes(item)) {
                    fileInfo = `<code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">File match</code>
<br />${hexString}
<br /><strong>${header.label}</strong>
<br /><code>${textString}</code>`;
                }
            });
        });

        fileInfo = fileInfo ? fileInfo : `<code class="d-inline-flex px-2 bg-danger bg-opacity-10 border border-danger border-opacity-10 rounded-2">No match</code>
<br />This file header is not on our list:
<br />${hexString}
<br /><code>${textString}</code>`;
        document.getElementById("filecheckResults").innerHTML = fileInfo;
    };

    reader.onerror = function (error) {
        console.error('Error reading the file:', error.message);
        document.getElementById("filecheckResults").textContent = error.message;
    };

    reader.readAsArrayBuffer(file);
}

const fileInput = document.getElementById("fileInput");
fileInput && fileInput.addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        getFileHeader(selectedFile);
    }
});