import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';
import { createImage } from '../toolkit.mjs';
import * as braille from './braille-fn.mjs';

let bR = document.getElementById("brailleResults");
let bIR = document.getElementById("brailleImageResults");
let bIT = document.getElementById("brImageTransparency");
let brailleImage = document.getElementById("generateBrailleImage");
let brailleSwitch = document.getElementById("brailleSwitch");

const brailleButton = document.getElementById("brailleConvert");
brailleButton && brailleButton.addEventListener("click", function () {
    const brailleString = document.getElementById("brailleTextarea");

    if (!emptyContainerCheck(brailleString.value, brailleString)) {
        bR.textContent = "";
        return false;
    }
    if (!largeDataWarning(brailleString.value, brailleString)) {
        return false;
    }

    if (brailleSwitch.checked) {
        bR.textContent = braille.convertBraille(brailleString.value);
    } else {
        bR.textContent = braille.convertBraille(brailleString.value, "text");
    }
});

brailleSwitch && brailleSwitch.addEventListener("click", function () {
    this.nextElementSibling.innerText = brailleSwitch.checked ? "Convert Braille to Text" : "Convert Text to Braille";
    if (brailleSwitch.checked) {
        document.getElementById("brailleResults").classList.add("fs-6");
        return false;
    }
    document.getElementById("brailleResults").classList.remove("fs-6");
});

brailleImage && brailleImage.addEventListener("click", function () {
    // Avoid accessing innerHTML when bIR may not exist yet
    const bIRContent = bIR?.innerHTML ?? "";
    if (!emptyContainerCheck(bIRContent, bIR, "There are no symbols present, please add at least one symbol to generate an image")) {
        return false;
    }
    let bOptions = {};
    bOptions.font = `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    bOptions.paddingTop = 0;
    bOptions.fontAdjust = true;
    if (bIT.checked) {
        bOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(bR.offsetWidth, bR.offsetHeight, "braille.png", brailleImage, bR.innerText, bOptions);
});