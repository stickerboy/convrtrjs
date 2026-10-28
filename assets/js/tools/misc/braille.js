import { emptyContainerCheck } from '../../ui/input.js';
import { bindTool } from '../../ui/tool.js';
import { createImage } from '../../lib/toolkit.js';
import * as braille from '../../lib/misc/braille.js';

let bR = document.getElementById("brailleResults");
let bIR = document.getElementById("brailleImageResults");
let bIT = document.getElementById("brImageTransparency");
let brailleImage = document.getElementById("generateBrailleImage");
let brailleSwitch = document.getElementById("brailleSwitch");

// Converts in the direction chosen by the switch: Braille to text when checked, otherwise text to Braille
bindTool({
    button: "brailleConvert",
    input: "brailleTextarea",
    output: "brailleResults",
    clear: true,
    run: (text) => brailleSwitch.checked ? braille.convertBraille(text) : braille.convertBraille(text, "text"),
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