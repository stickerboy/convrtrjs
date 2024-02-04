// Build up a custom alphabet using a key
// ABCDEFG... → TEST → TESABCDFG...
function getCustomAlphabet(string) {
    let stringArr = [...new Set(string.toLowerCase())];
    let alphaArr = [...new Set(alphabet.trim().toLowerCase().substring(0,26))];
    return [...new Set(stringArr.concat(alphaArr))].join("");
}

// Substitute each letter in a string with a corresponding letter from a custom alphabet
// Custom alphabet is built using a user specified text string
function substituteChars(string, key) {
    const alpha = getCustomAlphabet(key);
    return string.toLowerCase().split("").map((char) => {
        if (char >= "a" && char <= "z") {
            // Get the index of the original letter in the standard alphabet
            let index = char.charCodeAt(0) - 97;
            // Return the corresponding letter from the custom alphabet
            return alpha.charAt(index);
        } else {
            // Return the original character
            return char;
        }
    }).join("");
}

// Generate hash values
function generateHashes(string, hash, key) {
    switch (hash) {
        case "MD5": 
            return CryptoJS.MD5(string);
        break;
        case "SHA1":
            return CryptoJS.SHA1(string);
        break;
        case "SHA256":
            return CryptoJS.SHA256(string);
        break;
        case "SHA512":
            return CryptoJS.SHA512(string);
        break;
        case "SHA3512":
            return CryptoJS.SHA3(string, { outputLength: 512 });
        break;
        case "SHA3384":
            return CryptoJS.SHA3(string, { outputLength: 384 });
        break;
        case "SHA3256":
            return CryptoJS.SHA3(string, { outputLength: 256 });
        break;
        case "SHA3224":
            return CryptoJS.SHA3(string, { outputLength: 224 });
        break;
        default:
            return "Invalid hash method provided or not supported";
    }
}

// Encrypt using Vigenère cipher
function vignereEncrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) + key.toUpperCase().charCodeAt(j) - 2 * 65) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) + key.toLowerCase().charCodeAt(j) - 2 * 97) % 26 + 97);
            }
        } else {
            result += c;
        }
        j = ++j % key.length;
    }
    return result;
}

// Decrypt Vigenère cipher
function vignereDecrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode(90 - (25 - (c.charCodeAt(0) - key.toUpperCase().charCodeAt(j))) % 26);
            } else {
                result += String.fromCharCode(122 - (25 - (c.charCodeAt(0) - key.toLowerCase().charCodeAt(j))) % 26);
            }
        } else {
            result += c;
        }
        j = ++j % key.length;
    }
    return result;
}

// ROT Text
const rotButtons    = document.getElementsByClassName("rot-link");
const rotPrevious   = document.getElementById("rotPrev");
const rotNext       = document.getElementById("rotNext");

Array.from(rotButtons, c => c.addEventListener("click", function() {
    const rotText = document.getElementById("rotText");
    const rotNumber = c.getAttribute("data-rot-number");

    if(!emptyContainerCheck(rotText.value, rotText)) {
        rotResults = "";
        return false;
    }
    if (!largeDataWarning(rotText.value, rotText)) {
        return false;
    }

    let chainRots = document.getElementById("chainRots");
    let rR = document.getElementById("rotResults").textContent;
    let rotResults = chainRots.checked && rR.length > 0 ? rR : rotText.value.trim();

    Array.from(rotButtons, button => {
        button.classList.remove("active");
    });
    c.classList.add("active");

    document.getElementById("rotResults").textContent = rot(rotResults, parseInt(rotNumber));
}));

// ROT - Go backwards
rotPrevious.addEventListener("click", function() {
    const rotText = document.getElementById("rotText");

    if(!emptyContainerCheck(rotText.value, rotText)) {
        return false;
    }
    if (!largeDataWarning(rotText.value, rotText)) {
        return false;
    }

    let activeButton;
    if(document.querySelector(".rot-link.active") !== null) {
        activeButton = document.querySelector(".rot-link.active");
    } else {
        activeButton = document.querySelector(".rot-link:first-child");
    }
    let activeRotNumber = activeButton.getAttribute("data-rot-number");
    let previousRotNumber = parseInt(activeRotNumber) - 1; 

    if (activeButton.getAttribute("data-rot-number") === "1") {
        document.getElementById("rot26").click();
    } else {
        document.getElementById(`rot${previousRotNumber}`).click();
    }
});

// TOR - Go forwards
rotNext.addEventListener("click", function() {
    const rotText = document.getElementById("rotText");

    if(!emptyContainerCheck(rotText.value, rotText)) {
        return false;
    }
    if (!largeDataWarning(rotText.value, rotText)) {
        return false;
    }

    let activeButton;
    if(document.querySelector(".rot-link.active") !== null) {
        activeButton = document.querySelector(".rot-link.active");
    } else {
        activeButton = document.querySelector(".rot-link:first-child");
    }
    let activeRotNumber = activeButton.getAttribute("data-rot-number");
    let nextRotNumber = parseInt(activeRotNumber) + 1;

    if (activeButton.getAttribute("data-rot-number") === "26") {
        document.getElementById("rot1").click();
    } else {
        document.getElementById(`rot${nextRotNumber}`).click();
    }
});


// Vigenère cipher
const vigenereEncryptButton = document.getElementById("vigenereEncrypt");
vigenereEncryptButton.addEventListener("click", function() {
    const vigenereString = document.getElementById("vigenereText");
    const vigenereKey = document.getElementById("vigenereKey");

    if(!emptyContainerCheck(vigenereString.value, vigenereString)) {
        return false;
    }
    if (!largeDataWarning(vigenereString.value, vigenereString)) {
        return false;
    }

    document.getElementById("vigenereResults").textContent = vignereEncrypt(vigenereString.value, vigenereKey.value);
});
const vigenereDecryptButton = document.getElementById("vigenereDecrypt");
vigenereDecryptButton.addEventListener("click", function() {
    const vigenereString = document.getElementById("vigenereText");
    const vigenereKey = document.getElementById("vigenereKey");

    if(!emptyContainerCheck(vigenereString.value, vigenereString)) {
        return false;
    }
    if (!largeDataWarning(vigenereString.value, vigenereString)) {
        return false;
    }

    document.getElementById("vigenereResults").textContent = vignereDecrypt(vigenereString.value, vigenereKey.value);
});

// Hash strings
const hashButton = document.getElementById("hashDecode");
hashButton.addEventListener("click", function() {
    const hashString = document.getElementById("hashText");
    let hashResults = document.getElementById("hashResults");
    hashResults.innerHTML = "";

    if(!emptyContainerCheck(hashString.value, hashString)) {
        return false;
    }
    if (!largeDataWarning(hashString.value, hashString)) {
        return false;
    }

    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">MD5</span>&nbsp;</th><td>${generateHashes(hashString.value, "MD5")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-1</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA1")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-256</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA256")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-512</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA512")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [224]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3224")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [256]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3256")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [384]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3384")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML("beforeend", `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [512]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3512")}&nbsp;</td></tr>`);
});

// Substitution cipher
const subEncryptButton = document.getElementById("subEncrypt");
subEncryptButton.addEventListener("click", function() {
    const subString = document.getElementById("subText");
    const subKey = document.getElementById("subKey");

    if(!emptyContainerCheck(subString.value, subString)) {
        return false;
    }
    if (!largeDataWarning(subString.value, subString)) {
        return false;
    }

    let chainSubs = document.getElementById("chainSubs");
    let sR = document.getElementById("subResults").textContent;
    let subResults = chainSubs.checked && sR.length > 0 ? sR : subString.value;

    document.getElementById("subResults").textContent = substituteChars(subResults, subKey.value);
});