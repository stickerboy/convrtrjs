// Canvas images for the glyph tools (Braille, Covenant, Forerunner, Pigpen) and Colors

import { graphemes } from "../lib/toolkit.js";

// Browsers give an empty image for a canvas bigger than these: Firefox and Chrome stop at 32,767px a side, and Safari
// at 16,777,216px in all. Half the side keeps well clear.
const MAX_SIDE = 16384;
const MAX_AREA = 16777216;
// Space around the text, and between lines, in pixels at the font's size
const PADDING = 24;
const LINE_GAP = 16;

/**
 * Splits text into the lines it's drawn as: at its own new lines, then wrapped at spaces to fit a width. A word too
 * wide for a line on its own is broken between characters.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas, with its font set, to measure the text.
 * @param {string} text - The text.
 * @param {number} maxWidth - The widest a line can be, in pixels.
 * @returns {string[]} The lines.
 */
function wrapLines(ctx, text, maxWidth) {
    const widths = new Map();
    /**
     * Measures a piece of text, once for each different piece.
     *
     * @param {string} piece - The text to measure.
     * @returns {number} Its width, in pixels.
     */
    const width = (piece) => {
        let w = widths.get(piece);
        if (w === undefined) {
            w = ctx.measureText(piece).width;
            widths.set(piece, w);
        }
        return w;
    };
    const lines = [];
    for (const paragraph of text.split(/\r?\n/)) {
        let line = "";
        let lineWidth = 0;
        for (const piece of paragraph.split(/(\s+)/).filter(Boolean)) {
            const w = width(piece);
            if (lineWidth + w <= maxWidth) {
                line += piece;
                lineWidth += w;
                continue;
            }
            // A line breaks at spaces, which are dropped there
            if (line !== "") {
                lines.push(line.trimEnd());
                line = "";
                lineWidth = 0;
            }
            if (/^\s+$/.test(piece)) {
                continue;
            }
            if (w <= maxWidth) {
                line = piece;
                lineWidth = w;
                continue;
            }
            // A word wider than a whole line is broken between characters
            for (const char of graphemes(piece)) {
                const charWidth = width(char);
                if (lineWidth + charWidth > maxWidth && line !== "") {
                    lines.push(line);
                    line = "";
                    lineWidth = 0;
                }
                line += char;
                lineWidth += charWidth;
            }
        }
        lines.push(line.trimEnd());
    }
    return lines;
}

/**
 * Draws text as an image and downloads it, sized to fit the text: lines break where the text's new lines are, and wrap
 * at spaces to about the width it's shown at on the page. Long text is drawn wider, so the image doesn't become a thin
 * strip, and the whole image is scaled down if it would be bigger than browsers can make.
 *
 * @param {string} text - The text, or glyphs, to draw.
 * @param {object} options
 * @param {string} options.filename - What the image downloads as, e.g. "pigpen-glyphs.png".
 * @param {number} options.width - How wide the text is shown on the page, in pixels; the image is about 1.5 times as
 *   wide, as its font is bigger.
 * @param {string} [options.font="6rem system-ui"] - The font, as CSS gives it, e.g. "6rem 'Pigpen Cipher'".
 * @param {string} [options.bgcolor="white"] - The background colour.
 * @param {string} [options.textcolor="black"] - The text colour.
 * @returns {void}
 */
export function createImage(text, { filename, width, font = "6rem system-ui", bgcolor = "white", textcolor = "black" }) {
    const canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;

    // Lines as wide as the text shown on the page, or as its widest word, then wider for long text, about as wide as
    // it's tall
    const paragraphs = text.split(/\r?\n/);
    const widest = Math.max(...paragraphs.map((p) => ctx.measureText(p).width));
    const sample = ctx.measureText(text.replace(/\s+/g, "") || "M");
    const lineHeight = sample.actualBoundingBoxAscent + sample.actualBoundingBoxDescent + LINE_GAP;
    let maxWidth = Math.min(widest, Math.max(width * 1.5, 320));
    const totalWidth = paragraphs.reduce((sum, p) => sum + ctx.measureText(p).width, 0);
    maxWidth = Math.min(widest, Math.max(maxWidth, Math.sqrt(totalWidth * lineHeight)));
    const lines = wrapLines(ctx, text, Math.max(maxWidth, 1));

    const contentWidth = Math.max(...lines.map((line) => ctx.measureText(line).width), 1);
    const fullWidth = Math.ceil(contentWidth + PADDING * 2);
    const fullHeight = Math.ceil(lines.length * lineHeight - LINE_GAP + PADDING * 2);
    const scale = Math.min(1, MAX_SIDE / fullWidth, MAX_SIDE / fullHeight, Math.sqrt(MAX_AREA / (fullWidth * fullHeight)));
    canvas.width = Math.max(1, Math.floor(fullWidth * scale));
    canvas.height = Math.max(1, Math.floor(fullHeight * scale));

    // Sizing the canvas resets it
    ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, fullWidth, fullHeight);
    ctx.font = font;
    ctx.fillStyle = textcolor;
    lines.forEach((line, i) => {
        ctx.fillText(line, PADDING, PADDING + sample.actualBoundingBoxAscent + i * lineHeight);
    });
    handleDownload(canvas.toDataURL(), filename, true);
}

/**
 * Handles the download of the image or returns an image element.
 * @param {string} url - The data URL of the image.
 * @param {string} filename - The suggested filename for downloading the image.
 * @param {boolean} download - Whether to download the image or return it for injection.
 * @returns {HTMLImageElement|null} - The generated image element if download is false, otherwise null.
 */
export function handleDownload(url, filename, download) {
    if (download) {
        const tempAnchor = document.createElement("a");
        tempAnchor.download = filename;
        tempAnchor.href = url;
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        document.body.removeChild(tempAnchor);
        return null;
    } else {
        const img = new Image();
        img.src = url;
        return img;
    }
}
