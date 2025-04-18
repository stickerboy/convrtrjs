import * as tools from '../tools.mjs';
import * as toolkit from '../toolkit.mjs';
import { emptyContainerCheck, largeDataWarning, showToast }  from '../scripts.mjs';
import * as home from './text-fn.mjs';

Object.entries(home).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

// Make it so
const encodeButton = document.getElementById("encode");
encodeButton && encodeButton.addEventListener("click", function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    document.getElementById("convrtrs-binary").querySelector("textarea").value      = toolkit.stringToBinary(data);
    document.getElementById("convrtrs-hex").querySelector("textarea").value         = toolkit.stringToHex(data, hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value      = toolkit.stringToBase64(data);
    document.getElementById("convrtrs-decimal").querySelector("textarea").value     = toolkit.stringToDecimal(data);
    document.getElementById("convrtrs-reverse").querySelector("textarea").value     = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value       = toolkit.rot13(data);
    document.getElementById("convrtrs-morse").querySelector("textarea").value       = home.stringToMorse(data);
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value   = home.stringToMorsenary(data);
});


// Convert from Binary
const binaryDecodeButton = document.getElementById("binaryDecode");
binaryDecodeButton && binaryDecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        home.binaryToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value        = home.binaryToString(data);
    document.getElementById("convrtrs-hex").querySelector("textarea").value         = toolkit.stringToHex(home.binaryToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value      = toolkit.stringToBase64(home.binaryToString(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value     = toolkit.stringToDecimal(home.binaryToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value     = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value       = "";
    document.getElementById("convrtrs-morse").querySelector("textarea").value       = home.stringToMorse(home.binaryToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value   = home.stringToMorsenary(home.binaryToString(data));
});


// Convert from Hex
const hexDecodeButton = document.getElementById("hexDecode");
hexDecodeButton && hexDecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        toolkit.hexToString(data, hexDelimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value        = toolkit.hexToString(data, hexDelimiter);
    document.getElementById("convrtrs-binary").querySelector("textarea").value      = toolkit.stringToBinary(toolkit.hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-base64").querySelector("textarea").value      = toolkit.stringToBase64(toolkit.hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value     = toolkit.stringToDecimal(toolkit.hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value     = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value       = toolkit.rot13(data);
    document.getElementById("convrtrs-morse").querySelector("textarea").value       = home.stringToMorse(toolkit.hexToString(data, hexDelimiter));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value   = home.stringToMorsenary(toolkit.hexToString(data, hexDelimiter));
});


// Convert from Base64
const b64DecodeButton = document.getElementById("b64Decode");
b64DecodeButton && b64DecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        home.base64ToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = home.base64ToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = toolkit.stringToBinary(home.base64ToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = toolkit.stringToHex(home.base64ToString(data), hexDelimiter);
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = toolkit.stringToDecimal(home.base64ToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtrs-morse").querySelector("textarea").value = home.stringToMorse(home.base64ToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = home.stringToMorsenary(home.base64ToString(data));
});


// Convert from Decimal
const decDecodeButton = document.getElementById("decDecode");
decDecodeButton && decDecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        toolkit.decimalToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = toolkit.decimalToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = toolkit.stringToBinary(toolkit.decimalToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = toolkit.stringToHex(toolkit.decimalToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = toolkit.stringToBase64(toolkit.decimalToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = toolkit.rot13(data);
    document.getElementById("convrtrs-morse").querySelector("textarea").value = home.stringToMorse(toolkit.decimalToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = home.stringToMorsenary(toolkit.decimalToString(data));
});


// Reverse
const revDecodeButton = document.getElementById("revDecode");
revDecodeButton && revDecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        toolkit.reverseString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = toolkit.reverseString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = toolkit.reverseString(toolkit.stringToBinary(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = toolkit.reverseString(toolkit.stringToHex(data, hexDelimiter));
    document.getElementById("convrtrs-base64").querySelector("textarea").value = toolkit.reverseString(toolkit.stringToBase64(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = toolkit.reverseString(toolkit.stringToDecimal(data));
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = toolkit.reverseString(toolkit.rot13(data));
    document.getElementById("convrtrs-morse").querySelector("textarea").value = toolkit.reverseString(home.stringToMorse(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = toolkit.reverseString(home.stringToMorsenary(data));
});


// Convert from Rot13
const rot13DecodeButton = document.getElementById("rot13Decode");
rot13DecodeButton && rot13DecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        toolkit.rot13(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = toolkit.rot13(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = toolkit.stringToBinary(toolkit.rot13(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = toolkit.stringToHex(toolkit.rot13(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = toolkit.stringToBase64(toolkit.rot13(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = toolkit.reverseString(data);
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = toolkit.stringToDecimal(toolkit.rot13(data));
    document.getElementById("convrtrs-morse").querySelector("textarea").value = home.stringToMorse(toolkit.rot13(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = home.stringToMorsenary(toolkit.rot13(data));
});


// Convert from Morse
const morseDecodeButton = document.getElementById("morseDecode");
morseDecodeButton && morseDecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        home.morseToString(data);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = home.morseToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = toolkit.stringToBinary(home.morseToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = toolkit.stringToHex(home.morseToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = toolkit.stringToBase64(home.morseToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = toolkit.rot13(home.morseToString(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = toolkit.stringToDecimal(home.morseToString(data));
    document.getElementById("convrtrs-morsenary").querySelector("textarea").value = home.stringToMorsenary(home.morseToString(data));
});


// Convert from Morsenary
const mrsnryDecodeButton = document.getElementById("mrsnryDecode");
mrsnryDecodeButton && mrsnryDecodeButton.addEventListener("click", function() {
    const chainDecoders = document.getElementById("chainDecoders");
    const container = chainDecoders.checked ? document.getElementById("form-text") : this.closest(".card-body").querySelector("textarea");
    const data = container.value;
    let hexDelimiter = document.getElementById("convrtrsDelimiter").value;

    if(!emptyContainerCheck(data, container)) {
        return false;
    }
    if (!largeDataWarning(data, container)) {
        return false;
    }

    try {
        home.morsenaryToString(data);
    } catch (e) {
        showToast("Error",`An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    document.getElementById("convrtrs-text").querySelector("textarea").value = home.morsenaryToString(data);
    document.getElementById("convrtrs-binary").querySelector("textarea").value = toolkit.stringToBinary(home.morsenaryToString(data));
    document.getElementById("convrtrs-hex").querySelector("textarea").value = toolkit.stringToHex(home.morsenaryToString(data), hexDelimiter);
    document.getElementById("convrtrs-base64").querySelector("textarea").value = toolkit.stringToBase64(home.morsenaryToString(data));
    document.getElementById("convrtrs-reverse").querySelector("textarea").value = toolkit.reverseString(data);
    document.getElementById("convrtrs-rot13").querySelector("textarea").value = toolkit.rot13(home.morsenaryToString(data));
    document.getElementById("convrtrs-decimal").querySelector("textarea").value = toolkit.stringToDecimal(home.morsenaryToString(data));
    document.getElementById("convrtrs-morse").querySelector("textarea").value = home.stringToMorse(home.morsenaryToString(data));
});