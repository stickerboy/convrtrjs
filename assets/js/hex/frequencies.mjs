import * as toolkit from "../toolkit.mjs";
import { emptyContainerCheck, largeDataWarning, showToast } from "../scripts.mjs";
import * as frequencies from "./frequencies-fn.mjs"

const freqButton = document.getElementById("frequenciesDecode");
freqButton && freqButton.addEventListener("click", function() {
    const freqString = document.getElementById("frequenciesText");
    const freqResults = document.getElementById("frequenciesResults");
    const hexFrequenciesDelimiter = document.getElementById("frequenciesDelimiter").value;

    freqResults.innerHTML = "";

    if (!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    try {
        frequencies.generateHexFrequencies(freqString.value, hexFrequenciesDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to generate frequencies: ${e.message}`, "danger");
        return;
    }

    // Stats to display
    const stats = [
        { label: "Character count", value: freqString.value.replaceAll(hexFrequenciesDelimiter, "").length }
    ];

    // Insert each stat result
    stats.forEach(({ label, value }) => {
        freqResults.insertAdjacentHTML(
            "beforeend",
            `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3">
                <span class="display-6 fs-5">${label}</span>&nbsp;<br />
                <code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                    ${value}
                </code>&nbsp;<br />
            </div>`
        );
    });

    // Insert hex frequency results
    const hexFrequencies = [
        { delimiterLength: 2, label: "Hex frequencies" , minSize: 6 },
        { delimiterLength: 4, label: "Hex frequencies [double]", minSize: 8 },
        { delimiterLength: 6, label: "Hex frequencies [triple]", minSize: 9 },
        { delimiterLength: 7, label: "Hex frequencies [quad]", minSize: 10 },
        { delimiterLength: 10, label: "Hex frequencies [quint]", minSize: 12 }
    ];

    hexFrequencies.forEach(({ delimiterLength, label, minSize = 0 }) => {
        const freqs = frequencies.generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, delimiterLength);
        if (toolkit.objectSize(frequencies) > 0) {
            freqResults.insertAdjacentHTML(
                "beforeend",
                `${toolkit.styledArrayFrequencies(freqs, label, minSize)}`
            );
        }
    });
});
