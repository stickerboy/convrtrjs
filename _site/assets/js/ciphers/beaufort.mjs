import * as beaufort from './beaufort-fn.mjs';
import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';

Object.entries(beaufort).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

// Beaufort cipher
const beaufortEncryptButton = document.getElementById("beaufortEncrypt");false
beaufortEncryptButton && beaufortEncryptButton.addEventListener("click", function() {
    const beaufortString = document.getElementById("beaufortText");
    const beaufortKey = document.getElementById("beaufortKey");

    if(!emptyContainerCheck(beaufortString.value, beaufortString)) {
        return false;
    }
    if(!emptyContainerCheck(beaufortKey.value, beaufortKey, "A key is required to encrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(beaufortString.value, beaufortString)) {
        return false;
    }

    if (/[^A-Za-z]/.test(beaufortKey.value)) {
        showToast("Error", "Beaufort key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }
    document.getElementById("beaufortResults").textContent = beaufort.beaufortCipher(beaufortString.value, beaufortKey.value);
});

const beaufortDecryptButton = document.getElementById("beaufortDecrypt");
beaufortDecryptButton && beaufortDecryptButton.addEventListener("click", function() {
    const beaufortString = document.getElementById("beaufortText");
    const beaufortKey = document.getElementById("beaufortKey");

    if(!emptyContainerCheck(beaufortString.value, beaufortString)) {
        return false;
    }
    if(!emptyContainerCheck(beaufortKey.value, beaufortKey, "A key is required to decrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(beaufortString.value, beaufortString)) {
        return false;
    }

    if (/[^A-Za-z]/.test(beaufortKey.value)) {
        showToast("Error", "Beaufort key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }
    document.getElementById("beaufortResults").textContent = beaufort.beaufortCipher(beaufortString.value, beaufortKey.value);
});