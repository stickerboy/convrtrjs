import { emptyContainerCheck }  from '../scripts.mjs';
import { createImage }  from '../toolkit.mjs';

const covenantButtons = document.getElementsByClassName("cov-glyph");
let cR = document.getElementById("covenantResults");
let cIR = document.getElementById("covenantImageResults");
let cIT = document.getElementById("covImageTransparency");
if (covenantButtons.length > 0) {
    Array.from(covenantButtons, c => c.addEventListener("click", function () {
        Array.from(covenantButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        cR.textContent += c.textContent;
        cIR.textContent += c.innerHTML;
    }));
}

const covenantImage = document.getElementById("generateCovenantImage");
covenantImage && covenantImage.addEventListener("click", function () {
    if (!emptyContainerCheck(cIR.innerHTML, cIR, "There are no glyphs present, please select at lease one glyph to generate an image")) {
        return false;
    }
    let cOptions = {};
    cOptions.font = "6rem 'Covenant'";
    cOptions.paddingTop = 108;
    if (cIT.checked) {
        cOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(cIR.offsetWidth, cIR.offsetHeight, "covenant-glyphs.png", covenantImage, cIR.innerText, cOptions);
});