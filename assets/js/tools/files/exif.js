import * as exif from '../../lib/files/exif.js';

const exifInput = document.getElementById("exifInput");
exifInput && exifInput.addEventListener("change", async function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        exif.getExifInfo(selectedFile);
    }
});