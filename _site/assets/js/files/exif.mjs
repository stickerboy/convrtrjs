import * as exif from './exif-fn.mjs';

Object.entries(exif).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const exifInput = document.getElementById("exifInput");
exifInput && exifInput.addEventListener("change", async function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        exif.getExifInfo(selectedFile);
    }
});