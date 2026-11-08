// /ui-kit/: label each swatch with its computed colour and rate each contrast pair (WCAG 2), and make the component
// demos work as they do on the site, with the site's own modules
import { bindInputList } from "../ui/input-list.js";
import { bindToolFrame, renderResults } from "../ui/tool-frame.js";
import { renderFrequencies, characterCell, characterName } from "../ui/frequencies.js";
import { railFenceEncode, railFenceDecode } from "../lib/ciphers/rail.js";
import { bytesToHex, bytesToBinary, bytesToDecimal, bytesToBase64, graphemes } from "../lib/toolkit.js";

const encoder = new TextEncoder();

/**
 * Puts sample text in a demo frame's input and presses its first button, so it opens showing a result.
 *
 * @param {string} id - The frame's id.
 * @param {string} text - The sample input.
 * @param {string} button - The id of the button to press.
 * @returns {void}
 */
function showSample(id, text, button) {
    document.getElementById(`${id}Text`).value = text;
    document.getElementById(button).click();
}

for (const t of ["light", "dark"]) {
    if (!document.getElementById(`kit${t}RailText`)) {
        break;
    }

    // Input and result, with a field and two actions
    bindToolFrame({
        id: `kit${t}Rail`,
        modes: [
            { button: `kit${t}RailEncrypt`, run: railFenceEncode },
            { button: `kit${t}RailDecrypt`, run: railFenceDecode },
        ],
        key: { id: `kit${t}RailAmount`, flow: ["on", "rails"], required: "A number of rails is required", pattern: /^[0-9]+$/, invalid: "Rails can only be a number" },
        errorPrefix: "Couldn't run the Rail fence cipher",
    });
    showSample(`kit${t}Rail`, "WE ARE DISCOVERED. RUN AT ONCE.", `kit${t}RailEncrypt`);

    // Output tabs
    bindToolFrame({
        id: `kit${t}Bytes`,
        modes: [{
            button: `kit${t}BytesRun`,
            run: (text) => {
                const bytes = encoder.encode(text);
                return { Hex: bytesToHex(bytes, " "), Binary: bytesToBinary(bytes), Decimal: bytesToDecimal(bytes), Base64: bytesToBase64(bytes) };
            },
        }],
        moveTab: "Hex",
        errorPrefix: "Couldn't convert the text",
    });
    showSample(`kit${t}Bytes`, "Hello", `kit${t}BytesRun`);

    // List of results, in groups
    bindToolFrame({
        id: `kit${t}List`,
        modes: [{
            button: `kit${t}ListRun`,
            run: (text) => {
                const bytes = encoder.encode(text);
                return [
                    { name: "Bytes", rows: [{ label: "Hex", value: bytesToHex(bytes, " ") }, { label: "Decimal", value: bytesToDecimal(bytes) }] },
                    { name: "Encoded", note: "as text", rows: [{ label: "Base64", value: bytesToBase64(bytes) }, { label: "Binary", value: bytesToBinary(bytes) }] },
                ];
            },
        }],
        render: (groups, output) => renderResults(output, groups, "4 formats"),
        errorPrefix: "Couldn't list the formats",
    });
    showSample(`kit${t}List`, "Hi", `kit${t}ListRun`);
}

// Figures and tables, as the Character frequencies tool draws them for "Meet me at the old mill"
const sample = "Meet me at the old mill";
const counts = new Map();
graphemes(sample).forEach((char, index) => {
    const row = counts.get(char) ?? { char, count: 0, first: index + 1 };
    row.count++;
    counts.set(char, row);
});
for (const output of document.querySelectorAll("[data-kit-frequencies]")) {
    renderFrequencies(output, {
        stats: [{ label: "Characters", value: String(graphemes(sample).length) }, { label: "Words", value: "6" }, { label: "Letters", value: "18" }],
        tables: [
            {
                id: `${output.id}Characters`,
                name: "Characters",
                columns: [
                    { key: "char", label: "Char", mono: true, text: (row) => characterName(row.char) ?? row.char, html: (row) => characterCell(row.char) },
                    { key: "first", label: "First seen", numeric: true, startDescending: false, text: (row) => row.first.toLocaleString() },
                ],
                rows: [...counts.values()],
            },
            {
                id: `${output.id}Pairs`,
                name: "Letter pairs",
                columns: [{ key: "char", label: "Pair", mono: true, text: (row) => row.char }],
                rows: [{ char: "ee", count: 1 }, { char: "me", count: 1 }, { char: "ll", count: 1 }],
            },
        ],
    });
}

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
