import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as substitution from './substitution-fn.mjs';

Object.entries(substitution).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const subEncryptButton = document.getElementById("substitutionEncrypt");
subEncryptButton && subEncryptButton.addEventListener("click", function() {
    const subString = document.getElementById("substitutionText");
    const subKey = document.getElementById("substitutionKey");

    if(!emptyContainerCheck(subString.value, subString)) {
        return false;
    }
    if (!emptyContainerCheck(subKey.value, subKey, "A key is required to encrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(subString.value, subString)) {
        return false;
    }

    let chainSubs = document.getElementById("chainSubs");
    let sR = document.getElementById("substitutionResults").textContent;
    let subResults = chainSubs.checked && sR.length > 0 ? sR : subString.value;

    if (/[^A-Za-z]/.test(subKey.value)) {
        showToast("Error", "Substitution key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }

    document.getElementById("substitutionResults").textContent = substitution.substituteChars(subResults, subKey.value);
});