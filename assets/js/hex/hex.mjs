import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as toolkit from '../toolkit.mjs';
import * as hex from './hex-fn.mjs';

// Shift Hex
const shiftButton = document.getElementById("shifthexDecode");
shiftButton && shiftButton.addEventListener("click", function() {
    const shiftString = document.getElementById("shifthexText");
    let shiftValue = document.getElementById("shifthexValue");
    let shiftHexDelimiter = document.getElementById("shifthexDelimiter").value;

    if(!emptyContainerCheck(shiftString.value, shiftString)) {
        document.getElementById("text-tab-pane").textContent = "";
        document.getElementById("binary-tab-pane").textContent = "";
        document.getElementById("hex-tab-pane").textContent = "";
        document.getElementById("base64-tab-pane").textContent = "";
        document.getElementById("decimal-tab-pane").textContent = "";
        return false;
    }
    if(!emptyContainerCheck(shiftValue.value, shiftValue, "Please enter a number to shift the hex string by")) {
        return false;
    }
    if (!largeDataWarning(shiftString.value, shiftString)) {
        return false;
    }
    try {
        var shiftedHexString = hex.shiftHexString(shiftString.value, shiftValue.value, shiftHexDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    document.getElementById("text-tab-pane").textContent = toolkit.hexToString(shiftedHexString, shiftHexDelimiter);
    document.getElementById("binary-tab-pane").textContent = toolkit.stringToBinary(toolkit.hexToString(shiftedHexString, shiftHexDelimiter));
    document.getElementById("hex-tab-pane").textContent = shiftedHexString;
    document.getElementById("base64-tab-pane").textContent = toolkit.stringToBase64(toolkit.hexToString(shiftedHexString, shiftHexDelimiter));
    document.getElementById("decimal-tab-pane").textContent =  toolkit.stringToDecimal(toolkit.hexToString(shiftedHexString, shiftHexDelimiter));
});

// Reverse Hex
const reverseHexButton = document.getElementById("reversehexDecode");
reverseHexButton && reverseHexButton.addEventListener("click", function() {
    const reverseHexString = document.getElementById("reversehexText");
    let reverseHexDelimiter = document.getElementById("reversehexDelimiter").value;
    let reverseNibbles = document.getElementById("reverseNibbles");

    if(!emptyContainerCheck(reverseHexString.value, reverseHexString)) {
        return false;
    }
    if (!largeDataWarning(reverseHexString.value, reverseHexString)) {
        return false;
    }

    try {
        if(reverseNibbles.checked) {
            hex.reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
        } else {
            hex.reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
        } 
    } catch (e) {
        showToast("Error", `An error occurred trying to reverse the hex string: ${e.message}`, "danger");
        return;
    }

    let revHexContent;
    if(reverseNibbles.checked) {
        revHexContent = hex.reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
    } else {
        revHexContent = hex.reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
    } 
    document.getElementById("reversehexResults").textContent = revHexContent;
});

// Hex Frequencies
const freqButton = document.getElementById("hexfrequenciesDecode");
freqButton && freqButton.addEventListener("click", function() {
    const freqString = document.getElementById("hexfrequenciesText");
    const freqResults = document.getElementById("hexfrequenciesResults");
    const hexFrequenciesDelimiter = document.getElementById("hexfrequenciesDelimiter").value;

    freqResults.innerHTML = "";

    if (!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    try {
        hex.generateHexFrequencies(freqString.value, hexFrequenciesDelimiter);
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
        const frequencies = hex.generateHexFrequencies(freqString.value, hexFrequenciesDelimiter, delimiterLength);
        if (toolkit.objectSize(frequencies) > 0) {
            freqResults.insertAdjacentHTML(
                "beforeend",
                `${toolkit.styledArrayFrequencies(frequencies, label, minSize)}`
            );
        }
    });
});
