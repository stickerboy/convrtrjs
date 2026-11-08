// /ui-kit/: label each swatch with its computed colour and rate each contrast pair (WCAG 2)
import { bindInputList } from "../ui/input-list.js";

const parse = (css) => {
    const [r, g, b, a = 1] = css.match(/[\d.]+/g).map(Number);
    return { r, g, b, a };
};

// Blend a translucent colour over an opaque one
const flatten = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
});

const toHex = ({ r, g, b, a }) => {
    const hex = "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    return a < 1 ? `${hex} / ${Math.round(a * 100)}%` : hex;
};

const luminance = ({ r, g, b }) => {
    const [R, G, B] = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
};

for (const chip of document.querySelectorAll("[data-swatch]")) {
    chip.parentElement.querySelector(".ui-kit-swatch__value").textContent = toHex(parse(getComputedStyle(chip).backgroundColor));
}

for (const row of document.querySelectorAll(".ui-kit-contrast [data-fg]")) {
    const sample = row.querySelector(".ui-kit-contrast__sample");
    const surface = parse(getComputedStyle(row.closest(".ui-kit-pane")).backgroundColor);
    const bg = flatten(parse(getComputedStyle(sample).backgroundColor), surface);
    const fg = flatten(parse(getComputedStyle(sample).color), bg);
    const ratio = contrast(fg, bg);
    const [label, cls] = ratio >= 4.5 ? ["AA", "text-bg-success"] : ratio >= 3 ? ["Large/UI", "text-bg-warning"] : ["Fail", "text-bg-danger"];
    row.querySelector(".ui-kit-contrast__ratio").innerHTML = `${ratio.toFixed(2)}:1 <span class="badge ${cls} ms-1">${label}</span>`;
}

// The input box demos work as they do in a tool: Swap, and adding and removing boxes
for (const list of document.querySelectorAll("[data-input-list]")) {
    bindInputList(list, { status: list.parentElement.querySelector("[role=status]") });
}
