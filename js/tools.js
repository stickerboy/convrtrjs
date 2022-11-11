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
function numbersOnly(string) {
    return string.replace(/[^0-9 ]/gi, "");
}

// Letters only
function lettersOnly(string) {
    return string.replace(/[^a-z ]/gi, "");
}

// Remove special characters
function stripSpecialChars(string) {
    return string.replace(/[^a-z0-9 ]/gi, "");
}

// Remove all letters
function stripLetters(string) {
    return string.replace(/[a-z ]/gi, "");
}

// Remove all numbers
function stripNumbers(string) {
    return string.replace(/[0-9 ]/gi, "");
}

// Special characters only
function specialCharsOnly(string) {
    return string.replace(/[a-z0-9]/gi, "");
}