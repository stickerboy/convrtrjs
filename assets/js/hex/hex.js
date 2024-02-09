// Shift Hex left or right
// Returns: Decimal, space delimited
function shiftHexString(string, shiftValue, delimiter) {
    const validHex = /[0-9A-Fa-f]+$/g;
    if(validHex.test(string)) {
        return hexToString(string, delimiter).split("").map(c => 
            (ord(c) + parseInt(shiftValue)).toString(16)
        ).join(delimiter);
    } else {
        throw new Error("Hexadecimal contains invalid characters");
    }
}

// Reverse Hex
// Swaps the order of each hex nibble: 74 65 73 74 [test] becomes 47 56 37 47
function reverseHex(string, delimiter) {
    return string.split(delimiter).map(c => 
              reverseString(c)
           ).join(delimiter);
}

// Reverse Hex nibbles
// Reverses the position of each Hex nibble: 74 65 73 74 becomes 74 73 65 74
function reverseHexNibbles(string) {
    const nibbles = [];
    const strLength = string.length;
    for (let i = 0; i < strLength; i += 2) {
        const nibble = parseInt(string.substr(i, 2), 16);
        nibbles.push(nibble);
    }
    return nibbles.reverse().map(nibble => nibble.toString(16)).join("");
}


// Shift Hex
const shiftButton = document.getElementById("shiftDecode");
shiftButton.addEventListener("click", function() {
    const shiftString = document.getElementById("shiftText");

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
        shiftHexString(shiftString.value.trim(), shiftValue.value, hexDelimiter);
    } catch (e) {
        showToast("Error", `An error occured trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    let shiftValue = document.getElementById("shiftValue");
    let hexDelimiter = document.getElementById("shiftHexDelimiter").value;
    document.getElementById("text-tab-pane").textContent = hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, hexDelimiter), hexDelimiter);
    document.getElementById("binary-tab-pane").textContent = stringToBinary(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, hexDelimiter), hexDelimiter));
    document.getElementById("hex-tab-pane").textContent = shiftHexString(shiftString.value.trim(), shiftValue.value, hexDelimiter);
    document.getElementById("base64-tab-pane").textContent = stringToBase64(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, hexDelimiter), hexDelimiter));
    document.getElementById("decimal-tab-pane").textContent =  string2Dec(hexToString(shiftHexString(shiftString.value.trim(), shiftValue.value, hexDelimiter), hexDelimiter));
});

// Reverse Hex
const reverseHexButton = document.getElementById("reverseHexDecode");
reverseHexButton.addEventListener("click", function() {
    const reverseHexString = document.getElementById("reverseHexText");

    if(!emptyContainerCheck(reverseHexString.value, reverseHexString)) {
        return false;
    }
    if (!largeDataWarning(reverseHexString.value, reverseHexString)) {
        return false;
    }

    let hexDelimiter = document.getElementById("shiftHexDelimiter").value;
    document.getElementById("reverseHexResults").textContent = reverseHex(reverseHexString.value, hexDelimiter);
});
