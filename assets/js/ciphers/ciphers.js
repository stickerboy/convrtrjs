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
 * Generates a hash for the given string based on the specified hash method.
 *
 * @param {string} string - The input string to be hashed.
 * @param {string} hash - The hash method to be used (e.g., "MD5", "SHA1", etc.).
 * @returns {string} - The generated hash value or an error message if the method is invalid or not supported.
 *
 * @example
 * // Input: "Hello, World!" with hash method "MD5"
 * // Output: "65a8e27d8879283831b664bd8b7f0ad4"
 */
function generateHashes(string, hash) {
    const hashFunctions = {
        MD5: CryptoJS.MD5,
        SHA1: CryptoJS.SHA1,
        SHA256: CryptoJS.SHA256,
        SHA512: CryptoJS.SHA512,
        SHA3512: string => CryptoJS.SHA3(string, { outputLength: 512 }),
        SHA3384: string => CryptoJS.SHA3(string, { outputLength: 384 }),
        SHA3256: string => CryptoJS.SHA3(string, { outputLength: 256 }),
        SHA3224: string => CryptoJS.SHA3(string, { outputLength: 224 })
    };

    const selectedHashFunction = hashFunctions[hash];
    return selectedHashFunction ? selectedHashFunction(string).toString() : "Invalid hash method provided or not supported";
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
 * // Output: "Rijvs Uyvjn!"
 */
function vignereEncrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            const keyChar = key[j % key.length];
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 + keyChar.toUpperCase().charCodeAt(0) - 65) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) - 97 + keyChar.toLowerCase().charCodeAt(0) - 97) % 26 + 97);
            }
            j++;
        } else {
            result += c;
        }
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
 * // Input: "Rijvs Uyvjn!" with key "KEY"
 * // Output: "Hello, World!"
 */
function vignereDecrypt(string, key) {
    let result = "";

    for (let i = 0, j = 0; i < string.length; i++) {
        const c = string.charAt(i);
        if (isLetter(c)) {
            const keyChar = key[j % key.length];
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - keyChar.toUpperCase().charCodeAt(0) + 26) % 26 + 65);
            } else {
                result += String.fromCharCode((c.charCodeAt(0) - keyChar.toLowerCase().charCodeAt(0) + 26) % 26 + 97);
            }
            j++;
        } else {
            result += c;
        }
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
 * // Output: Danzq Cwnnh!
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

/**
 * Encodes a string using the Rail Fence Cipher.
 *
 * @param {string} string - The input string to encode.
 * @param {number} rails - The number of rails for the Rail Fence Cipher.
 * @returns {string} - The encoded string.
 */
function railFenceEncode(string, rails) {
    if(rails < 2) {
        throw new Error("A minimum of 2 rails is required to make the cipher work effectively");
    }

    string = string = lettersOnly(string);
    const railStrings = Array.from({ length: rails }, () => []);

    let rail = 0;
    let direction = 1;

    for (let i = 0; i < string.length; i++) {
        railStrings[rail].push(string[i]);
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
            direction *= -1;  // Change direction at the top and bottom
        }
    }

    return railStrings.flat().join('');
}

/**
 * Decodes a string encoded with the Rail Fence Cipher.
 *
 * @param {string} string - The encoded string to decode.
 * @param {number} rails - The number of rails used for the Rail Fence Cipher.
 * @returns {string} - The decoded original string.
 */
function railFenceDecode(string, rails) {
    if(rails < 2) {
        throw new Error("A minimum of 2 rails is required to make the cipher work effectively");
    }

    string = lettersOnly(string);
    const railLengths = Array.from({ length: rails }, () => 0);

    let rail = 0;
    let direction = 1;

    // Determine the length of each rail
    for (let i = 0; i < string.length; i++) {
        railLengths[rail]++;
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
            direction *= -1;
        }
    }

    // Fill the rails with characters from the encoded string
    const railStrings = Array.from({ length: rails }, (_, i) => string.slice(i > 0 ? railLengths.slice(0, i).reduce((a, b) => a + b, 0) : 0, railLengths.slice(0, i + 1).reduce((a, b) => a + b, 0)).split(''));

    // Reconstruct the original message by reading the rails in the correct order
    let decoded = '';
    rail = 0;
    direction = 1;

    for (let i = 0; i < string.length; i++) {
        if (railStrings[rail].length) {
            decoded += railStrings[rail].shift();
        }
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
            direction *= -1;
        }
    }
    return decoded;
}

/**
 * Rotates the wheel by a given number of steps.
 *
 * @param {Array} wheel - The wheel array to rotate.
 * @param {number} steps - The number of steps to rotate.
 * @returns {Array} - The rotated wheel.
 */
function rotateWheel(wheel, steps) {
    if (steps < 0) {
        steps = wheel.length + steps;
    }
    return wheel.slice(steps).concat(wheel.slice(0, steps));
}

/**
 * Encodes a string using the Chaocipher algorithm.
 *
 * @param {string} string - The input string to encode.
 * @param {number} [inc_a=0] - The increment for rotating the left wheel.
 * @param {number} [del_a=1] - The position for deletion and re-insertion in the left wheel.
 * @param {number} [inc_b=1] - The increment for rotating the right wheel.
 * @param {number} [del_b=2] - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The encoded string.
 */
function chaocipherEncode(string, inc_a = 0, del_a = 1, inc_b = 1, del_b = 2) {
    return runChaocipher(lettersOnly(string), "encode", inc_a, del_a, inc_b, del_b);
}

/**
 * Decodes a string using the Chaocipher algorithm.
 *
 * @param {string} string - The input string to decode.
 * @param {number} [inc_a=1] - The increment for rotating the left wheel.
 * @param {number} [del_a=2] - The position for deletion and re-insertion in the left wheel.
 * @param {number} [inc_b=0] - The increment for rotating the right wheel.
 * @param {number} [del_b=1] - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The decoded string.
 */
function chaocipherDecode(string, inc_a = 1, del_a = 2, inc_b = 0, del_b = 1) {
    return runChaocipher(string, "decode", inc_a, del_a, inc_b, del_b);
}

/**
 * The core function that performs encoding or decoding using the Chaocipher algorithm.
 *
 * @param {string} string - The input string to process.
 * @param {string} mode - The mode ('encode' or 'decode') to determine the operation.
 * @param {number} inc_a - The increment for rotating the left wheel.
 * @param {number} del_a - The position for deletion and re-insertion in the left wheel.
 * @param {number} inc_b - The increment for rotating the right wheel.
 * @param {number} del_b - The position for deletion and re-insertion in the right wheel.
 * @returns {string} - The processed (encoded or decoded) string.
 */
function runChaocipher(string, mode, inc_a, del_a, inc_b, del_b) {
    let left = ["H","X","U","C","Z","V","A","M","D","S","L","K","P","E","F","J","R","I","G","T","W","O","B","N","Y","Q"];
    let right = ["P","T","L","N","B","Q","D","E","O","Y","S","F","A","V","Z","K","G","J","R","I","H","W","X","U","M","C"];

    if (mode === "decode") {
        [left, right] = [right, left];
    }

    return Array.from(string).map(char => {
        if (/[A-Za-z]/.test(char)) {
            const index = right.indexOf(char.toUpperCase());
            let out = left[index];
            out = isUpperCase(char) ? out : out.toLowerCase();

            left = rotateWheel(left, index + inc_a);
            const delIndexA = (del_a < 0) ? left.length + del_a : del_a;
            left.splice(13, 0, left.splice(delIndexA, 1)[0]);

            right = rotateWheel(right, index + inc_b);
            const delIndexB = (del_b < 0) ? right.length + del_b : del_b;
            right.splice(13, 0, right.splice(delIndexB, 1)[0]);

            return out;
        }
        return char;
    }).join("");
}


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

    document.getElementById("substitutionResults").textContent = substituteChars(subResults, subKey.value);
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
    document.getElementById("vigenereResults").textContent = vignereEncrypt(vigResults, vigenereKey.value);
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
    document.getElementById("vigenereResults").textContent = vignereDecrypt(vigResults, vigenereKey.value);
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
    document.getElementById("keywordResults").textContent = keywordEncode(kwResults, keywordKey.value);
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
    document.getElementById("keywordResults").textContent = keywordDecode(kwResults, keywordKey.value);
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
    document.getElementById("beaufortResults").textContent = beaufortCipher(beaufortString.value, beaufortKey.value);
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
    document.getElementById("beaufortResults").textContent = beaufortCipher(beaufortString.value, beaufortKey.value);
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
    document.getElementById("railResults").textContent = railFenceEncode(railString.value, railAmount.value);
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
    document.getElementById("railResults").textContent = railFenceDecode(railString.value, railAmount.value);
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

    document.getElementById("chaocipherResults").textContent = chaocipherEncode(chaosResults);
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

    document.getElementById("chaocipherResults").textContent = chaocipherDecode(chaosResults);
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

    document.getElementById("atbashResults").textContent = atbashCipher(atbashResults);
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
                <td>${generateHashes(hashString.value, type)}&nbsp;</td>
            </tr>`
        );
    });
});
