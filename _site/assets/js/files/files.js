const HEADERS = {
    "2D 2D 2D 2D 2D 42 45 47 49 4E 20 53 53 48 32 20":"SSH",
    "89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52":"PNG",
    "89 50 4E 47 0D 0A 1A 0A":"PNG",
    "D0 CF 11 E0 A1 B1 1A E1":"DB, DOC, DOT, PPS, PPT, XLS, VSD, WPS",
    "4D 54 68 64":"MIDI",
    "66 74 79 70 69 73 6F 6D":"MP4",
    "66 74 79 70 6D 70 34 32":"MP4",
    "66 74 79 70 4D 53 4E 56":"MP4",
    "38 42 50 53 00 01":"PSD",
    "47 49 46 38 37 61":"GIF87a",
    "47 49 46 38 39 61":"GIF89a",
    "49 44 33 03 37":"GIF",
    "49 44 33 03 39":"GIF",
    "49 44 33 03":"MP3",
    "FF FB":"MP3",
    "FF F3":"MP3",
    "FF F2":"MP3",
    "7B 5C 72 74 66 31":"RTF",
    "25 50 44 46":"PDF",
    "52 49 46 46":"WAV",
    "1F 8B":"GZIP",
    "50 4B 03 04":"ZIP",
    "37 7A BC AF 27 1C":"7ZIP",
    "FD 37 7A 58 5A 00":"XZ",
    "FF D8 FF":"JPG",
    "00 00 00 0C 6A 50 20 20 0D 0A 87 0A":"JPEG 2000",
    "FF 4F FF 51":"JPEG 2000",
    "42 4D":"BMP",
    "4D 5A":"DLL, EXE, PIF, SCR, SYS","78":"DMG"
};

// Pull the first 16 bytes from a file and try a header match
function getFileHeader(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer.slice(0, 16));
    
        // Convert the bytes to a hexadecimal string
        const hexString = Array.from(uint8Array, (byte) => byte.toString(16).padStart(2, "0")).join(" ");
        let fileInfo;
        for (let [hex, name] of Object.entries(HEADERS)) {
            if(hexString.toUpperCase().startsWith(hex)) {
                console.log(hexString.toUpperCase());
                console.log(hex);
                fileInfo = `<code class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">File match: <strong>${name}</strong></code> - ${hexString}`;
            }
        }

        document.getElementById("filecheckResults").innerHTML = fileInfo ? fileInfo : `This file header is not on our list: ${hexString}`;
    };

    reader.onerror = function (error) {
        console.error('Error reading the file:', error.message);
        document.getElementById("filecheckResults").textContent = error.message;
    };

    reader.readAsArrayBuffer(file);
}

const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        getFileHeader(selectedFile);
    }
});