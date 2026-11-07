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

// An image of the result, wrapped to about the width it's shown at. The button only shows once there's a result.
const image = document.getElementById("brailleImage");
image.addEventListener("click", () => {
    createImage(output.textContent, {
        filename: "braille.png",
        width: output.offsetWidth,
        font: `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Segoe UI Symbol"`,
        ...(document.getElementById("brailleTransparent").checked ? { bgcolor: "rgba(0, 0, 0, 0)" } : {}),
    });
});
