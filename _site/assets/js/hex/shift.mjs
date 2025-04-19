import * as toolkit from '../toolkit.mjs';
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as shift from './shift-fn.mjs';

const shiftButton = document.getElementById("shiftDecode");
shiftButton && shiftButton.addEventListener("click", function() {
    const shiftString = document.getElementById("shiftText");
    let shiftValue = document.getElementById("shiftValue");
    let shiftHexDelimiter = document.getElementById("shiftDelimiter").value;

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
        var shiftedHexString = shift.shiftHexString(shiftString.value, shiftValue.value, shiftHexDelimiter);
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