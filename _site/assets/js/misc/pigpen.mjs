import { emptyContainerCheck }  from '../scripts.mjs';
import { createImage }  from '../toolkit.mjs';

const pigpenButtons = document.getElementsByClassName("pig-glyph");
let pR = document.getElementById("pigpenResults");
let pIR = document.getElementById("pigpenImageResults");
let pIT = document.getElementById("pigImageTransparency");
if (pigpenButtons.length > 0) {
    Array.from(pigpenButtons, c => c.addEventListener("click", function () {
        Array.from(pigpenButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        pR.textContent += c.textContent;
        pIR.textContent += c.innerHTML;
    }));
}

const pigpenImage = document.getElementById("generatePigpenImage");
pigpenImage && pigpenImage.addEventListener("click", function () {
    if (!emptyContainerCheck(pIR.innerHTML, pIR, "There are no glyphs present, please select at lease one glyph to generate an image")) {
        return false;
    }
    let pOptions = {};
    pOptions.font = "6rem 'Pigpen Cipher'";
    pOptions.paddingTop = 108;
    if (pIT.checked) {
        pOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(pIR.offsetWidth, pIR.offsetHeight, "pigpen-glyphs.png", pigpenImage, pIR.innerText, pOptions);
});