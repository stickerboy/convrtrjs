import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';
import { stringToHex } from '../toolkit.mjs';
import * as colors from './colors-fn.mjs';

Object.entries(colors).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const colorgeneratorButton = document.getElementById("colorsDecode");
colorgeneratorButton.addEventListener("click", function () {
    const colorgeneratorString = document.getElementById("colorsText");

    if (!emptyContainerCheck(colorgeneratorString.value, colorgeneratorString)) {
        document.getElementById("colorsResults").textContent = "";
        return false;
    }
    if (!largeDataWarning(colorgeneratorString.value, colorgeneratorString)) {
        return false;
    }

    let colorgeneratorPadding = document.getElementById("colorsPadding");
    document.getElementById("colorsResults").innerHTML = colors.hexToChunks(stringToHex(colorgeneratorString.value, ""), 6, colorgeneratorPadding.value);
});
