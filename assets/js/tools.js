// Remove spaces
function stripSpaces(string) {
    return string.replace(/ /gi, "");
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
    let regex = preserveSpaces === true ? /[^a-z ]/gi : /[^a-z]/gi;
    return string.replace(regex, "");
}

// Capital letters only
function lettersOnlyCap(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^A-Z ]/g : /[A-Z]/g;
    return string.replace(regex, "");
}

// Lowercase letters only
function lettersOnlyLow(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^a-z ]/g : /[^a-z]/g;
    return string.replace(regex, "");
}

// Remove special characters
function stripSpecialChars(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[^a-z0-9 ]/gi : /[^a-z0-9]/gi;
    return string.replace(regex, "");
}

// Remove all letters
function stripLetters(string) {
    return string.replace(/[a-z]/gi, "");
}

// Remove all numbers
function stripNumbers(string) {
    return string.replace(/[0-9]/g, "");
}

// Special characters only
function specialCharsOnly(string, preserveSpaces) {
    let regex = preserveSpaces === true ? /[a-z0-9]/gi : /[a-z0-9 ]/gi;
    return string.replace(regex, "");
}

// URL encode
function urlEncode(string) {
    return encodeURIComponent(string).replace(/%20/gi, "+");
}

// URL decode
function urlDecode(string) {
    return decodeURIComponent(string).replace(/\+/gi, " ");
}
