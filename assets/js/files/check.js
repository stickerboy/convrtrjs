import * as check from './check-fn.js';

Object.entries(check).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const fileInput = document.getElementById("fileInput");
fileInput && fileInput.addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        check.getFileHeader(selectedFile);
    }
});