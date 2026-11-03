import { createImage } from "./image.js";

const characters = (count) => `${count.toLocaleString()} character${count === 1 ? "" : "s"}`;

/**
 * Wires up a glyph tool built with the glyphFrame macro (macros/tool-frame.njk). The message box holds the text: its
 * glyphs are drawn as it changes, and the glyph keys type their letters into it where the cursor is. Element ids all
 * start with the frame's id: <id>Text, <id>Glyphs, <id>Status, <id>Image, <id>Transparent.
 *
 * @param {object} options
 * @param {string} options.id - The frame's id, usually the page's file slug.
 * @param {string} options.filename - What the image downloads as, e.g. "pigpen-glyphs.png".
 * @param {object} [options.image] - How the image is drawn, as createImage takes it (font, paddingTop, fontAdjust).
 */
export function bindGlyphKeyboard({ id, filename, image = {} }) {
    const text = document.getElementById(`${id}Text`);
    const glyphs = document.getElementById(`${id}Glyphs`);
    const status = document.getElementById(`${id}Status`);
    const frame = text.closest("[data-glyph-keyboard]");
    const count = frame.querySelector("[data-count-input]");
    const keys = new Map([...frame.querySelectorAll("[data-glyph]")].map((key) => [key.dataset.key.toUpperCase(), key.dataset.glyph]));

    const setStatus = (message = "", error = false) => {
        status.textContent = message;
        status.classList.toggle("text-danger", error);
    };

    // Each character as its glyph, keeping spaces and new lines; characters with no glyph are left out, and listed
    const draw = () => {
        const missing = new Set();
        glyphs.textContent = [...text.value].map((char) => {
            if (/\s/.test(char)) {
                return char;
            }
            const glyph = keys.get(char.toUpperCase());
            if (glyph === undefined) {
                missing.add(char);
            }
            return glyph ?? "";
        }).join("");
        count.textContent = characters([...text.value].length);
        const list = [...missing].slice(0, 5).map((char) => `"${char}"`).join(", ");
        setStatus(missing.size ? `No glyph for ${list}${missing.size > 5 ? " and others" : ""}, so left out of the glyphs` : "");
    };

    // Types at the cursor, replacing any selection, as a keyboard would. Focus stays on the key, so a phone's own
    // keyboard doesn't open over the glyphs.
    const type = (insert) => {
        text.setRangeText(insert, text.selectionStart, text.selectionEnd, "end");
        draw();
    };
    text.addEventListener("input", draw);
    frame.querySelectorAll("[data-key]").forEach((key) => key.addEventListener("click", () => type(key.dataset.key)));
    frame.querySelector("[data-backspace]").addEventListener("click", () => {
        const { selectionStart: start, selectionEnd: end, value } = text;
        if (start !== end) {
            type("");
        } else if (start > 0) {
            // A whole character, even an emoji's two halves
            const before = [...value.slice(0, start)];
            const removed = before.pop().length;
            text.setRangeText("", start - removed, start, "end");
            draw();
        }
    });
    frame.querySelector("[data-clear]").addEventListener("click", () => {
        text.value = "";
        draw();
    });

    const button = document.getElementById(`${id}Image`);
    button.addEventListener("click", () => {
        if (glyphs.textContent.trim() === "") {
            setStatus("Type or tap some glyphs to make an image of", true);
            return;
        }
        const transparent = document.getElementById(`${id}Transparent`).checked;
        createImage(glyphs.offsetWidth, glyphs.offsetHeight, filename, button, glyphs.textContent,
            { ...image, ...(transparent ? { bgcolor: "rgba(0, 0, 0, 0)" } : {}) });
    });

    draw();
}
