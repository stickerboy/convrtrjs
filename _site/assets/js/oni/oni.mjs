import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as oni from './oni-fn.mjs';

Object.keys(oni).forEach(functionName => {
    window[functionName] = oni[functionName];
});

// Extract strings
const stringsDecodeButton = document.getElementById("stringsDecode");
if(stringsDecodeButton) {
    stringsDecodeButton.addEventListener("click", function () {
        const stringsString = document.getElementById("stringsText");
        const stringsKey = document.getElementById("stringsKey");

        if (!emptyContainerCheck(stringsString.value, stringsString)) {
            return false;
        }
        if (!largeDataWarning(stringsString.value, stringsString)) {
            return false;
        }

        document.getElementById("stringsResults").textContent = oni.strings(stringsString.value);
    });
}