import { emptyContainerCheck }  from '../scripts.mjs';
import { createImage, getKeyValue }  from '../toolkit.mjs';
import * as forerunner from './forerunner-fn.mjs';

const forerunnerButtons = document.getElementsByClassName("fr-glyph");
let fR = document.getElementById("forerunnerResults");
let fIR = document.getElementById("forerunnerImageResults");
let fIT = document.getElementById("frImageTransparency");

if (forerunnerButtons.length > 0) {
    Array.from(forerunnerButtons, c => c.addEventListener("click", function () {
        Array.from(forerunnerButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        fR.textContent += getKeyValue(c.dataset.glyph, forerunner.fralphabet);
        fIR.textContent += c.dataset.glyph;
    }));
}

const forerunnerImage = document.getElementById("generateForerunnerImage");
forerunnerImage && forerunnerImage.addEventListener("click", function () {
    if (!emptyContainerCheck(fIR.innerHTML, fIR, "There are no glyphs present, please select at least one glyph to generate an image")) {
        return false;
    }
    let fOptions = {};
    if (fIT.checked) {
        fOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(fIR.offsetWidth, fIR.offsetHeight, "forerunner-glyphs.png", forerunnerImage, fIR.innerText, fOptions);
});
