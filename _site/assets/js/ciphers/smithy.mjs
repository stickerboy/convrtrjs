import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';
import * as smithy from './smithy-fn.mjs';

Object.entries(smithy).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const smithyEncryptButton = document.getElementById("smithyEncrypt");
smithyEncryptButton && smithyEncryptButton.addEventListener("click", function () {
    const smithyString = document.getElementById("smithyText");
    const smithyKey = document.getElementById("smithyKey");

    if (!emptyContainerCheck(smithyString.value, smithyString)) {
        return false;
    }
    if (!emptyContainerCheck(smithyKey.value, smithyKey, "A key is required to encrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(smithyString.value, smithyString)) {
        return false;
    }

    let chainSm = document.getElementById("chainSm");
    let sM = document.getElementById("smithyResults").textContent;
    let kwResults = chainSm.checked && sM.length > 0 ? sM : smithyString.value;

    document.getElementById("smithyResults").textContent = smithy.smithyEncrypt(kwResults, smithyKey.value);
});

const smithyDecryptButton = document.getElementById("smithyDecrypt");
smithyDecryptButton && smithyDecryptButton.addEventListener("click", function () {
    const smithyString = document.getElementById("smithyText");
    const smithyKey = document.getElementById("smithyKey");

    if (!emptyContainerCheck(smithyString.value, smithyString)) {
        return false;
    }
    if (!emptyContainerCheck(smithyKey.value, smithyKey, "A key is required to decrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(smithyString.value, smithyString)) {
        return false;
    }

    let chainSm = document.getElementById("chainSm");
    let sM = document.getElementById("smithyResults").textContent;
    let kwResults = chainSm.checked && sM.length > 0 ? sM : smithyString.value;

    document.getElementById("smithyResults").textContent = smithy.smithyDecrypt(kwResults, smithyKey.value);
});