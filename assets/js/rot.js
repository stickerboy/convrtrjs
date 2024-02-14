// Co-pilot assisted
function rot(string, n, alpha) {
    if (n == null) {
        // Use ROT-13 by default
        n = -13;
    }
    n = Number(n);
    string = String(string);
    if (n === 0) {
        return string;
    }
    if (n < 0) {
        // Decode instead of encode
        n += 26;
    }
    const ab = alpha ? alpha : alphabet.substring(1);
    const length = ab.length;
    let result = "";

    for (const char of string) {
        if (isLetter(char)) {
            const currentPosition = ab.indexOf(char.toUpperCase());
            let shiftedPosition = (currentPosition + n) % length;
            let shiftedChar = ab.charAt(shiftedPosition);

            if (isUpperCase(char)) {
                result += shiftedChar.toUpperCase();
            } else {
                result += shiftedChar.toLowerCase();
            }
        } else {
            result += char;
        }
    }
    return result;
}