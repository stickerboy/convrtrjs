import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as toolkit from "../../assets/js/lib/toolkit.js";
import * as strings from "../../assets/js/lib/strings.js";
import * as convrtrs from "../../assets/js/lib/text/convrtrs.js";
import { flipText } from "../../assets/js/lib/text/flip.js";
import { stringStats, characterFrequencies } from "../../assets/js/lib/text/frequencies.js";

describe("binary", () => {
    it("encodes text as space-separated bytes", () => {
        assert.equal(toolkit.stringToBinary("Hi"), "01001000 01101001");
    });
    it("decodes back", () => {
        assert.equal(convrtrs.binaryToString("01001000 01101001"), "Hi");
    });
    it("rejects input that isn't whole bytes", () => {
        assert.throws(() => convrtrs.binaryToString("0100100"), /divisible by 8/);
    });
    it("round-trips non-ASCII text", () => {
        assert.equal(convrtrs.binaryToString(toolkit.stringToBinary("Café ✓ 😀")), "Café ✓ 😀");
    });
    it("reads bits however they're spaced", () => {
        assert.equal(convrtrs.binaryToString("0100100001101001"), "Hi");
        assert.equal(convrtrs.binaryToString("01001000\n01101001"), "Hi");
        assert.equal(convrtrs.binaryToString("01001000, 01101001"), "Hi");
        assert.equal(convrtrs.binaryToString(""), "");
    });
    it("falls back to one character per byte when the bytes aren't UTF-8", () => {
        assert.equal(convrtrs.binaryToString("11101001"), "é"); // 0xE9 on its own is Latin-1 é
    });
    it("handles large input", () => {
        const text = "Hello, World! ".repeat(20000);
        assert.equal(convrtrs.binaryToString(toolkit.stringToBinary(text)), text);
    });
});

describe("bytesToString", () => {
    it("decodes UTF-8, falling back to Latin-1", () => {
        assert.equal(toolkit.bytesToString([0x48, 0xC3, 0xA9]), "Hé");
        assert.equal(toolkit.bytesToString([0x48, 0xE9]), "Hé");
        assert.equal(toolkit.bytesToString([]), "");
    });
});

describe("hex", () => {
    it("encodes with each delimiter", () => {
        assert.equal(toolkit.stringToHex("Hi", " "), "48 69");
        assert.equal(toolkit.stringToHex("Hi", ""), "4869");
        assert.equal(toolkit.stringToHex("Hi", "-"), "48-69");
        assert.equal(toolkit.stringToHex("Hi", "0x"), "0x480x69");
        assert.equal(toolkit.stringToHex("Hi", "\\x"), "\\x48\\x69");
        assert.equal(toolkit.stringToHex("Hi", "%"), "%48%69");
    });
    it("decodes whichever delimiter the hex uses", () => {
        for (const hex of ["48 69", "4869", "48-69", "48:69", "48,69", "48;69", "0x480x69", "\\x48\\x69", "%48%69", "0x48, 0x69", "48\n69"]) {
            assert.equal(toolkit.hexToString(hex), "Hi", hex);
        }
    });
    it("decodes what it encodes, with every delimiter", () => {
        for (const d of [" ", "-", ":", ",", "\\x", "0x", "0x, ", "%", ""]) {
            assert.equal(toolkit.hexToString(toolkit.stringToHex("Hello", d)), "Hello", d);
        }
    });
    it("ignores surrounding whitespace", () => {
        assert.equal(toolkit.hexToString(" 4869\n"), "Hi");
    });
    it("falls back to one character per byte when the bytes aren't UTF-8", () => {
        assert.equal(toolkit.hexToString("48 e9"), "Hé");
    });
    it("round-trips non-ASCII text (UTF-8)", () => {
        assert.equal(toolkit.hexToString(toolkit.stringToHex("Café ✓", " ")), "Café ✓");
    });
    it("rejects invalid hex", () => {
        assert.throws(() => toolkit.hexToString("4G 69"), /invalid characters/);
    });
});

describe("base64", () => {
    it("encodes and decodes", () => {
        assert.equal(toolkit.stringToBase64("Hello World"), "SGVsbG8gV29ybGQ=");
        assert.equal(convrtrs.base64ToString("SGVsbG8gV29ybGQ="), "Hello World");
    });
    it("handles non-ASCII text (UTF-8)", () => {
        assert.equal(toolkit.stringToBase64("✓"), "4pyT");
        assert.equal(convrtrs.base64ToString("4pyT"), "✓");
    });
    it("rejects invalid Base64", () => {
        assert.throws(() => convrtrs.base64ToString("not base64!"), /Not a valid Base64/);
    });
});

describe("decimal", () => {
    it("encodes and decodes ASCII", () => {
        assert.equal(toolkit.stringToDecimal("Hi"), "72 105");
        assert.equal(toolkit.decimalToString("72 105"), "Hi");
    });
    it("round-trips non-ASCII text", () => {
        assert.equal(toolkit.decimalToString(toolkit.stringToDecimal("Café ✓ 😀")), "Café ✓ 😀");
    });
    it("encodes one number per UTF-8 byte, like binary and hex", () => {
        assert.equal(toolkit.stringToDecimal("Hé"), "72 195 169");
    });
    it("decodes Latin-1 bytes and Unicode code points", () => {
        assert.equal(toolkit.decimalToString("233"), "é");
        assert.equal(toolkit.decimalToString("8364 49 48"), "€10");
        assert.equal(toolkit.decimalToString("128512"), "😀");
        assert.equal(toolkit.decimalToString("  72   105 "), "Hi");
        assert.equal(toolkit.decimalToString(""), "");
    });
    it("rejects values that aren't whole numbers in the Unicode range", () => {
        assert.throws(() => toolkit.decimalToString("72 abc"), /invalid values/);
        assert.throws(() => toolkit.decimalToString("72.5"), /invalid values/);
        assert.throws(() => toolkit.decimalToString("1114112"), /invalid values/);
    });
    it("ord and string2Dec return the Unicode code point", () => {
        assert.equal(toolkit.ord("A"), 65);
        assert.equal(toolkit.ord("é"), 233);
        assert.equal(toolkit.string2Dec("😀"), 128512);
    });
});

describe("morse", () => {
    it("encodes letters, numbers and words", () => {
        assert.equal(convrtrs.stringToMorse("SOS"), "... --- ...");
        assert.equal(convrtrs.stringToMorse("Hello World"), ".... . .-.. .-.. --- / .-- --- .-. .-.. -..");
        assert.equal(convrtrs.stringToMorse("73"), "--... ...--");
    });
    it("decodes (to uppercase)", () => {
        assert.equal(convrtrs.morseToString(".... . .-.. .-.. --- / .-- --- .-. .-.. -.."), "HELLO WORLD");
    });
    it("rejects invalid characters", () => {
        assert.throws(() => convrtrs.morseToString("..x"), /invalid characters/);
    });
});

describe("morsenary", () => {
    it("writes each bit as . (0) or - (1) by default", () => {
        assert.equal(convrtrs.stringToMorsenary("A"), ".-.....-");
        assert.equal(convrtrs.stringToMorsenary("A", "flipped"), "-.-----.");
    });
    it("round-trips in both settings", () => {
        assert.equal(convrtrs.morsenaryToString(convrtrs.stringToMorsenary("Hi there")), "Hi there");
        assert.equal(convrtrs.morsenaryToString(convrtrs.stringToMorsenary("Hi there", "flipped"), "flipped"), "Hi there");
    });
    it("rejects invalid characters", () => {
        assert.throws(() => convrtrs.morsenaryToString("abc"), /invalid characters/);
    });
});

describe("rot13 and reverse", () => {
    it("rot13", () => {
        assert.equal(toolkit.rot13("Hello, World!"), "Uryyb, Jbeyq!");
        assert.equal(toolkit.rot13(toolkit.rot13("Hello")), "Hello");
    });
    it("reverses by character, keeping emoji intact", () => {
        assert.equal(toolkit.reverseString("abc"), "cba");
        assert.equal(toolkit.reverseString("a😀b"), "b😀a");
    });
});

describe("text tools (strings.js)", () => {
    const s = "Hello World 123!";
    it("strips and filters", () => {
        assert.equal(strings.stripSpaces(" a b\tc "), "ab\tc");
        assert.equal(strings.stripSpaces(" a b\tc ", true), "abc");
        assert.equal(strings.numbersOnly(s), "123");
        assert.equal(strings.numbersOnly("1 2 a", true), "1 2 ");
        assert.equal(strings.lettersOnly(s), "HelloWorld");
        assert.equal(strings.lettersOnly(s, true), "Hello World ");
        assert.equal(strings.lettersOnlyCap(s), "HW");
        assert.equal(strings.lettersOnlyLow(s), "elloorld");
        assert.equal(strings.stripSpecialChars(s), "HelloWorld123");
        assert.equal(strings.stripLetters(s), "  123!");
        assert.equal(strings.stripNumbers(s), "Hello World !");
        assert.equal(strings.specialCharsOnly(s), "!");
        assert.equal(strings.specialCharsOnly(s, true), "  !");
    });
    it("changes case", () => {
        assert.equal(strings.uppercase("Hello"), "HELLO");
        assert.equal(strings.lowercase("Hello"), "hello");
    });
    it("maps letters to alphabet positions", () => {
        assert.equal(strings.lettersToNumbers("abc XYZ"), "1 2 3 24 25 26");
    });
    it("URL encodes", () => {
        assert.equal(strings.urlEncode("a b&c=d"), "a+b%26c%3Dd");
    });
    it("URL decodes, reading + as a space", () => {
        assert.equal(strings.urlDecode("a+b%26c%3Dd"), "a b&c=d");
        assert.equal(strings.urlDecode("a%20b%2Bc"), "a b+c");
        assert.equal(strings.urlDecode("caf%C3%A9"), "café");
    });
    it("round-trips URL encoding", () => {
        const text = "a b+c&d=e/f?g é ✓";
        assert.equal(strings.urlDecode(strings.urlEncode(text)), text);
    });
    it("rejects malformed escapes", () => {
        assert.throws(() => strings.urlDecode("100%"), /Not a valid URL-encoded/);
        assert.throws(() => strings.urlDecode("%E9"), /Not a valid URL-encoded/);
    });
    it("detects JSON objects and arrays", () => {
        assert.equal(strings.isLikelyJSON('{"a":1}'), true);
        assert.equal(strings.isLikelyJSON("[1,2]"), true);
        assert.equal(strings.isLikelyJSON("42"), false);
        assert.equal(strings.isLikelyJSON("nope"), false);
    });
});

describe("replace and frequencies (toolkit)", () => {
    it("replaces, optionally ignoring case, and supports regex", () => {
        assert.equal(toolkit.replaceChars("hello", "l", "L", true), "heLLo");
        assert.equal(toolkit.replaceChars("Hello", "h", "J", false), "Jello");
        assert.equal(toolkit.replaceChars("a1b22c", "\\d+", "#", true), "a#b#c");
    });
    it("throws when there's nothing to replace", () => {
        assert.throws(() => toolkit.replaceChars("hello", "z", "y", true), /was not found/);
    });
    it("finds unique characters and counts them", () => {
        assert.deepEqual(toolkit.uniqueArray("hello"), ["h", "e", "l", "o"]);
        assert.deepEqual(toolkit.countArrayFreq("hello"), { h: 1, e: 1, l: 2, o: 1 });
    });
    it("keeps emoji whole when finding and counting unique characters", () => {
        assert.deepEqual(toolkit.uniqueArray("a😀😀"), ["a", "😀"]);
        assert.deepEqual(toolkit.countArrayFreq("😀😀"), { "😀": 2 });
    });
});

describe("text frequencies (stats)", () => {
    it("counts", () => {
        const s = "Hello World 123!";
        assert.equal(stringStats(s, "word-count"), 3);
        assert.equal(stringStats(s, "char-count"), 16);
        assert.equal(stringStats(s, "char-count-ns"), 14);
        assert.equal(stringStats(s, "letter-count"), 10);
        assert.equal(stringStats(s, "number-count"), 3);
        assert.equal(stringStats(s, "special-count-ns"), 1);
        assert.equal(stringStats(s, "special-count"), 3);
    });
    it("splits words on any spaces, tabs and new lines", () => {
        assert.equal(stringStats("one  two\nthree\tfour ", "word-count"), 4);
        assert.equal(stringStats("", "word-count"), 0);
        assert.equal(stringStats("  \n", "word-count"), 0);
    });
    it("leaves tabs and new lines out of the counts without spaces", () => {
        assert.equal(stringStats("a b\nc\td", "char-count-ns"), 4);
        assert.equal(stringStats("a!\n?", "special-count-ns"), 2);
    });
    it("counts accented letters and other alphabets as letters", () => {
        assert.equal(stringStats("Café Жж", "letter-count"), 6);
        assert.equal(stringStats("Café Жж", "letter-count-caps"), 2);
        assert.equal(stringStats("Café Жж", "letter-count-low"), 4);
        assert.equal(stringStats("Café Жж", "special-count-ns"), 0);
    });
    it("counts an emoji as one character", () => {
        assert.equal(stringStats("a😀", "char-count"), 2);
        assert.equal(stringStats("a😀", "special-count"), 1);
    });
    it("counts each character in the order it first appears", () => {
        assert.deepEqual(characterFrequencies("hello"), [
            { char: "h", count: 1, first: 1 }, { char: "e", count: 1, first: 2 },
            { char: "l", count: 2, first: 3 }, { char: "o", count: 1, first: 5 },
        ]);
        assert.deepEqual(characterFrequencies("😀a😀"), [{ char: "😀", count: 2, first: 1 }, { char: "a", count: 1, first: 2 }]);
        assert.deepEqual(characterFrequencies(""), []);
    });
});

describe("flip", () => {
    it("turns text upside down", () => {
        assert.equal(flipText("hello"), "oןןǝɥ");
    });
});
