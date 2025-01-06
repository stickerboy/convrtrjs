import { emptyContainerCheck, largeDataWarning, showToast }  from '../scripts.mjs';
import { getKeyValue, createImage, stringToHex } from '../toolkit.mjs';
import * as misc from './misc-fn.mjs';

// Periodic element conversion
const elementsChange = document.getElementById("elementsChange");
elementsChange && elementsChange.addEventListener("click", function () {
    let elementsString = document.getElementById("elementsTextarea");

    if (!emptyContainerCheck(elementsString.value, elementsString)) {
        return false;
    }
    if (!largeDataWarning(elementsString.value, elementsString)) {
        return false;
    }

    let elementPropFrom = document.getElementById("elementPropFrom");
    let elementPropTo = document.getElementById("elementPropTo");
    let removeDelimiters = document.getElementById("removeDelimiters");

    try {
        misc.convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value);
    } catch (e) {
        showToast("Error", `An error occurred trying to map elements: ${e.message}`, "danger");
        return;
    }

    document.getElementById("elementResults").textContent = misc.convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value, removeDelimiters.checked);
});

// Braille
let bR = document.getElementById("brailleResults");
let bIR = document.getElementById("brailleImageResults");
let bIT = document.getElementById("brImageTransparency");
let brailleImage = document.getElementById("generateBrailleImage");
let brailleSwitch = document.getElementById("brailleSwitch");

const brailleButton = document.getElementById("brailleConvert");
brailleButton && brailleButton.addEventListener("click", function () {
    const brailleString = document.getElementById("brailleTextarea");

    if (!emptyContainerCheck(brailleString.value, brailleString)) {
        bR.textContent = "";
        return false;
    }
    if (!largeDataWarning(brailleString.value, brailleString)) {
        return false;
    }

    if (brailleSwitch.checked) {
        bR.textContent = misc.convertBraille(brailleString.value, "braille");
    } else {
        bIR.textContent = misc.convertBraille(brailleString.value, "text");
    }
});

brailleSwitch && brailleSwitch.addEventListener("click", function () {
    if (brailleSwitch.checked) {
        this.nextElementSibling.innerText = "Convert Braille to Text";
    } else {
        this.nextElementSibling.innerText = "Convert Text to Braille";
    }
});

brailleImage && brailleImage.addEventListener("click", function () {
    if (!emptyContainerCheck(bIR.innerHTML, bIR, "There are no symbols present, please add at least one symbol to generate an image")) {
        return false;
    }
    let bOptions = {};
    bOptions.font = `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    bOptions.paddingTop = 0;
    bOptions.fontAdjust = true;
    if (bIT.checked) {
        bOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(bIR.offsetWidth, bIR.offsetHeight, "braille.png", brailleImage, bIR.innerText, bOptions);
});

// Periodic elements
const elementInfo = document.getElementById("elementstableResults");
document.querySelectorAll(".p-element").forEach(item => {
    item.addEventListener("click", event => {
        const elementNumber = parseInt(event.currentTarget.getAttribute("data-element"), 10);
        const element = ELEMENTS.find(el => el.number === elementNumber);
        document.querySelectorAll(".p-element").forEach(button => button.classList.remove("active"));
        event.currentTarget.classList.add("active");

        if (element) {
            const rows = [
                { label: "Atomic number", value: element.number },
                { label: "Atomic symbol", value: element.symbol },
                { label: "Category", value: element.category },
                { label: "Phase", value: element.phase },
                { label: "Group", value: element.group },
                { label: "Period", value: element.period },
                { label: "Block", value: element.block },
                { label: "Density", value: element.density },
                { label: "Boiling point", value: element.boil ? `${element.boil} K` : "Currently unavailable" },
                { label: "Melting point", value:element.melt ? `${element.melt} K` : "Currently unavailable" },
                { label: "Electron configuration", value: element.electron_configuration },
                { label: "Electron configuration (semantic)", value: element.electron_configuration_semantic },
                { label: "Further information", value: element.source ? `<a href="${element.source}" title="${element.name} wikipedia page" class="text-convrtr-link">${element.source}</a>` : null },
                { label: "Appearance", value: element.appearance ? element.appearance : "Not available" },
                { label: "Discovered by", value: element.discovered_by },
                { label: "Named by", value: element.named_by }
            ];

            let content = "";
            for (let i = 0; i < rows.length; i += 2) {
                const row1 = rows[i];
                const row2 = rows[i + 1];

                content += `
                        <div class="col fw-bold p-2">${row1.label}</div>
                        <div class="col p-2">${row1.value}</div>`;

                if (row2 && row2.value !== null && row2.value !== undefined) {
                    content += `
                        <div class="col fw-bold p-2">${row2.label}</div>
                        <div class="col p-2">${row2.value}</div>`;
                } else {
                    content += `
                        <div class="col fw-bold p-2"></div>
                        <div class="col p-2"></div>`;
                }
            }

            const elementContent = `
                <div class="elements-table">
                    <div class="row g-0 border-1 border-bottom border-dark-subtle">
                        <div class="col p-2 convrtr-table-header">
                            <p class="fs-3 mb-0 text-black">${element.name}</p>
                        </div>
                    </div>
                    <div class="row g-0">
                        <div class="col p-2" style="background-color: inherit;">
                            <p>${element.summary}</p>
                        </div>
                    </div>
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-0">
                    ${content}
                    </div>
                </div>`;

            elementInfo.innerHTML = elementContent;

            // Scroll to the relevant parts of the page
            event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" });
            elementInfo.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    });
});

const elementstableFilter = document.getElementById("elementstableFilter");
if (elementstableFilter) {
    elementstableFilter.addEventListener("change", function () {
        const filter = this.value;
        const buttons = document.querySelectorAll(".p-element");

        buttons.forEach(button => {
            // Reset all buttons to be visible
            button.classList.remove("d-none");
            button.classList.add("d-block");

            const phase = button.getAttribute("data-phase");
            const group = button.getAttribute("data-group");
            const period = button.getAttribute("data-period");
            const block = button.getAttribute("data-block");

            if (filter === "all") {
                // Show all elements
                button.classList.remove("d-none");
                button.classList.add("d-block");
            } else if (filter.startsWith("phase-") && phase !== filter.split("-")[1]) {
                // Filter by phase
                button.classList.remove("d-block");
                button.classList.add("d-none");
            } else if (filter.startsWith("group-") && group !== filter.split("-")[1]) {
                // Filter by group
                button.classList.remove("d-block");
                button.classList.add("d-none");
            } else if (filter.startsWith("period-") && period !== filter.split("-")[1]) {
                // Filter by period
                button.classList.remove("d-block");
                button.classList.add("d-none");
            } else if (filter.startsWith("block-") && block !== filter.split("-")[1]) {
                // Filter by block
                button.classList.remove("d-block");
                button.classList.add("d-none");
            }
        });
    });
}


// Color generator
const colorgeneratorButton = document.getElementById("colorgeneratorDecode");
colorgeneratorButton.addEventListener("click", function () {
    const colorgeneratorString = document.getElementById("colorgeneratorText");

    if (!emptyContainerCheck(colorgeneratorString.value, colorgeneratorString)) {
        document.getElementById("colorgeneratorResults").textContent = "";
        return false;
    }
    if (!largeDataWarning(colorgeneratorString.value, colorgeneratorString)) {
        return false;
    }

    let colorgeneratorPadding = document.getElementById("colorgeneratorPadding");
    document.getElementById("colorgeneratorResults").innerHTML = misc.hexToChunks(stringToHex(colorgeneratorString.value, ""), 6, colorgeneratorPadding.value);
});


// Forerunner glyphs
const forerunnerButtons = document.getElementsByClassName("fr-glyph");
let fR = document.getElementById("forerunnerResults");
let fIR = document.getElementById("forerunnerImageResults");
let fIT = document.getElementById("frImageTransparency");
if (forerunnerButtons.length > 0) {
    Array.from(forerunnerButtons, c => c.addEventListener("click", function () {
        Array.from(forerunnerButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        fR.textContent += getKeyValue(c.innerHTML, misc.fralphabet);
        fIR.textContent += c.innerHTML;
    }));
}

const forerunnerImage = document.getElementById("generateForerunnerImage");
forerunnerImage && forerunnerImage.addEventListener("click", function () {
    if (!emptyContainerCheck(fIR.innerHTML, fIR, "There are no glyphs present, please select at least one glyph to generate an image")) {
        return false;
    }
    let fOptions = {};
    if (fIT.checked) {
        fOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(fIR.offsetWidth, fIR.offsetHeight, "forerunner-glyphs.png", forerunnerImage, fIR.innerText, fOptions);
});

// Covenant glyphs
const covenantButtons = document.getElementsByClassName("cov-glyph");
let cR = document.getElementById("covenantResults");
let cIR = document.getElementById("covenantImageResults");
let cIT = document.getElementById("covImageTransparency");
if (covenantButtons.length > 0) {
    Array.from(covenantButtons, c => c.addEventListener("click", function () {
        Array.from(covenantButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        cR.textContent += c.textContent;
        cIR.textContent += c.innerHTML;
    }));
}

const covenantImage = document.getElementById("generateCovenantImage");
covenantImage && covenantImage.addEventListener("click", function () {
    if (!emptyContainerCheck(cIR.innerHTML, cIR, "There are no glyphs present, please select at lease one glyph to generate an image")) {
        return false;
    }
    let cOptions = {};
    cOptions.font = "6rem 'Covenant'";
    cOptions.paddingTop = 108;
    if (cIT.checked) {
        cOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(cIR.offsetWidth, cIR.offsetHeight, "covenant-glyphs.png", covenantImage, cIR.innerText, cOptions);
});