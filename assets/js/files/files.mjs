import * as files from './files-fn.mjs';

const fileInput = document.getElementById("fileInput");
fileInput && fileInput.addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        files.getFileHeader(selectedFile);
    }
});