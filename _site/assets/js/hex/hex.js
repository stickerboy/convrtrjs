// Shift Hex
const shiftButton = document.getElementById("shiftDecode");
shiftButton.addEventListener('click', function() {
    const shiftString = document.getElementById("shiftText");
    let shiftValue = document.getElementById("shiftValue");

    if(!emptyContainerCheck(shiftString.value, shiftString)) {
        document.getElementById("text-tab-pane").textContent = "";
        document.getElementById("binary-tab-pane").textContent = "";
        document.getElementById("hex-tab-pane").textContent = "";
        document.getElementById("base64-tab-pane").textContent = "";
        document.getElementById("decimal-tab-pane").textContent = "";
        return false;
    }
    if(!emptyContainerCheck(shiftValue.value, shiftValue)) {
        return false;
    }

    document.getElementById("text-tab-pane").textContent = decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value));
    document.getElementById("binary-tab-pane").textContent = stringToBinary(decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value)));
    document.getElementById("hex-tab-pane").textContent = stringToHex(decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value)));
    document.getElementById("base64-tab-pane").textContent = stringToBase64(decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value)));
    document.getElementById("decimal-tab-pane").textContent =  shiftHexString(shiftString.value.trim(), shiftValue.value);
});

// Reverse Hex
const reverseHexButton = document.getElementById("reverseHexDecode");
reverseHexButton.addEventListener('click', function() {
    const reverseHexString = document.getElementById("reverseHexText");

    if(!emptyContainerCheck(reverseHexString.value, reverseHexString)) {
        return false;
    }

    document.getElementById("reverseHexResults").textContent = reverseHex(reverseHexString.value);
});