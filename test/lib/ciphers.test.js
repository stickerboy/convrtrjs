import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { atbashCipher } from "../../assets/js/lib/ciphers/atbash.js";
import { beaufortCipher } from "../../assets/js/lib/ciphers/beaufort.js";
import { chaocipherEncode, chaocipherDecode } from "../../assets/js/lib/ciphers/chaocipher.js";
import { getCustomAlphabet, fibonacci } from "../../assets/js/lib/ciphers/common.js";
import { keywordEncode, keywordDecode } from "../../assets/js/lib/ciphers/keyword.js";
import { railFenceEncode, railFenceDecode } from "../../assets/js/lib/ciphers/rail.js";
import rot from "../../assets/js/lib/ciphers/rot.js";
import { smithyEncrypt, smithyDecrypt } from "../../assets/js/lib/ciphers/smithy.js";
import { substituteChars } from "../../assets/js/lib/ciphers/substitution.js";
import { vignereEncrypt, vignereDecrypt } from "../../assets/js/lib/ciphers/vigenere.js";

describe("atbash", () => {
    it("mirrors each letter, keeping case and other characters", () => {
        assert.equal(atbashCipher("Hello World!"), "Svool Dliow!");
        assert.equal(atbashCipher("abcxyz ABCXYZ"), "zyxcba ZYXCBA");
    });
    it("is its own inverse", () => {
        assert.equal(atbashCipher(atbashCipher("The quick brown fox")), "The quick brown fox");
    });
});

describe("rot (Caesar)", () => {
    it("defaults to ROT13", () => {
        assert.equal(rot("Hello World"), "Uryyb Jbeyq");
    });
    it("shifts by n, wrapping and keeping case", () => {
        assert.equal(rot("abc XYZ", 3), "def ABC");
        assert.equal(rot("def ABC", -3), "abc XYZ");
        assert.equal(rot("Hello", 26), "Hello");
    });
    it("uses a custom alphabet", () => {
        // KEYABCDF... : shifting by 1 moves each letter to the next one in the keyed alphabet
        assert.equal(rot("K", 1, getCustomAlphabet("KEY")), "E");
    });
    it("cycles every 26 shifts with a keyed alphabet", { todo: "the keyed alphabet has 52 letters (both cases), so it cycles every 52" }, () => {
        assert.equal(rot("Hello", 26, getCustomAlphabet("KEY")), "Hello");
        assert.equal(rot(rot("Hello", 13, getCustomAlphabet("KEY")), 13, getCustomAlphabet("KEY")), "Hello");
    });
});

describe("common", () => {
    it("getCustomAlphabet puts the key's unique letters first", () => {
        assert.equal(getCustomAlphabet("KEY").slice(0, 8), "KEYABCDF");
        assert.equal(getCustomAlphabet("BALLOON").slice(0, 7), "BALONCD");
    });
    it("fibonacci", () => {
        assert.deepEqual(fibonacci(7), [1, 1, 2, 3, 5, 8, 13]);
    });
});

describe("vigenère", () => {
    // Textbook example (Wikipedia)
    it("encrypts ATTACKATDAWN with LEMON", () => {
        assert.equal(vignereEncrypt("ATTACKATDAWN", "LEMON"), "LXFOPVEFRNHR");
    });
    it("decrypts back", () => {
        assert.equal(vignereDecrypt("LXFOPVEFRNHR", "LEMON"), "ATTACKATDAWN");
    });
    it("keeps case and skips non-letters (they don't use up the key)", () => {
        assert.equal(vignereEncrypt("Attack at dawn!", "lemon"), "Lxfopv ef rnhr!");
        assert.equal(vignereDecrypt("Lxfopv ef rnhr!", "LEMON"), "Attack at dawn!");
    });
});

describe("beaufort", () => {
    // Practical Cryptography example
    it("encrypts with FORTIFICATION", () => {
        assert.equal(beaufortCipher("DEFENDTHEEASTWALLOFTHECASTLE", "FORTIFICATION"), "CKMPVCPVWPIWUJOGIUAPVWRIWUUK");
    });
    it("is reciprocal", () => {
        assert.equal(beaufortCipher("CKMPVCPVWPIWUJOGIUAPVWRIWUUK", "FORTIFICATION"), "DEFENDTHEEASTWALLOFTHECASTLE");
    });
});

describe("rail fence", () => {
    // Textbook example (Wikipedia)
    it("encrypts with 3 rails", () => {
        assert.equal(railFenceEncode("WEAREDISCOVEREDFLEEATONCE", 3), "WECRLTEERDSOEEFEAOCAIVDEN");
    });
    it("decrypts back", () => {
        assert.equal(railFenceDecode("WECRLTEERDSOEEFEAOCAIVDEN", 3), "WEAREDISCOVEREDFLEEATONCE");
    });
    it("round-trips with other rail counts", () => {
        for (const rails of [2, 4, 5, 7]) {
            assert.equal(railFenceDecode(railFenceEncode("WEAREDISCOVEREDFLEEATONCE", rails), rails), "WEAREDISCOVEREDFLEEATONCE");
        }
    });
    it("needs at least 2 rails", () => {
        assert.throws(() => railFenceEncode("ABC", 1), /minimum of 2/);
        assert.throws(() => railFenceDecode("ABC", 0), /minimum of 2/);
    });
});

describe("chaocipher", () => {
    // Byrne's example, as published by Moshe Rubin (2010)
    it("encrypts the reference plaintext", () => {
        assert.equal(chaocipherEncode("WELLDONEISBETTERTHANWELLSAID"), "OAHQHCNYNXTSZJRRHJBYHQKSOUJY");
    });
    it("decrypts the reference ciphertext", () => {
        assert.equal(chaocipherDecode("OAHQHCNYNXTSZJRRHJBYHQKSOUJY"), "WELLDONEISBETTERTHANWELLSAID");
    });
    it("keeps case", () => {
        assert.equal(chaocipherDecode(chaocipherEncode("WellDone")), "WellDone");
    });
});

describe("keyword", () => {
    // Standard example: ZEBRAS gives the alphabet ZEBRASCDFGHIJKLMNOPQTUVWXY
    it("encrypts with ZEBRAS", { todo: "off by one: looks letters up in an alphabet that starts with a space" }, () => {
        assert.equal(keywordEncode("FLEE AT ONCE", "ZEBRAS"), "SIAA ZQ LKBA");
    });
    it("decrypts with ZEBRAS", { todo: "off by one (see above)" }, () => {
        assert.equal(keywordDecode("SIAA ZQ LKBA", "ZEBRAS"), "FLEE AT ONCE");
    });
    it("keeps case, whatever the key's case", { todo: "key and input case are mixed into one alphabet" }, () => {
        assert.equal(keywordEncode("flee at once", "zebras"), "siaa zq lkba");
    });
    it("round-trips (current behaviour)", () => {
        assert.equal(keywordDecode(keywordEncode("Hello World", "Zebras"), "Zebras"), "Hello World");
    });
});

describe("substitution", () => {
    it("substitutes using the keyed alphabet, keeping case", () => {
        assert.equal(substituteChars("flee at once. we are discovered!", "ZEBRAS"), "siaa zq lkba. va zoa rfpbluaoar!");
    });
    it("gives the same result for a lowercase key", { todo: "a lowercase key builds a different alphabet" }, () => {
        assert.equal(substituteChars("flee at once", "zebras"), substituteChars("flee at once", "ZEBRAS"));
    });
});

describe("smithy", () => {
    it("round-trips", () => {
        assert.equal(smithyDecrypt(smithyEncrypt("Hello World, 123!", "key"), "key"), "Hello World, 123!");
    });
    it("matches the current output", (t) => {
        t.assert.snapshot(smithyEncrypt("The quick brown fox jumps over the lazy dog", "jaeiextostgpsacgreamqwfkadpmqzv"));
    });
    it("keeps non-ASCII characters intact", () => {
        assert.equal(smithyDecrypt(smithyEncrypt("Café ✓ 😀", "key"), "key"), "Café ✓ 😀");
        assert.match(smithyEncrypt("Café ✓", "key"), /^[A-Za-z]{3}é ✓$/);
    });
});
