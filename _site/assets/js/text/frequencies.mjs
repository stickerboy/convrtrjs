import * as toolkit from '../toolkit.mjs';
import * as frequencies from './frequencies-fn.mjs';
import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';

Object.entries(frequencies).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const freqButton = document.getElementById("frequenciesDecode");
freqButton.addEventListener("click", function() {
    const freqString = document.getElementById("frequenciesText");
    const freqResults = document.getElementById("frequenciesResults");
    freqResults.innerHTML = "";

    if (!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    // Stats to display
    const stats = [
        { label: "Word count", stat: "word-count" },
        { label: "Character count", stat: "char-count" },
        { label: "Character count (no spaces)", stat: "char-count-ns" },
        { label: "Letter count", stat: "letter-count" },
        { label: "Letter count (only capitals)", stat: "letter-count-caps" },
        { label: "Letter count (only lowercase)", stat: "letter-count-low" },
        { label: "Number count", stat: "number-count" },
        { label: "Special character count", stat: "special-count" },
        { label: "Special character count (no spaces)", stat: "special-count-ns" }
    ];

    // Insert each stat result
    stats.forEach(({ label, stat }) => {
        freqResults.insertAdjacentHTML(
            "beforeend",
            `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3">
                <span class="display-6 fs-5">${label}</span>&nbsp;<br />
                <code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                    ${frequencies.stringStats(freqString.value, stat)}
                </code>&nbsp;<br />
            </div>`
        );
    });

    freqResults.insertAdjacentHTML(
        "beforeend",
        `${toolkit.styledUniqueArrayItems(toolkit.uniqueArray(freqString.value))}`
    );
    freqResults.insertAdjacentHTML(
        "beforeend",
        `${toolkit.styledArrayFrequencies(toolkit.countArrayFreq(freqString.value), "Unique character frequencies")}`
    );
});