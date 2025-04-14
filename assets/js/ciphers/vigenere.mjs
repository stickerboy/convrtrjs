
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as vigenere from './vigenere-fn.mjs';

Object.entries(vigenere).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});
const vigenereEncryptButton = document.getElementById("vigenereEncrypt");
vigenereEncryptButton && vigenereEncryptButton.addEventListener("click", function() {
    const vigenereString = document.getElementById("vigenereText");
    const vigenereKey = document.getElementById("vigenereKey");

    if(!emptyContainerCheck(vigenereString.value, vigenereString)) {
        return false;
    }
    if (!emptyContainerCheck(vigenereKey.value, vigenereKey, "A key is required to encrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(vigenereString.value, vigenereString)) {
        return false;
    }

    let chainVig = document.getElementById("chainVig");
    let vR = document.getElementById("vigenereResults").textContent;
    let vigResults = chainVig.checked && vR.length > 0 ? vR : vigenereString.value;

    if (/[^A-Za-z]/.test(vigenereKey.value)) {
        showToast("Error", "Vigenère key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }
    document.getElementById("vigenereResults").textContent = vigenere.vignereEncrypt(vigResults, vigenereKey.value);
});

const vigenereDecryptButton = document.getElementById("vigenereDecrypt");
vigenereDecryptButton && vigenereDecryptButton.addEventListener("click", function() {
    const vigenereString = document.getElementById("vigenereText");
    const vigenereKey = document.getElementById("vigenereKey");

    if(!emptyContainerCheck(vigenereString.value, vigenereString)) {
        return false;
    }
    if (!emptyContainerCheck(vigenereKey.value, vigenereKey, "A key is required to decrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(vigenereString.value, vigenereString)) {
        return false;
    }

    let chainVig = document.getElementById("chainVig");
    let vR = document.getElementById("vigenereResults").textContent;
    let vigResults = chainVig.checked && vR.length > 0 ? vR : vigenereString.value;

    if (/[^A-Za-z]/.test(vigenereKey.value)) {
        showToast("Error", "Vigenère key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }
    document.getElementById("vigenereResults").textContent = vigenere.vignereDecrypt(vigResults, vigenereKey.value);
});