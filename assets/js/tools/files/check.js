import { getFileHeader } from '../../lib/files/check.js';

const escapeHtml = (text) => new Option(text).innerHTML;

function renderMatch(hex, text, label) {
    return `<code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">File match</code>
<br />${hex}
<br /><strong>${label}</strong>
<br /><code class="d-inline-flex px-2 bg-dark bg-opacity-10 border border-dark border-opacity-10 rounded-2">${escapeHtml(text)}</code>`;
}

function renderNoMatch(hex, text) {
    return `<code class="d-inline-flex px-2 bg-danger bg-opacity-10 border border-danger border-opacity-10 rounded-2">No match</code>
<br />This file header is not on our list:
<br />${hex}
<br /><code class="d-inline-flex px-2 bg-dark bg-opacity-10 border border-dark border-opacity-10 rounded-2">${escapeHtml(text)}</code>`;
}

const fileInput = document.getElementById("fileInput");
fileInput && fileInput.addEventListener("change", async function(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
        return;
    }

    const results = document.getElementById("checkResults");
    try {
        const { hex, text, label } = await getFileHeader(selectedFile);
        results.innerHTML = label ? renderMatch(hex, text, label) : renderNoMatch(hex, text);
    } catch (error) {
        console.error("Error reading the file:", error.message);
        results.textContent = error.message;
    }
});
