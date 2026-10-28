import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as toolkit from "../../assets/js/lib/toolkit.js";
import * as strings from "../../assets/js/lib/strings.js";
import * as convrtrs from "../../assets/js/lib/text/convrtrs.js";
import { flipText } from "../../assets/js/lib/text/flip.js";
import { stringStats } from "../../assets/js/lib/text/frequencies.js";

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
    it("round-trips non-ASCII text", { todo: "decodes bytes with String.fromCharCode instead of as UTF-8" }, () => {
        assert.equal(convrtrs.binaryToString(toolkit.stringToBinary("Café ✓")), "Café ✓");
    });
});

describe("hex", () => {
    it("encodes with each delimiter", () => {
        assert.equal(toolkit.stringToHex("Hi", " "), "48 69");
        assert.equal(toolkit.stringToHex("Hi", ""), "4869");
        assert.equal(toolkit.stringToHex("Hi", "-"), "48-69");
        assert.equal(toolkit.stringToHex("Hi", "0x"), "0x480x69");
        assert.equal(toolkit.stringToHex("Hi", "\\x"), "\\x48\\x69");
    });
    it("decodes with each delimiter", () => {
        assert.equal(toolkit.hexToString("48 69", " "), "Hi");
        assert.equal(toolkit.hexToString("4869", ""), "Hi");
        assert.equal(toolkit.hexToString("48-69", "-"), "Hi");
        assert.equal(toolkit.hexToString("48:69", ":"), "Hi");
        assert.equal(toolkit.hexToString("0x480x69", "0x"), "Hi");
    });
    it("decodes \\x-delimited hex", { todo: "the delimiter isn't escaped in the validation regex, so the backslash is rejected" }, () => {
        assert.equal(toolkit.hexToString("\\x48\\x69", "\\x"), "Hi");
    });
    it("round-trips non-ASCII text (UTF-8)", () => {
        assert.equal(toolkit.hexToString(toolkit.stringToHex("Café ✓", " "), " "), "Café ✓");
    });
    it("rejects invalid hex", () => {
        assert.throws(() => toolkit.hexToString("4G 69", " "), /invalid characters/);
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
    it("round-trips non-ASCII text", { todo: "encodes only the first UTF-8 byte of each character" }, () => {
        assert.equal(toolkit.decimalToString(toolkit.stringToDecimal("Café ✓")), "Café ✓");
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
    it("URL decodes", { todo: "turns + into %20 after decoding, instead of into a space" }, () => {
        assert.equal(strings.urlDecode("a+b%26c%3Dd"), "a b&c=d");
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
    it("renders frequency HTML as before", (t) => {
        t.assert.snapshot(toolkit.styledUniqueArrayItems(toolkit.uniqueArray("ab c")));
        t.assert.snapshot(toolkit.styledArrayFrequencies(toolkit.countArrayFreq("aab"), "Test"));
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
    });
});

describe("flip", () => {
    it("turns text upside down", () => {
        assert.equal(flipText("hello"), "oןןǝɥ");
    });
});
