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
        bR.textContent = braille.convertBraille(brailleString.value, "braille");
    } else {
        bIR.textContent = braille.convertBraille(brailleString.value, "text");
    }
});

brailleSwitch && brailleSwitch.addEventListener("click", function () {
    if (brailleSwitch.checked) {
        this.nextElementSibling.innerText = "Convert Braille to Text";
    } else {
        this.nextElementSibling.innerText = "Convert Text to Braille";
    }
});

brailleImage && brailleImage.addEventListener("click", function () {
    if (!emptyContainerCheck(bIR.innerHTML, bIR, "There are no symbols present, please add at least one symbol to generate an image")) {
        return false;
    }
    let bOptions = {};
    bOptions.font = `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    bOptions.paddingTop = 0;
    bOptions.fontAdjust = true;
    if (bIT.checked) {
        bOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(bIR.offsetWidth, bIR.offsetHeight, "braille.png", brailleImage, bIR.innerText, bOptions);
});