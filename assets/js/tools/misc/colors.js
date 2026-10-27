import { emptyContainerCheck, largeDataWarning } from '../../ui/input.js';
import { stringToHex } from '../../lib/toolkit.js';
import * as colors from '../../lib/misc/colors.js';

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
