import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as keyword from './keyword-fn.mjs';

Object.entries(keyword).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const keywordEncryptButton = document.getElementById("keywordEncrypt");
keywordEncryptButton && keywordEncryptButton.addEventListener("click", function () {
    const keywordString = document.getElementById("keywordText");
    const keywordKey = document.getElementById("keywordKey");

    if (!emptyContainerCheck(keywordString.value, keywordString)) {
        return false;
    }
    if (!emptyContainerCheck(keywordKey.value, keywordKey, "A key is required to encrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(keywordString.value, keywordString)) {
        return false;
    }

    let chainKw = document.getElementById("chainKw");
    let kR = document.getElementById("keywordResults").textContent;
    let kwResults = chainKw.checked && kR.length > 0 ? kR : keywordString.value;

    if (/[^A-Za-z]/.test(keywordKey.value)) {
        showToast("Error", "Keyword key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }
    document.getElementById("keywordResults").textContent = keyword.keywordEncode(kwResults, keywordKey.value);
});

const keywordDecryptButton = document.getElementById("keywordDecrypt");
keywordDecryptButton && keywordDecryptButton.addEventListener("click", function () {
    const keywordString = document.getElementById("keywordText");
    const keywordKey = document.getElementById("keywordKey");

    if (!emptyContainerCheck(keywordString.value, keywordString)) {
        return false;
    }
    if (!emptyContainerCheck(keywordKey.value, keywordKey, "A key is required to decrypt this cipher")) {
        return false;
    }
    if (!largeDataWarning(keywordString.value, keywordString)) {
        return false;
    }

    let chainKw = document.getElementById("chainKw");
    let kR = document.getElementById("keywordResults").textContent;
    let kwResults = chainKw.checked && kR.length > 0 ? kR : keywordString.value;

    if (/[^A-Za-z]/.test(keywordKey.value)) {
        showToast("Error", "Keyword key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
        return;
    }
    document.getElementById("keywordResults").textContent = keyword.keywordDecode(kwResults, keywordKey.value);
});