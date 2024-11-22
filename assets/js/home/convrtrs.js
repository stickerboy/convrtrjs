// Make it so
document.getElementById("encode").addEventListener("click", function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(data);
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(data, hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(data);
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(data);
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(data);
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(data);
});


// Convert from Binary
document.getElementById("binaryDecode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        binaryToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = binaryToString(data);
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(binaryToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(binaryToString(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(binaryToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(binaryToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(binaryToString(data));
});


// Convert from Hex
document.getElementById("hexDecode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        hexToString(data, hexDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = hexToString(data, hexDelimiter);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(hexToString(data, hexDelimiter));
});


// Convert from Base64
document.getElementById("b64Decode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        base64ToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = base64ToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(base64ToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(base64ToString(data), hexDelimiter);
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(base64ToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(base64ToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(base64ToString(data));
});


// Convert from Decimal
document.getElementById("decDecode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        decimalToString(data);
    } catch (e) {
        showToast("Error", "An error occurred trying to decode the data.", "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = decimalToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(decimalToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(decimalToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(decimalToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(decimalToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(decimalToString(data));
});


// Reverse
document.getElementById("revDecode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        reverseString(data);
    } catch (e) {
        showToast("Error", "An error occurred trying to decode the data.", "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = reverseString(stringToBinary(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = reverseString(stringToHex(data, hexDelimiter));
    document.getElementById("convrtrs-base64").querySelector("textarea").value = reverseString(stringToBase64(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = reverseString(stringToDecimal(data));
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = reverseString(rot13(data));
    document.getElementById("convrtrs-morse").querySelector("textarea").value = reverseString(stringToMorse(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = reverseString(stringToMorsenary(data));
});


// Convert from Rot13
document.getElementById("rot13Decode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        rot13(data);
    } catch (e) {
        showToast("Error", "An error occurred trying to decode the data.", "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(rot13(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(rot13(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(rot13(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(rot13(data));
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(rot13(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(rot13(data));
});


// Convert from Morse
document.getElementById("morseDecode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        morseToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = morseToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(morseToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(morseToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(morseToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = rot13(morseToString(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(morseToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = stringToMorsenary(morseToString(data));
});


// Convert from Morsenary
document.getElementById("mrsnryDecode").addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("hexDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        morsenaryToString(data);
    } catch (e) {
        showToast("Error",`An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = morsenaryToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = stringToBinary(morsenaryToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = stringToHex(morsenaryToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = stringToBase64(morsenaryToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = stringToDecimal(morsenaryToString(data));
    document.getElementById("convrtrs-morse").querySelector("textarea").value = stringToMorse(morsenaryToString(data));
});