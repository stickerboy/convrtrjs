import { bindToolFrame, escapeHtml } from '../../ui/tool-frame.js';
import { handleDownload } from '../../ui/image.js';
import * as colors from '../../lib/misc/colors.js';

const padding = document.getElementById("colorsPadding");
const plural = (count) => `${count.toLocaleString()} color${count === 1 ? "" : "s"}`;

// The colors as a picture: a 64px block each, 16 to a row
function saveImage(hexes) {
    const size = 64;
    const across = Math.min(hexes.length, 16);
    const canvas = document.createElement("canvas");
    canvas.width = across * size;
    canvas.height = Math.ceil(hexes.length / across) * size;
    const ctx = canvas.getContext("2d");
    hexes.forEach((hex, i) => {
        ctx.fillStyle = `#${hex}`;
        ctx.fillRect((i % across) * size, Math.floor(i / across) * size, size, size);
    });
    handleDownload(canvas.toDataURL(), "colors.png", true);
}

const strip = (hexes) => `<div class="color-strip" aria-hidden="true">${hexes.map((hex) => `<span style="background-color: #${hex}"></span>`).join("")}</div>`;
const bar = (label) => `<div class="color-results__bar"><span class="color-results__count">${label}</span>` +
    `<button type="button" class="btn btn-light btn-icon-text" data-save-image><i class="bi bi-image" aria-hidden="true"></i>Save as image</button></div>`;

// Each color with its hex and the characters it holds; copying gives the hex, one per line
function renderColors(list, output) {
    output.innerHTML = bar(plural(list.length)) + strip(list.map((c) => c.hex)) +
        `<ul class="color-swatches">${list.map((c) => `<li class="color-swatch${c.padded ? " color-swatch--padded" : ""}">` +
            `<span class="color-swatch__chip" style="background-color: #${c.hex}"></span>` +
            `<code class="color-swatch__hex">#${c.hex}${c.padded ? `<span aria-hidden="true"> *</span><span class="visually-hidden"> (padded)</span>` : ""}</code>` +
            `<span class="color-swatch__text">${escapeHtml(c.text.replace(/ /g, "␠").replace(/\n/g, "↵"))}</span></li>`).join("")}</ul>` +
        (list.some((c) => c.padded) ? `<p class="color-results__note">* Padded with ${padding.value}</p>` : "");
    output.dataset.copy = list.map((c) => `#${c.hex}`).join("\n");
    output.querySelector("[data-save-image]").addEventListener("click", () => saveImage(list.map((c) => c.hex)));
}

function renderText({ text, colours: hexes }, output) {
    output.innerHTML = bar(`Text from ${plural(hexes.length)}`) + strip(hexes) + `<p class="color-results__text">${escapeHtml(text)}</p>`;
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
});

// Padding only applies to making colors. It's turned off rather than hidden, so the buttons under it don't move as
// they're pressed.
document.getElementById("colorsEncode").addEventListener("click", () => (padding.disabled = false));
document.getElementById("colorsDecode").addEventListener("click", () => (padding.disabled = true));
