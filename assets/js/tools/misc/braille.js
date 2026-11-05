import { bindToolFrame } from '../../ui/tool-frame.js';
import { createImage } from '../../ui/image.js';
import * as braille from '../../lib/misc/braille.js';

const output = document.getElementById("brailleResults");
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

// An image of the result, as wide as it's shown and at least as tall as a few lines, whatever the result's height.
// The button only shows once there's a result.
const image = document.getElementById("brailleImage");
image.addEventListener("click", () => {
    createImage(output.offsetWidth, Math.max(output.offsetHeight, 240), "braille.png", image, output.textContent, {
        font: `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Segoe UI Symbol"`,
        paddingTop: 0,
        fontAdjust: true,
        ...(document.getElementById("brailleTransparent").checked ? { bgcolor: "rgba(0, 0, 0, 0)" } : {}),
    });
});
