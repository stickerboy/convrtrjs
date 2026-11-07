import { graphemes } from '../toolkit.js';

// The codes Braille can be written in. Unified English Braille (UEB) is what English readers learn and most charts
// show; this is its uncontracted form, letter by letter, without grade 2's shortened words. Braille ASCII is the
// computer code used in Braille files and embossers: one cell for each character, and no capitals.
export const BRAILLE_CODES = {
    ueb: "Unified English Braille",
    ascii: "Braille ASCII",
};

// ---- Braille ASCII: each cell and its character, both ways

const ASCII_PAIRS = [[" ", " "], ["⠸", "_"], ["⠤", "-"], ["⠠", ","], ["⠰", ";"], ["⠱", ":"], ["⠮", "!"], ["⠹", "?"], ["⠨", "."], ["⠷", "("], ["⠪", "["], ["⠈", "@"], ["⠡", "*"], ["⠌", "/"], ["⠄", "'"], ["⠐", "\""], ["⠳", "\\"], ["⠯", "&"], ["⠩", "%"], ["⠘", "^"], ["⠬", "+"], ["⠣", "<"], ["⠜", ">"], ["⠫", "$"], ["⠴", "0"], ["⠂", "1"], ["⠆", "2"], ["⠒", "3"], ["⠲", "4"], ["⠢", "5"], ["⠖", "6"], ["⠶", "7"], ["⠦", "8"], ["⠔", "9"], ["⠁", "A"], ["⠃", "B"], ["⠉", "C"], ["⠙", "D"], ["⠑", "E"], ["⠋", "F"], ["⠛", "G"], ["⠓", "H"], ["⠊", "I"], ["⠚", "J"], ["⠅", "K"], ["⠇", "L"], ["⠍", "M"], ["⠝", "N"], ["⠕", "O"], ["⠏", "P"], ["⠟", "Q"], ["⠗", "R"], ["⠎", "S"], ["⠞", "T"], ["⠥", "U"], ["⠧", "V"], ["⠺", "W"], ["⠭", "X"], ["⠵", "Z"], ["⠻", "]"], ["⠼", "#"], ["⠽", "Y"], ["⠾", ")"], ["⠿", "="]];
const ASCII_TO_BRAILLE = new Map(ASCII_PAIRS.map(([cell, char]) => [char, cell]));
// The blank cell is a space too
const ASCII_FROM_BRAILLE = new Map([...ASCII_PAIRS, ["⠀", " "]]);

// ---- Unified English Braille, from the liblouis UEB tables (en-ueb-chardefs.uti and en-ueb-g1.ctb)

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const LETTER_CELLS = "⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵";
const LETTER_TO_CELL = new Map([...LETTERS].map((letter, i) => [letter, LETTER_CELLS[i]]));
const CELL_TO_LETTER = new Map([...LETTERS].map((letter, i) => [LETTER_CELLS[i], letter]));
// Digits are the first ten letters, after the numeric indicator: 1 is a, 0 is j
const DIGIT_TO_CELL = new Map([..."1234567890"].map((digit, i) => [digit, LETTER_CELLS[i]]));
const CELL_TO_DIGIT = new Map([..."1234567890"].map((digit, i) => [LETTER_CELLS[i], digit]));

const CAPITAL = "⠠";
const CAPITAL_WORD = "⠠⠠";
const CAPITAL_PASSAGE = "⠠⠠⠠";
const CAPITAL_END = "⠠⠄";
const NUMERIC = "⠼";
// Says the next cell is a letter or symbol, not a digit or a different symbol sharing its cell
const GRADE_1 = "⠰";

// Accents, written before their letter: é is ⠘⠌⠑
const ACCENTS = [
    ["́", "⠘⠌"], // acute
    ["̀", "⠘⠡"], // grave
    ["̂", "⠘⠩"], // circumflex
    ["̈", "⠘⠒"], // diaeresis
    ["̃", "⠘⠻"], // tilde
    ["̧", "⠘⠯"], // cedilla
    ["̊", "⠘⠫"], // ring
    ["̌", "⠘⠬"], // caron
    ["̄", "⠈⠤"], // macron
    ["̆", "⠈⠬"], // breve
];
const ACCENT_TO_CELLS = new Map(ACCENTS);
const CELLS_TO_ACCENT = new Map(ACCENTS.map(([mark, cells]) => [cells, mark]));

// Letters that aren't an English letter with accents: their cells, lowercase
const OTHER_LETTERS = [["ß", "⠨⠮"], ["ø", "⠈⠡⠕"], ["æ", "⠁⠘⠖⠑"], ["œ", "⠕⠘⠖⠑"]];
const OTHER_TO_CELLS = new Map(OTHER_LETTERS);

// Punctuation and signs with one way of writing them. ? and " depend on where they are, so are worked out in
// uebSymbol, as is ’, which is also an apostrophe.
const SYMBOLS = [
    [",", "⠂"], [";", "⠆"], [":", "⠒"], [".", "⠲"], ["!", "⠖"], ["'", "⠄"], ["-", "⠤"],
    ["(", "⠐⠣"], [")", "⠐⠜"], ["[", "⠨⠣"], ["]", "⠨⠜"], ["{", "⠸⠣"], ["}", "⠸⠜"],
    ["/", "⠸⠌"], ["\\", "⠸⠡"], ["&", "⠈⠯"], ["@", "⠈⠁"], ["#", "⠸⠹"], ["%", "⠨⠴"], ["*", "⠐⠔"],
    ["+", "⠐⠖"], ["=", "⠐⠶"], ["<", "⠈⠣"], [">", "⠈⠜"], ["$", "⠈⠎"], ["_", "⠨⠤"], ["^", "⠈⠢"],
    ["~", "⠈⠔"], ["|", "⠸⠳"], ["£", "⠈⠇"], ["€", "⠈⠑"], ["¢", "⠈⠉"], ["¥", "⠈⠽"], ["°", "⠘⠚"],
    ["×", "⠐⠦"], ["÷", "⠐⠌"], ["—", "⠠⠤"], ["“", "⠦"], ["”", "⠴"], ["‘", "⠠⠦"], ["«", "⠸⠦"],
    ["»", "⠸⠴"], ["¿", "⠘⠰⠦"], ["¡", "⠘⠰⠖"], ["§", "⠘⠎"], ["©", "⠘⠉"], ["®", "⠘⠗"], ["™", "⠘⠞"],
    ["•", "⠸⠲"], ["¶", "⠘⠏"],
];
// Written the same as another, so only read back as that one
const SAME_AS = [["–", "—"], ["…", "..."]];
const SYMBOL_TO_CELLS = new Map([...SYMBOLS, ...SAME_AS.map(([char, as]) => [char, [...as].map((c) => SYMBOLS.find(([s]) => s === c)[1]).join("")])]);
// Reading Braille back: the symbols written with more than one cell, longest first, so ⠘⠰⠦ is found before ⠘⠰.
// ⠦ is ? or “, and is worked out in readUeb.
const CELLS_TO_SYMBOL = new Map([...SYMBOLS.filter(([char]) => char !== "“"), ["’", "⠠⠴"], ["\"", "⠠⠶"]].map(([char, cells]) => [cells, char]));
const LONGEST_SYMBOL = Math.max(...[...CELLS_TO_SYMBOL.keys()].map((cells) => cells.length));

/**
 * Whether a character is a space, tab or new line, which stay as they are.
 *
 * @param {string} char - The character.
 * @returns {boolean} True for whitespace.
 */
const isSpace = (char) => /^\s+$/u.test(char);

/**
 * Lists characters left out, once each, in the order first seen.
 *
 * @returns {{add: (char: string) => void, all: string[]}} Adds a character, and the list so far.
 */
function leftOut() {
    const seen = new Set();
    return { add: (char) => seen.add(char), get all() { return [...seen]; } };
}

/**
 * Takes the accents off a character: "é" gives "e". Characters without any stay as they are.
 *
 * @param {string} char - The character.
 * @returns {string} The character without its accents.
 */
const withoutAccents = (char) => char.normalize("NFD").replace(/\p{M}/gu, "");

/**
 * Writes text in Braille ASCII: one cell for each character, accents taken off, and capitals as other letters.
 *
 * @param {string} text - The text.
 * @param {{add: (char: string) => void}} missing - Where characters with no cell are listed.
 * @returns {string} The Braille.
 */
function writeAscii(text, missing) {
    // Each different character is looked up once: most texts use only a few
    const cells = new Map();
    return graphemes(text).map((char) => {
        let cell = cells.get(char);
        if (cell === undefined) {
            cell = isSpace(char) ? char : ASCII_TO_BRAILLE.get(withoutAccents(char).toUpperCase()) ?? null;
            cells.set(char, cell);
        }
        if (cell === null) {
            missing.add(char);
        }
        return cell ?? "";
    }).join("");
}

/**
 * Reads Braille ASCII back, in capitals, as it has no lowercase.
 *
 * @param {string} braille - The Braille.
 * @param {{add: (char: string) => void}} missing - Where cells that aren't Braille ASCII are listed.
 * @returns {string} The text.
 */
function readAscii(braille, missing) {
    return [...braille].map((cell) => {
        if (isSpace(cell)) {
            return cell;
        }
        const char = ASCII_FROM_BRAILLE.get(cell);
        if (char === undefined) {
            missing.add(cell);
        }
        return char ?? "";
    }).join("");
}

/**
 * Splits a character into what UEB writes for it as a letter: its base letter, lowercase, and the cells of its accents,
 * or nothing if it isn't a letter UEB can write.
 *
 * @param {string} char - The character, as seen (see graphemes), so an accent comes with its letter.
 * @returns {{cells: string, upper: boolean}|null} The letter's cells, without a capital sign, and whether it's a
 *   capital; null if it isn't a letter UEB can write.
 */
function uebLetter(char) {
    // Texts use few different characters, so each is worked out once
    let letter = letterCache.get(char);
    if (letter === undefined) {
        if (letterCache.size > 10_000) {
            letterCache.clear();
        }
        letter = findUebLetter(char);
        letterCache.set(char, letter);
    }
    return letter;
}
const letterCache = new Map();

/**
 * Works out what UEB writes for a character as a letter, for uebLetter.
 *
 * @param {string} char - The character.
 * @returns {{cells: string, upper: boolean}|null} The letter's cells and whether it's a capital, or null.
 */
function findUebLetter(char) {
    const lower = char.toLowerCase();
    const upper = lower !== char;
    const other = OTHER_TO_CELLS.get(lower);
    if (other) {
        return { cells: other, upper };
    }
    const [base, ...marks] = lower.normalize("NFD");
    if (!LETTER_TO_CELL.has(base) || marks.some((mark) => !ACCENT_TO_CELLS.has(mark))) {
        return null;
    }
    return { cells: marks.map((mark) => ACCENT_TO_CELLS.get(mark)).join("") + LETTER_TO_CELL.get(base), upper };
}

/**
 * Writes one punctuation mark or sign in UEB, from where it is in its word.
 *
 * @param {string[]} chars - The word's characters.
 * @param {number} i - Where the character is.
 * @returns {string|undefined} The cells, or undefined if UEB has none for it here.
 */
function uebSymbol(chars, i) {
    const char = chars[i];
    const before = chars[i - 1];
    const after = chars[i + 1];
    switch (char) {
        case "?":
            // After a word, ⠦; on its own it could be an opening quote, so the grade 1 indicator says it isn't
            return before === undefined ? GRADE_1 + "⠦" : "⠦";
        case "\"":
            // Opening at the start of a word, closing after one, and the quote that's neither when on its own
            if (before === undefined && after !== undefined) {
                return "⠦";
            }
            return before !== undefined ? "⠴" : "⠠⠶";
        case "’":
            // Between letters, an apostrophe (don’t); otherwise a closing quote
            return before && after && uebLetter(before) && uebLetter(after) ? "⠄" : "⠠⠴";
        default:
            return SYMBOL_TO_CELLS.get(char);
    }
}

/**
 * Splits a word into runs of letters, so each can be given its capitals: letters joined by apostrophes are one run, so
 * DON'T is one word in capitals.
 *
 * @param {string[]} chars - The word's characters.
 * @returns {Map<number, boolean>} Where each run starts, and whether it's all capitals with at least two letters.
 */
function capitalRuns(chars) {
    const runs = new Map();
    let i = 0;
    while (i < chars.length) {
        if (!uebLetter(chars[i])) {
            i++;
            continue;
        }
        const start = i;
        const letters = [];
        while (i < chars.length && (uebLetter(chars[i]) || (/^['’]$/.test(chars[i]) && chars[i + 1] && uebLetter(chars[i + 1])))) {
            const letter = uebLetter(chars[i]);
            if (letter) {
                letters.push(letter);
            }
            i++;
        }
        runs.set(start, letters.length > 1 && letters.every((letter) => letter.upper));
        // Every letter up to the run's end is in it
        for (let j = start + 1; j < i; j++) {
            runs.set(j, null);
        }
    }
    return runs;
}

/**
 * Whether a word is in capitals: it has a letter, and every letter in it is a capital. Three such words in a row are a
 * capitals passage.
 *
 * @param {string[]} chars - The word's characters.
 * @returns {boolean} True if the word has letters, all capitals.
 */
function isCapitalWord(chars) {
    const letters = chars.map(uebLetter).filter(Boolean);
    return letters.length > 0 && letters.every((letter) => letter.upper);
}

/**
 * Writes one word (text between spaces) in UEB.
 *
 * @param {string[]} chars - The word's characters.
 * @param {boolean} inPassage - Whether it's in a capitals passage, where capitals need no signs.
 * @param {{add: (char: string) => void}} missing - Where characters UEB can't write are listed.
 * @returns {string} The word's cells.
 */
function writeUebWord(chars, inPassage, missing) {
    const runs = capitalRuns(chars);
    let out = "";
    let numeric = false;
    let capitalWord = false;
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        // Digits, with . and , inside a number, follow one numeric indicator
        if (DIGIT_TO_CELL.has(char)) {
            out += (numeric ? "" : NUMERIC) + DIGIT_TO_CELL.get(char);
            numeric = true;
            continue;
        }
        if (numeric && (char === "." || char === ",") && DIGIT_TO_CELL.has(chars[i + 1])) {
            out += SYMBOL_TO_CELLS.get(char);
            continue;
        }
        const wasNumeric = numeric;
        numeric = false;

        const letter = uebLetter(char);
        if (letter) {
            if (runs.get(i) !== undefined && runs.get(i) !== null) {
                // A run of letters starts: in capitals as a whole, or letter by letter
                capitalWord = runs.get(i) === true;
                if (capitalWord && !inPassage) {
                    out += CAPITAL_WORD;
                }
            }
            if (letter.upper && !capitalWord && !inPassage) {
                out += CAPITAL;
            } else if (wasNumeric && CELL_TO_DIGIT.has(letter.cells[0])) {
                // a to j straight after a number would read as digits
                out += GRADE_1;
            }
            out += letter.cells;
            continue;
        }
        if (!/^['’]$/.test(char)) {
            capitalWord = false;
        }
        const cells = uebSymbol(chars, i);
        if (cells === undefined) {
            missing.add(char);
            continue;
        }
        out += cells;
    }
    return out;
}

/**
 * Writes text in uncontracted Unified English Braille: capital signs, numeric indicators, accents before their letter,
 * and three or more words in capitals as a capitals passage. Spaces, tabs and new lines stay as they are.
 *
 * @param {string} text - The text.
 * @param {{add: (char: string) => void}} missing - Where characters UEB can't write are listed.
 * @returns {string} The Braille.
 */
function writeUeb(text, missing) {
    const parts = text.split(/(\s+)/u);
    const words = parts.map((part, i) => (i % 2 === 0 ? graphemes(part) : null));
    // Runs of three or more words in capitals, by where the words are in parts
    const passage = new Map();
    for (let i = 0; i < parts.length; i += 2) {
        let end = i;
        while (end < parts.length && words[end].length > 0 && isCapitalWord(words[end])) {
            end += 2;
        }
        if ((end - i) / 2 >= 3) {
            for (let j = i; j < end; j += 2) {
                passage.set(j, j === i ? "start" : j === end - 2 ? "end" : "in");
            }
            i = end - 2;
        }
    }
    return parts.map((part, i) => {
        if (i % 2 === 1) {
            return part;
        }
        const place = passage.get(i);
        const cells = writeUebWord(words[i], place !== undefined, missing);
        return (place === "start" ? CAPITAL_PASSAGE : "") + cells + (place === "end" ? CAPITAL_END : "");
    }).join("");
}

/**
 * Reads uncontracted Unified English Braille back to text, following its capital signs, numeric indicators and accents.
 *
 * @param {string} braille - The Braille.
 * @param {{add: (char: string) => void}} missing - Where cells that can't be read are listed.
 * @returns {string} The text.
 */
function readUeb(braille, missing) {
    const cells = [...braille];
    let out = "";
    let numeric = false;
    let capital = false;
    let capitalWord = false;
    let passage = false;
    let accents = "";
    let i = 0;

    /**
     * The next n cells from a place, joined.
     *
     * @param {number} from - Where to start.
     * @param {number} n - How many cells.
     * @returns {string} The cells.
     */
    const ahead = (from, n) => {
        let joined = "";
        for (let j = from; j < from + n && j < cells.length; j++) {
            joined += cells[j];
        }
        return joined;
    };
    /**
     * Which of the letters that aren't an English letter with accents starts at a place, such as ß.
     *
     * @param {number} from - Where to look.
     * @returns {string[]|undefined} The letter and its cells, or undefined if there's none.
     */
    const otherAt = (from) => OTHER_LETTERS.find(([, cellsOf]) => cells[from] === cellsOf[0] && ahead(from, cellsOf.length) === cellsOf);
    /**
     * Whether a letter, with or without accents, starts at a place: a capital sign only goes before one.
     *
     * @param {number} from - Where to look.
     * @returns {boolean} True if a letter starts there.
     */
    const isLetterAt = (from) => CELL_TO_LETTER.has(cells[from]) || CELLS_TO_ACCENT.has(ahead(from, 2)) || otherAt(from) !== undefined;
    /**
     * Adds a letter, with any accents read before it, and in capitals if a capital sign says so.
     *
     * @param {string} letter - The letter, lowercase.
     * @returns {void}
     */
    const addLetter = (letter) => {
        const char = accents ? (letter + accents).normalize("NFC") : letter;
        out += capital || capitalWord || passage ? char.toUpperCase() : char;
        capital = false;
        accents = "";
    };

    while (i < cells.length) {
        const cell = cells[i];
        if (cell === "⠀" || isSpace(cell)) {
            out += cell === "⠀" ? " " : cell;
            numeric = capital = capitalWord = false;
            i++;
            continue;
        }
        // Capitals: a passage, a word, the end of either, then a single letter
        if (cell === CAPITAL) {
            if (ahead(i, 3) === CAPITAL_PASSAGE) {
                passage = true;
                i += 3;
                continue;
            }
            const next = cells[i + 1];
            if (next === "⠄") {
                passage = capitalWord = false;
                i += 2;
                continue;
            }
            if (next === CAPITAL) {
                capitalWord = true;
                numeric = false;
                i += 2;
                continue;
            }
            if (isLetterAt(i + 1)) {
                capital = true;
                numeric = false;
                i++;
                continue;
            }
        }
        if (cell === NUMERIC) {
            numeric = true;
            i++;
            continue;
        }
        if (numeric) {
            if (CELL_TO_DIGIT.has(cell)) {
                out += CELL_TO_DIGIT.get(cell);
                i++;
                continue;
            }
            // . and , carry on the number when a digit follows
            if ((cell === "⠲" || cell === "⠂") && CELL_TO_DIGIT.has(cells[i + 1])) {
                out += cell === "⠲" ? "." : ",";
                i++;
                continue;
            }
            numeric = false;
        }
        if (cell === GRADE_1) {
            // Before ⠦, a question mark rather than an opening quote; before a letter, only says it's a letter
            if (cells[i + 1] === "⠦") {
                out += "?";
                i += 2;
            } else {
                i++;
            }
            continue;
        }
        const other = otherAt(i);
        if (other) {
            addLetter(other[0]);
            i += other[1].length;
            continue;
        }
        if (CELL_TO_LETTER.has(cell)) {
            addLetter(CELL_TO_LETTER.get(cell));
            i++;
            continue;
        }
        const accent = CELLS_TO_ACCENT.get(ahead(i, 2));
        if (accent && isLetterAt(i + 2)) {
            accents += accent;
            i += 2;
            continue;
        }
        // A capital word ends at anything that isn't a letter or an apostrophe
        if (cell !== "⠄") {
            capitalWord = false;
        }
        let symbol;
        for (let n = LONGEST_SYMBOL; n > 0 && symbol === undefined; n--) {
            const char = CELLS_TO_SYMBOL.get(ahead(i, n));
            if (char !== undefined) {
                symbol = [char, n];
            }
        }
        if (symbol) {
            out += symbol[0];
            i += symbol[1];
            continue;
        }
        if (cell === "⠦") {
            // An opening quote at the start of a word, before more; otherwise a question mark
            const startsWord = i === 0 || cells[i - 1] === "⠀" || isSpace(cells[i - 1]);
            const more = i + 1 < cells.length && cells[i + 1] !== "⠀" && !isSpace(cells[i + 1]);
            out += startsWord && more ? "“" : "?";
            i++;
            continue;
        }
        missing.add(cell);
        i++;
    }
    return out;
}

/**
 * Converts between Braille and text, and lists what couldn't be converted, which is left out.
 *
 * @param {string} string - The text or Braille to convert.
 * @param {string} [mode="braille"] - What the string is: "braille" reads Braille back to text, "text" writes text in
 *   Braille.
 * @param {string} [code="ueb"] - The Braille code (see BRAILLE_CODES): "ueb" or "ascii".
 * @returns {{text: string, missing: string[]}} The result, and each character or cell left out, once each.
 * @throws {Error} If the mode or code isn't one of those.
 *
 * @example
 * // Input: "Hi 2😀", "text"
 * // Output: { text: "⠠⠓⠊ ⠼⠃", missing: ["😀"] }
 */
export function translateBraille(string, mode = "braille", code = "ueb") {
    if (!(code in BRAILLE_CODES)) {
        throw new Error(`Invalid code "${code}". Use "ueb" or "ascii".`);
    }
    const missing = leftOut();
    let text;
    switch (mode) {
        case "braille":
            text = code === "ueb" ? readUeb(string, missing) : readAscii(string, missing);
            break;
        case "text":
            text = code === "ueb" ? writeUeb(string, missing) : writeAscii(string, missing);
            break;
        default:
            throw new Error(`Invalid mode "${mode}". Use "braille" or "text".`);
    }
    return { text, missing: missing.all };
}

/**
 * Converts between Braille and text, leaving out what can't be converted (see translateBraille, which lists it).
 *
 * @param {string} string - The text or Braille to convert.
 * @param {string} [mode="braille"] - What the string is: "braille" or "text".
 * @param {string} [code="ueb"] - The Braille code: "ueb" (Unified English Braille) or "ascii" (Braille ASCII).
 * @returns {string} The converted string.
 *
 * @example
 * // Input: "Hello", "text"
 * // Output: "⠠⠓⠑⠇⠇⠕"
 */
export function convertBraille(string, mode = "braille", code = "ueb") {
    return translateBraille(string, mode, code).text;
}
