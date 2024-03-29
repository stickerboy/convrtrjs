// Remove spaces
function stripSpaces(string) {
    return string.replace(/ /g, "");
}

// Uppercase string
function uppercase(string) {
    return string.toLocaleUpperCase();
}

// Lowercase string
function lowercase(string) {
    return string.toLocaleLowerCase();
}

// Numbers only
function numbersOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^0-9 ]/g : /[^0-9]/g;
    return string.replace(regex, "");
}

// Letters only
function lettersOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Za-z ]/g : /[^A-Za-z]/g;
    return string.replace(regex, "");
}

// Capital letters only
function lettersOnlyCap(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Z ]/g : /[^A-Z]/g;
    return string.replace(regex, "");
}

// Lowercase letters only
function lettersOnlyLow(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^a-z ]/g : /[^a-z]/g;
    return string.replace(regex, "");
}

// Remove special characters
function stripSpecialChars(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^0-9A-Za-z ]/g : /[^0-9A-Za-z]/g;
    return string.replace(regex, "");
}

// Remove all letters
function stripLetters(string) {
    return string.replace(/[A-Za-z]/g, "");
}

// Remove all numbers
function stripNumbers(string) {
    return string.replace(/[0-9]/g, "");
}

// Special characters only
function specialCharsOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[0-9A-Za-z]/g : /[0-9A-Za-z ]/g;
    return string.replace(regex, "");
}

// URL encode
function urlEncode(string) {
    return encodeURIComponent(string).replace(/%20/g, "+");
}

// URL decode
function urlDecode(string) {
    return decodeURIComponent(string).replace(/\+/g, " ");
}

// Convert letters to their alphabet number: A = 1, B = 2, Z = 26
function lettersToNumbers(string) {
    string = lettersOnly(string);
    const numbers = [];
    string.split("").forEach((s) => { 
        numbers.push(s.toLowerCase().charCodeAt(0) - 97 + 1);
    });
    return numbers.join(" ");
}