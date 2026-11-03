import ELEMENTS from '../../data/elements.json' with { type: 'json' };
import { categoryKey } from '../../lib/misc/elements.js';
import { escapeHtml } from '../../ui/tool-frame.js';

const search = document.getElementById("elementstableSearch");
const highlight = document.getElementById("elementstableHighlight");
const count = document.getElementById("elementstableCount");
const details = document.getElementById("elementstableResults");
const buttons = [...document.querySelectorAll(".periodic-element")];
const legend = [...document.querySelectorAll(".periodic-legend__item")];
let category = "";

const known = (value, unit = "") => (value === null || value === undefined || value === "" ? "Not known" : `${value}${unit}`);

// The chosen element's details, and the same as text for select, copy and download
function show(number) {
    const element = ELEMENTS.find((el) => el.number === number);
    for (const button of buttons) {
        button.setAttribute("aria-pressed", String(Number(button.dataset.number) === number));
    }
    const rows = [
        ["Category", element.category], ["Phase", element.phase], ["Group", element.group], ["Period", element.period],
        ["Block", element.block], ["Atomic mass", element.atomic_mass], ["Density", known(element.density, " g/cm³")],
        ["Melting point", known(element.melt, " K")], ["Boiling point", known(element.boil, " K")],
        ["Electron configuration", element.electron_configuration_semantic], ["Appearance", known(element.appearance)],
        ["Discovered by", known(element.discovered_by)], ["Named by", known(element.named_by)],
    ];
    const key = categoryKey(element.category);
    details.innerHTML = `<section class="periodic-details periodic--${key}">` +
        `<div class="periodic-details__tile" aria-hidden="true"><span>${element.number}</span><b>${escapeHtml(element.symbol)}</b><span>${escapeHtml(String(element.atomic_mass).slice(0, 7))}</span></div>` +
        `<div class="periodic-details__body"><h3 class="periodic-details__name">${escapeHtml(element.name)}</h3>` +
        (element.summary ? `<p>${escapeHtml(element.summary)}</p>` : "") +
        `<dl class="periodic-details__facts">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(String(value ?? "Not known"))}</dd></div>`).join("")}</dl>` +
        (element.source ? `<p class="periodic-details__more"><a href="${escapeHtml(element.source)}" class="text-convrtr">${escapeHtml(element.name)} on Wikipedia</a></p>` : "") +
        `</div></section>`;
    details.dataset.copy = [`${element.name} (${element.symbol}), atomic number ${element.number}`, ...rows.map(([label, value]) => `${label}: ${value ?? "Not known"}`),
        element.summary ?? "", element.source ?? ""].filter(Boolean).join("\n");
}

// Search, the Highlight dropdown and the legend narrow down together; elements that don't match are dimmed, not
// hidden, so the table keeps its shape. An exact name, symbol or number is chosen as well.
function filter() {
    const query = search.value.trim().toLowerCase();
    const [property, value] = highlight.value.split(":");
    let shown = 0;
    for (const button of buttons) {
        const { name, symbol, number } = button.dataset;
        const match = (!query || name.includes(query) || symbol === query || number === query)
            && (!property || button.dataset[property] === value)
            && (!category || button.dataset.category === category);
        button.classList.toggle("periodic-element--dim", !match);
        shown += match;
    }
    const filtering = query || property || category;
    count.textContent = filtering ? `${shown} of ${buttons.length} elements` : `${buttons.length} elements`;
    const exact = query && buttons.find(({ dataset }) => dataset.name === query || dataset.symbol === query || dataset.number === query);
    if (exact) {
        show(Number(exact.dataset.number));
    }
}

for (const button of buttons) {
    button.addEventListener("click", () => {
        show(Number(button.dataset.number));
        details.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}
for (const item of legend) {
    item.addEventListener("click", () => {
        category = category === item.dataset.category ? "" : item.dataset.category;
        for (const other of legend) {
            other.setAttribute("aria-pressed", String(other.dataset.category === category));
        }
        filter();
    });
}
search.addEventListener("input", filter);
highlight.addEventListener("change", filter);

// Start with something to look at
show(1);
