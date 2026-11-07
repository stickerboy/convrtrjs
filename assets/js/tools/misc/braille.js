import { bindToolFrame, withNote, leftOutNote } from '../../ui/tool-frame.js';
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

const code = document.getElementById("brailleCode");

/**
 * Converts with the chosen code, noting anything left out.
 *
 * @param {string} text - The text or Braille.
 * @param {string} mode - What it is: "text" is turned into Braille, "braille" back into text.
 * @returns {object} The result, with a note of anything that had no Braille, or wasn't Braille the code has.
 */
const convert = (text, mode) => {
    const { text: result, missing } = braille.translateBraille(text, mode, code.value);
    return withNote(result, leftOutNote(missing, mode === "text" ? "Braille" : "letter or sign"));
};

bindToolFrame({
    id: "braille",
    modes: [
        { button: "brailleToBraille", run: (text) => convert(text, "text") },
        { button: "brailleToText", run: (text) => convert(text, "braille") },
    ],
    watch: ["brailleCode"],
    flow: () => [document.querySelector("#brailleToBraille[aria-pressed=true]") ? "To Braille in " : "To text from ", { value: code.selectedOptions[0].textContent }],
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
