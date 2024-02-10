// Shift Hex left or right
// Returns: Decimal, space delimited
function shiftHexString(string, shiftValue, delimiter) {
    if(isValidHex(string, delimiter)) {
        return hexToString(string, delimiter).split("").map(c => (ord(c) + parseInt(shiftValue)).toString(16)).join(delimiter);
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

// Reverse Hex
// Swaps the order of each hex nibble: 74 65 73 74 [test] becomes 47 56 37 47
function reverseHex(string, delimiter) {
    let reversedString;
    if(isValidHex(string, delimiter)) {
        if(delimiter === "") {
            reversedString = stringToArray(string, 2).map((c) => reverseString(c)).join(delimiter);
        } else {
            reversedString = string.split(delimiter).map((c) => reverseString(c)).join(delimiter);
        }
        return reversedString;
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

// Reverse Hex nibbles
// Reverses the position of each Hex nibble: 74 65 73 74 becomes 74 73 65 74
function reverseHexNibbles(string, delimiter) {
    if(isValidHex(string, delimiter)) {
        return string.split(delimiter).reverse().join(delimiter);
    } else {
        throw new Error("Hexadecimal contains invalid characters, check you have selected the correct delimiter");
    }
}

// Shift Hex
const shiftButton = document.getElementById("shiftDecode");
shiftButton.addEventListener("click", function() {
    const shiftString = document.getElementById("shiftText");
    let shiftValue = document.getElementById("shiftValue");
    let shiftHexDelimiter = document.getElementById("shiftHexDelimiter").value;

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
    if (!largeDataWarning(shiftString.value, shiftString)) {
        return false;
    }

    try {
        shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter);
    } catch (e) {
        showToast("Error", `An error occured trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    document.getElementById("text-tab-pane").textContent = hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter);
    document.getElementById("binary-tab-pane").textContent = stringToBinary(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
    document.getElementById("hex-tab-pane").textContent = shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter);
    document.getElementById("base64-tab-pane").textContent = stringToBase64(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
    document.getElementById("decimal-tab-pane").textContent =  stringToDecimal(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, shiftHexDelimiter), shiftHexDelimiter));
});

// Reverse Hex
const reverseHexButton = document.getElementById("reverseHexDecode");
reverseHexButton.addEventListener("click", function() {
    const reverseHexString = document.getElementById("reverseHexText");
    let reverseHexDelimiter = document.getElementById("reverseHexDelimiter").value;
    let reverseNibbles = document.getElementById("reverseNibbles");

    if(!emptyContainerCheck(reverseHexString.value, reverseHexString)) {
        return false;
    }
    if (!largeDataWarning(reverseHexString.value, reverseHexString)) {
        return false;
    }

    try {
        if(reverseNibbles.checked) {
            reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
        } else {
            reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
        } 
    } catch (e) {
        showToast("Error", `An error occured trying to reverse the hex string: ${e.message}`, "danger");
        return;
    }

    let revHexContent;
    if(reverseNibbles.checked) {
        revHexContent = reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter)
    } else {
        revHexContent = reverseHex(reverseHexString.value.trim(), reverseHexDelimiter);
    } 
    document.getElementById("reverseHexResults").textContent = revHexContent;
});
