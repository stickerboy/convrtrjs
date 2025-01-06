import rot from '../rot.mjs';
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as ciphers from './ciphers-fn.mjs';

Object.keys(ciphers).forEach(functionName => {
    window[functionName] = ciphers[functionName];
});

// Caesar (ROT) Text
const caesarButtons    = document.getElementsByClassName("caesar-link");
const caesarPrevious   = document.getElementById("caesarPrev");
const caesarNext       = document.getElementById("caesarNext");
const caesarKey        = document.getElementById("caesarKey");

if(caesarButtons.length > 0) {
    Array.from(caesarButtons, c => c.addEventListener("click", function() {
        const caesarText = document.getElementById("caesarText");
        const caesarNumber = c.getAttribute("data-caesar-number");
        let chainRots = document.getElementById("chainRots");
        let rR = document.getElementById("caesarResults").textContent;
        let caesarResults = chainRots.checked && rR.length > 0 ? rR : caesarText.value.trim();

        if(!emptyContainerCheck(caesarText.value, caesarText)) {
            caesarResults = "";
            return false;
        }
        if (!largeDataWarning(caesarText.value, caesarText)) {
            return false;
        }
        if (caesarKey.value.length > 0 && /[^A-Za-z]/.test(caesarKey.value)) {
            showToast("Error", "Caesar key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
            return;
        }

        Array.from(caesarButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        if(caesarKey.value.length > 0) {
            document.getElementById("caesarResults").textContent = rot(caesarResults, parseInt(caesarNumber), getCustomAlphabet(caesarKey.value));
        } else {
            document.getElementById("caesarResults").textContent = rot(caesarResults, parseInt(caesarNumber));
        }
    }));
}
// Caesar - Go backwards
caesarPrevious && caesarPrevious.addEventListener("click", function() {
    const caesarText = document.getElementById("caesarText");

    if (!emptyContainerCheck(caesarText.value, caesarText)) {
        return false;
    }
    if (!largeDataWarning(caesarText.value, caesarText)) {
        return false;
    }

    let activeButton;
    if (document.querySelector(".caesar-link.active") !== null) {
        activeButton = document.querySelector(".caesar-link.active");
    } else {
        activeButton = document.querySelector(".caesar-link:first-child");
    }
    let activeCaesarNumber = activeButton.getAttribute("data-caesar-number");
    let previousCaesarNumber = parseInt(activeCaesarNumber) - 1; 

    if (activeButton.getAttribute("data-caesar-number") === "1") {
        document.getElementById("caesar26").click();
    } else {
        document.getElementById(`caesar${previousCaesarNumber}`).click();
    }
});

// TOR - Go forwards
caesarNext && caesarNext.addEventListener("click", function() {
    const caesarText = document.getElementById("caesarText");

    if (!emptyContainerCheck(caesarText.value, caesarText)) {
        return false;
    }
    if (!largeDataWarning(caesarText.value, caesarText)) {
        return false;
    }

    let activeButton;
    if (document.querySelector(".caesar-link.active") !== null) {
        activeButton = document.querySelector(".caesar-link.active");
    } else {
        activeButton = document.querySelector(".caesar-link:first-child");
    }
    let activeCaesarNumber = activeButton.getAttribute("data-caesar-number");
    let nextCaesarNumber = parseInt(activeCaesarNumber) + 1;

    if (activeButton.getAttribute("data-caesar-number") === "26") {
        document.getElementById("caesar1").click();
    } else {
        document.getElementById(`caesar${nextCaesarNumber}`).click();
    }
});


// Substitution cipher
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

    document.getElementById("substitutionResults").textContent = ciphers.substituteChars(subResults, subKey.value);
});


// Vigenère cipher
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
    document.getElementById("vigenereResults").textContent = ciphers.vignereEncrypt(vigResults, vigenereKey.value);
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
    document.getElementById("vigenereResults").textContent = ciphers.vignereDecrypt(vigResults, vigenereKey.value);
});


// Keyword cipher
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
    document.getElementById("keywordResults").textContent = ciphers.keywordEncode(kwResults, keywordKey.value);
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
    document.getElementById("keywordResults").textContent = ciphers.keywordDecode(kwResults, keywordKey.value);
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
    document.getElementById("beaufortResults").textContent = ciphers.beaufortCipher(beaufortString.value, beaufortKey.value);
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
    document.getElementById("beaufortResults").textContent = ciphers.beaufortCipher(beaufortString.value, beaufortKey.value);
});


// Rail fence cipher
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
    document.getElementById("railResults").textContent = ciphers.railFenceEncode(railString.value, railAmount.value);
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
    document.getElementById("railResults").textContent = ciphers.railFenceDecode(railString.value, railAmount.value);
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

    document.getElementById("chaocipherResults").textContent = ciphers.chaocipherEncode(chaosResults);
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

    document.getElementById("chaocipherResults").textContent = ciphers.chaocipherDecode(chaosResults);
});


// Smithy cipher
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

    document.getElementById("smithyResults").textContent = ciphers.smithyEncrypt(kwResults, smithyKey.value);
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

    document.getElementById("smithyResults").textContent = ciphers.smithyDecrypt(kwResults, smithyKey.value);
});


// Atbash cipher
const atbashDecodeButton = document.getElementById("atbashDecode");
atbashDecodeButton && atbashDecodeButton.addEventListener("click", function() {
    const atbashString = document.getElementById("atbashText");

    if(!emptyContainerCheck(atbashString.value, atbashString)) {
        return false;
    }
    if (!largeDataWarning(atbashString.value, atbashString)) {
        return false;
    }

    let chainAb = document.getElementById("chainAb");
    let abR = document.getElementById("atbashResults").textContent;
    let atbashResults = chainAb.checked && abR.length > 0 ? abR : atbashString.value;

    document.getElementById("atbashResults").textContent = ciphers.atbashCipher(atbashResults);
});

// Hash strings
const hashButton = document.getElementById("hashDecode");
hashButton && hashButton.addEventListener("click", function() {
    const hashString = document.getElementById("hashText");
    const hashResults = document.getElementById("hashResults");
    hashResults.innerHTML = "";

    if (!emptyContainerCheck(hashString.value, hashString)) {
        return false;
    }
    if (!largeDataWarning(hashString.value, hashString)) {
        return false;
    }

    // Mapping object for hash types and their labels
    const hashTypes = [
        { label: "MD5", type: "MD5" },
        { label: "SHA-1", type: "SHA1" },
        { label: "SHA-256", type: "SHA256" },
        { label: "SHA-512", type: "SHA512" },
        { label: "SHA-3 [224]", type: "SHA3224" },
        { label: "SHA-3 [256]", type: "SHA3256" },
        { label: "SHA-3 [384]", type: "SHA3384" },
        { label: "SHA-3 [512]", type: "SHA3512" }
    ];

    // Insert each hash result
    hashTypes.forEach(({ label, type }) => {
        hashResults.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <th scope="row"><span class="display-6 fs-6 fw-normal">${label}</span>&nbsp;</th>
                <td>${ciphers.generateHashes(hashString.value, type)}&nbsp;</td>
            </tr>`
        );
    });
});
