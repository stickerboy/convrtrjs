import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';
import * as chaocipher from './chaocipher-fn.mjs';

Object.entries(chaocipher).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

// Chaocipher
const chaosEncryptButton = document.getElementById("chaocipherEncrypt");
chaosEncryptButton && chaosEncryptButton.addEventListener("click", function () {
    const chaosString = document.getElementById("chaocipherText");

    if (!emptyContainerCheck(chaosString.value, chaosString)) {
        return false;
    }
    if (!largeDataWarning(chaosString.value, chaosString)) {
        return false;
    }

    let chainChaos = document.getElementById("chainChaocipher");
    let chR = document.getElementById("chaocipherResults").textContent;
    let chaosResults = chainChaos.checked && chR.length > 0 ? chR : chaosString.value;

    document.getElementById("chaocipherResults").textContent = chaocipher.chaocipherEncode(chaosResults);
});

const chaosDecryptButton = document.getElementById("chaocipherDecrypt");
chaosDecryptButton && chaosDecryptButton.addEventListener("click", function () {
    const chaosString = document.getElementById("chaocipherText");

    if (!emptyContainerCheck(chaosString.value, chaosString)) {
        return false;
    }
    if (!largeDataWarning(chaosString.value, chaosString)) {
        return false;
    }

    let chainChaos = document.getElementById("chainChaocipher");
    let chR = document.getElementById("chaocipherResults").textContent;
    let chaosResults = chainChaos.checked && chR.length > 0 ? chR : chaosString.value;

    document.getElementById("chaocipherResults").textContent = chaocipher.chaocipherDecode(chaosResults);
});
