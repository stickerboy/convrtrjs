import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as rail from './rail-fn.mjs';

Object.entries(rail).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const railEncryptButton = document.getElementById("railEncrypt");
railEncryptButton && railEncryptButton.addEventListener("click", function () {
    const railString = document.getElementById("railText");
    const railAmount = document.getElementById("railAmount");

    if (!emptyContainerCheck(railString.value, railString)) {
        return false;
    }
    if (!emptyContainerCheck(railAmount.value, railAmount, "A key is required to encrypt this cipher text")) {
        return false;
    }
    if (!largeDataWarning(railString.value, railString)) {
        return false;
    }
    if (/[^0-9]/.test(railAmount.value)) {
        showToast("Error", "Rail amount can only contain numbers. Letters and special characters, including spaces, are not valid here", "danger");
        return;
    }

    try {
        railFenceEncode(railString.value, railAmount.value)
    } catch (e) {
        showToast("Error", `An error occurred trying to encrypt the string: ${e.message}`, "danger");
        return;
    }
    document.getElementById("railResults").textContent = rail.railFenceEncode(railString.value, railAmount.value);
});

const railDecryptButton = document.getElementById("railDecrypt");
railDecryptButton && railDecryptButton.addEventListener("click", function () {
    const railString = document.getElementById("railText");
    const railAmount = document.getElementById("railAmount");

    if (!emptyContainerCheck(railString.value, railString)) {
        return false;
    }
    if (!emptyContainerCheck(railAmount.value, railAmount, "A key is required to decrypt this cipher text")) {
        return false;
    }
    if (!largeDataWarning(railString.value, railString)) {
        return false;
    }
    if (/[^0-9]/.test(railAmount.value)) {
        showToast("Error", "Rail amount can only contain numbers. Letters and special characters, including spaces, are not valid here", "danger");
        return;
    }

    try {
        railFenceDecode(railString.value, railAmount.value)
    } catch (e) {
        showToast("Error", `An error occurred trying to decrypt the string: ${e.message}`, "danger");
        return;
    }
    document.getElementById("railResults").textContent = rail.railFenceDecode(railString.value, railAmount.value);
});