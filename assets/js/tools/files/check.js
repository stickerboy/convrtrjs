import * as check from '../../lib/files/check.js';

const fileInput = document.getElementById("fileInput");
fileInput && fileInput.addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        check.getFileHeader(selectedFile);
    }
});