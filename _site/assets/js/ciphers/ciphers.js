/**
 * Builds a custom alphabet using a given key.
 * @param {string} string - A user-specified text string.
 * @returns {string} - A string containing the custom alphabet formed by combining unique characters from the input string and the standard alphabet.
 *
 * @example
 * // Input: "TEST"
 * // Output: "TESABCDFGHIJKLMNOPQRUVWXYZ"
 */
function getCustomAlphabet(string) {
    let stringArr = [...new Set(string.trim())];
    let alphaArr = [...new Set(alphabet.trim())];
    return [...new Set(stringArr.concat(alphaArr))].join("");
}

/**
 * Atbash cipher - reverses the alphabet for the given string.
 * Transforms 'A' to 'Z', 'B' to 'Y', etc.
 *
 * @param {string} string - The original string to be transformed.
 * @returns {string} - The transformed string with reversed alphabet.
 *
 * @example
 * // Input: "ABCxyz"
 * // Output: "ZYXcba"
 */
function atbashCipher(string) {
    const lowerAlphabet = alphabet.slice(27, 53);
    const upperAlphabet = alphabet.slice(1, 27);
    const reversedLower = lowerAlphabet.split('').reverse().join('');
    const reversedUpper = upperAlphabet.split('').reverse().join('');

    return string.replace(/[a-z]/g, c => reversedLower[lowerAlphabet.indexOf(c)])
                 .replace(/[A-Z]/g, c => reversedUpper[upperAlphabet.indexOf(c)]);
}

/**
 * Substitutes each letter in the a string with a corresponding letter from a custom alphabet
 * Custom alphabet is built using a user specified text string
 * @param {string} string - The original string to be modified.
 * @param {string} key - A user-specified text string used to create the custom alphabet.
 * @returns {string} - The modified string with letters replaced according to the custom alphabet.
 *
 * @example
 * // Input: "Hello, World!" with key "TEST"
 * // Output: "Tqxxa, Tqxxa!"
 */
function substituteChars(string, key) {
    const alpha = getCustomAlphabet(key);
    return string.split("").map((char) => {
         if (char >= "a" && char <= "z" || char >= "A" && char <= "Z") {
            // Return the corresponding letter from the custom alphabet
            // Get the index of the original letter in the standard alphabet
            let index = char.toLowerCase().charCodeAt(0) - 97;
            index = index % 26; // handle uppercase characters
            return matchCase(char, alpha.charAt(index));
        } else {
            // Return the original character
            return char;
        }
    }).join("");
}

/**
 * Generates hash values using various hash algorithms
 *
 * @param {string} string - The input string to be hashed.
 * @param {string} hash - The hash method (e.g., "MD5", "SHA1", etc.).
 * @param {string} key - Optional key (if applicable for the hash method).
 * @returns {string} - The hash value or an error message if the method is invalid or not supported.
 *
 * @example
 * // Input: "Hello, World!" with hash method "MD5"
 * // Output: "65a8e27d8879283831b664bd8b7f0ad4"
 */
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

/**
 * Encrypts a string using the Vigenère cipher.
 *
 * @param {string} string - The original string to be encrypted.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted string.
 *
 * @example
 * // Input: "Hello, World!" with key "KEY"
 * // Output: "Rovvy, Gybvn!"
 */
function vignereEncrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) + key.toLocaleUpperCase().charCodeAt(j) - 2 * 65) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) + key.toLocaleLowerCase().charCodeAt(j) - 2 * 97) % 26 + 97);
            }
        } else {
            result += c;
        }
        j = ++j % key.length;
    }
    return result;
}

/**
 * Decrypts a string encrypted using the Vigenère cipher
 *
 * @param {string} string - The encrypted string to be decrypted.
 * @param {string} key - The decryption key.
 * @returns {string} - The original plaintext string.
 *
 * @example
 * // Input: "Rovvy, Gybvn!" with key "KEY"
 * // Output: "Hello, World!"
 */
function vignereDecrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode(90 - (25 - (c.charCodeAt(0) - key.toLocaleUpperCase().charCodeAt(j))) % 26);
            } else {
                result += String.fromCharCode(122 - (25 - (c.charCodeAt(0) - key.toLocaleLowerCase().charCodeAt(j))) % 26);
            }
        } else {
            result += c;
        }
        j = ++j % key.length;
    }
    return result;
}

/**
 * Encrypts or decrypts a string using the Beaufort cipher.
 * The encryption and decryption process is identical.
 *
 * @param {string} string - The original string to be encrypted or decrypted.
 * @param {string} key - The encryption/decryption key.
 * @returns {string} - The encrypted or decrypted string.
 *
 * @example
 * // Input: "Hello, World!" with key "KEY"
 * // Output: Encrypted text
 *
 * // Input: Encrypted text with key "KEY"
 * // Output: "Hello, World!"
 */
function beaufortCipher(string, key) {
    const transformedString = atbashCipher(string);
    const transformedKey = atbashCipher(key);

    return vignereDecrypt(transformedString, transformedKey);
}


/**
 * Encodes a string using a keyword by creating a substitution cipher that supports both uppercase and lowercase keys.
 *
 * @param {string} string - The input string to encode.
 * @param {string} key - The keyword used for encoding, supporting both uppercase and lowercase.
 * @returns {string} - The encoded string.
 */
function keywordEncode(string, key) {
    // Normalize the key to ensure unique characters
    let uniqueKey = key.split('').filter((item, pos, self) => self.indexOf(item) === pos).join('');
    let upperKey = uniqueKey.toUpperCase();
    let lowerKey = uniqueKey.toLowerCase();

    // Create the translation string
    let transUpper = upperKey + alphabet.slice(1, 27).replace(new RegExp(`[${upperKey}]`, 'g'), '');
    let transLower = lowerKey + alphabet.slice(27).replace(new RegExp(`[${lowerKey}]`, 'g'), '');
    let trans = transUpper + transLower;

    // Translate the string using the custom alphabet
    return string.replace(/[A-Za-z]/g, function (c) {
        return trans[alphabet.indexOf(c)];
    });
}

/**
 * Decodes an encoded string using a keyword by reversing the substitution cipher that supports both uppercase and lowercase keys.
 *
 * @param {string} string - The encoded string to decode.
 * @param {string} key - The keyword used for decoding, supporting both uppercase and lowercase.
 * @returns {string} - The decoded original string.
 */
function keywordDecode(string, key) {
    // Normalize the key to ensure unique characters
    let uniqueKey = key.split('').filter((item, pos, self) => self.indexOf(item) === pos).join('');
    let upperKey = uniqueKey.toUpperCase();
    let lowerKey = uniqueKey.toLowerCase();

    // Create the translation string
    let transUpper = upperKey + alphabet.slice(1, 27).replace(new RegExp(`[${upperKey}]`, 'g'), '');
    let transLower = lowerKey + alphabet.slice(27).replace(new RegExp(`[${lowerKey}]`, 'g'), '');
    let trans = transUpper + transLower;

    // Reverse translate the string using the custom alphabet
    return string.replace(new RegExp(`[${trans}]`, 'g'), function (c) {
        return alphabet[trans.indexOf(c)];
    });
}


// ROT Text
const rotButtons    = document.getElementsByClassName("rot-link");
const rotPrevious   = document.getElementById("rotPrev");
const rotNext       = document.getElementById("rotNext");
const rotKey        = document.getElementById("rotKey");

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
    if(rotKey.value.length > 0) {
        document.getElementById("rotResults").textContent = rot(rotResults, parseInt(rotNumber), getCustomAlphabet(rotKey.value));
    } else {
        document.getElementById("rotResults").textContent = rot(rotResults, parseInt(rotNumber));
    }
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


// Beaufort cipher
const beaufortEncryptButton = document.getElementById("beaufortEncrypt");
beaufortEncryptButton.addEventListener("click", function() {
    const beaufortString = document.getElementById("beaufortText");
    const beaufortKey = document.getElementById("beaufortKey");

    if(!emptyContainerCheck(beaufortString.value, beaufortString)) {
        return false;
    }
    if (!largeDataWarning(beaufortString.value, beaufortString)) {
        return false;
    }

    document.getElementById("beaufortResults").textContent = beaufortCipher(beaufortString.value, beaufortKey.value);
});
const beaufortDecryptButton = document.getElementById("beaufortDecrypt");
beaufortDecryptButton.addEventListener("click", function() {
    const beaufortString = document.getElementById("beaufortText");
    const beaufortKey = document.getElementById("beaufortKey");

    if(!emptyContainerCheck(beaufortString.value, beaufortString)) {
        return false;
    }
    if (!largeDataWarning(beaufortString.value, beaufortString)) {
        return false;
    }

    document.getElementById("beaufortResults").textContent = beaufortCipher(beaufortString.value, beaufortKey.value);
});


// Keyword cipher
const keywordEncryptButton = document.getElementById("keywordEncrypt");
if(keywordEncryptButton) {
    keywordEncryptButton.addEventListener("click", function () {
        const keywordString = document.getElementById("keywordText");
        const keywordKey = document.getElementById("keywordKey");

        if (!emptyContainerCheck(keywordString.value, keywordString)) {
            return false;
        }
        if (!largeDataWarning(keywordString.value, keywordString)) {
            return false;
        }

        document.getElementById("keywordResults").textContent = keywordEncode(keywordString.value, keywordKey.value);
    });
}
const keywordDecryptButton = document.getElementById("keywordDecrypt");
if(keywordDecryptButton) {
    keywordDecryptButton.addEventListener("click", function () {
        const keywordString = document.getElementById("keywordText");
        const keywordKey = document.getElementById("keywordKey");
    
        if (!emptyContainerCheck(keywordString.value, keywordString)) {
            return false;
        }
        if (!largeDataWarning(keywordString.value, keywordString)) {
            return false;
        }
    
        document.getElementById("keywordResults").textContent = keywordDecode(keywordString.value, keywordKey.value);
    });
}


// Atbash cipher
const atbashDecodeButton = document.getElementById("atbashDecode");
atbashDecodeButton.addEventListener("click", function() {
    const atbashString = document.getElementById("atbashText");

    if(!emptyContainerCheck(atbashString.value, atbashString)) {
        return false;
    }
    if (!largeDataWarning(atbashString.value, atbashString)) {
        return false;
    }

    document.getElementById("atbashResults").textContent = atbashCipher(atbashString.value);
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