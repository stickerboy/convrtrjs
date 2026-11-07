import { bindToolFrame, escapeHtml } from '../../ui/tool-frame.js';
import { handleDownload } from '../../ui/image.js';
import * as colors from '../../lib/misc/colors.js';

const padding = document.getElementById("colorsPadding");

/**
 * Says how many colors there are.
 *
 * @param {number} count - The number of colors.
 * @returns {string} "1 color" or "334 colors".
 */
const plural = (count) => `${count.toLocaleString()} color${count === 1 ? "" : "s"}`;

/**
 * Draws the colors as a grid of blocks, as near square as they fill, in reading order: on the page, and saved as an
 * image. With at most 10,000 colors (the tool's limit), the grid is at most 100 blocks across.
 *
 * @param {string[]} hexes - Each color, as 6 hex digits.
 * @param {number} size - Each block's size, in pixels.
 * @returns {HTMLCanvasElement} The grid.
 */
function gridCanvas(hexes, size) {
    const across = Math.ceil(Math.sqrt(hexes.length));
    const canvas = document.createElement("canvas");
    canvas.width = across * size;
    canvas.height = Math.ceil(hexes.length / across) * size;
    const ctx = canvas.getContext("2d");
    hexes.forEach((hex, i) => {
        ctx.fillStyle = `#${hex}`;
        ctx.fillRect((i % across) * size, Math.floor(i / across) * size, size, size);
    });
    return canvas;
}

/**
 * The grid shown on the page: a pixel for each color, scaled up with sharp edges, so it's quick to draw however many
 * colors there are. A few colors are shown as blocks no bigger than 3rem each, rather than filling the width.
 *
 * @param {string[]} hexes - Each color, as 6 hex digits.
 * @returns {HTMLCanvasElement} The grid, hidden from screen readers, as the list below gives each color.
 */
function drawGrid(hexes) {
    const canvas = gridCanvas(hexes, 1);
    canvas.className = "color-grid";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.maxWidth = `${canvas.width * 3}rem`;
    return canvas;
}

/**
 * Downloads the grid as an image, a 64px block for each color.
 *
 * @param {string[]} hexes - Each color, as 6 hex digits.
 * @returns {void}
 */
function saveImage(hexes) {
    handleDownload(gridCanvas(hexes, 64).toDataURL(), "colors.png", true);
}

/**
 * The bar above the colors: how many there are, and Save as image.
 *
 * @param {string} label - What to say, e.g. "334 colors".
 * @returns {string} The bar's HTML.
 */
const bar = (label) => `<div class="color-results__bar"><span class="color-results__count">${label}</span>` +
    `<button type="button" class="btn btn-light btn-icon-text" data-save-image><i class="bi bi-image" aria-hidden="true"></i>Save as image</button></div>`;

/**
 * Shows each color with its hex and the characters it holds, under the grid; copying gives the hex, one per line.
 *
 * @param {{hex: string, text: string, padded: boolean}[]} list - The colors, as textToColours gives them.
 * @param {HTMLElement} output - Where to show them.
 * @returns {void}
 */
function renderColors(list, output) {
    const hexes = list.map((c) => c.hex);
    output.innerHTML = bar(plural(list.length)) +
        `<ul class="color-swatches">${list.map((c) => `<li class="color-swatch${c.padded ? " color-swatch--padded" : ""}">` +
            `<span class="color-swatch__chip" style="background-color: #${c.hex}"></span>` +
            `<code class="color-swatch__hex">#${c.hex}${c.padded ? `<span aria-hidden="true"> *</span><span class="visually-hidden"> (padded)</span>` : ""}</code>` +
            `<span class="color-swatch__text">${escapeHtml(c.text.replace(/ /g, "␠").replace(/\n/g, "↵"))}</span></li>`).join("")}</ul>` +
        (list.some((c) => c.padded) ? `<p class="color-results__note">* Padded with ${padding.value}</p>` : "");
    output.querySelector(".color-results__bar").after(drawGrid(hexes));
    output.dataset.copy = hexes.map((hex) => `#${hex}`).join("\n");
    output.querySelector("[data-save-image]").addEventListener("click", () => saveImage(hexes));
}

/**
 * Shows the text read from colors, under the grid of them; copying gives the text.
 *
 * @param {{text: string, colours: string[]}} decoded - What coloursToText gives.
 * @param {HTMLElement} output - Where to show it.
 * @returns {void}
 */
function renderText({ text, colours: hexes }, output) {
    output.innerHTML = bar(`Text from ${plural(hexes.length)}`) + `<p class="color-results__text">${escapeHtml(text)}</p>`;
    output.querySelector(".color-results__bar").after(drawGrid(hexes));
    output.dataset.copy = text;
    output.querySelector("[data-save-image]").addEventListener("click", () => saveImage(hexes));
}

bindToolFrame({
    id: "colors",
    modes: [
        { button: "colorsEncode", run: (text) => ({ list: colors.textToColours(text, padding.value) }) },
        { button: "colorsDecode", run: (text) => ({ decoded: colors.coloursToText(text) }) },
    ],
    watch: ["colorsPadding"],
    render: (result, output) => (result.list ? renderColors(result.list, output) : renderText(result.decoded, output)),
    errorPrefix: "Couldn't read the colors",
    // Past this, the colors are too many to look through, or to save as one image
    limit: 10000,
});

// Padding only applies to making colors. It's turned off rather than hidden, so the buttons under it don't move as
// they're pressed.
document.getElementById("colorsEncode").addEventListener("click", () => (padding.disabled = false));
document.getElementById("colorsDecode").addEventListener("click", () => (padding.disabled = true));
