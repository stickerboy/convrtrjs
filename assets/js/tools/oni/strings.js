import { emptyContainerCheck, largeDataWarning } from '../../ui/input.js';
import * as strings from '../../lib/oni/strings.js';

Object.entries(strings).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

// Extract strings
const stringsDecodeButton = document.getElementById("stringsDecode");
if(stringsDecodeButton) {
    stringsDecodeButton.addEventListener("click", function () {
        const stringsString = document.getElementById("stringsText");
        // const stringsKey = document.getElementById("stringsKey");

        if (!emptyContainerCheck(stringsString.value, stringsString)) {
            return false;
        }
        if (!largeDataWarning(stringsString.value, stringsString)) {
            return false;
        }

        document.getElementById("stringsResults").textContent = oni.strings(stringsString.value);
    });
}