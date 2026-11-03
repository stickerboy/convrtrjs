import { bindToolFrame } from '../../ui/tool-frame.js';
import { createImage } from '../../ui/image.js';
import * as braille from '../../lib/misc/braille.js';

const output = document.getElementById("brailleResults");
const status = document.getElementById("brailleStatus");
const toBraille = document.getElementById("brailleToBraille");
const toText = document.getElementById("brailleToText");

// Braille is shown larger, so its dots can be read
const sizeOutput = (isBraille) => output.classList.toggle("braille-output", isBraille);
toBraille.addEventListener("click", () => sizeOutput(true));
toText.addEventListener("click", () => sizeOutput(false));
sizeOutput(true);

// convertBraille's mode names what it reads: "text" turns text into Braille
bindToolFrame({
    id: "braille",
    modes: [
        { button: "brailleToBraille", run: (text) => braille.convertBraille(text, "text") },
        { button: "brailleToText", run: (text) => braille.convertBraille(text) },
    ],
    errorPrefix: "Couldn't convert the Braille",
});

// An image of the output, as it's shown
const image = document.getElementById("brailleImage");
image.addEventListener("click", () => {
    if (output.value.trim() === "") {
        status.textContent = "Convert some text to make an image of";
        status.classList.add("text-danger");
        return;
    }
    createImage(output.offsetWidth, output.offsetHeight, "braille.png", image, output.value, {
        font: `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Segoe UI Symbol"`,
        paddingTop: 0,
        fontAdjust: true,
        ...(document.getElementById("brailleTransparent").checked ? { bgcolor: "rgba(0, 0, 0, 0)" } : {}),
    });
});
