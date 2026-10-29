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
import { vigenereEncrypt, vigenereDecrypt } from "../../assets/js/lib/ciphers/vigenere.js";

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
    it("cycles every 26 shifts with a keyed alphabet, whatever the key's case", () => {
        assert.equal(rot("Hello", 26, getCustomAlphabet("KEY")), "Hello");
        assert.equal(rot(rot("Hello", 13, getCustomAlphabet("KEY")), 13, getCustomAlphabet("KEY")), "Hello");
        assert.equal(rot("Hello", 3, getCustomAlphabet("key")), rot("Hello", 3, getCustomAlphabet("KEY")));
    });
});

describe("common", () => {
    it("getCustomAlphabet puts the key's unique letters first", () => {
        assert.equal(getCustomAlphabet("KEY").slice(0, 8), "KEYABCDF");
        assert.equal(getCustomAlphabet("BALLOON").slice(0, 7), "BALONCD");
    });
    it("getCustomAlphabet is always the 26 uppercase letters", () => {
        assert.equal(getCustomAlphabet("zebras"), "ZEBRASCDFGHIJKLMNOPQTUVWXY");
        assert.equal(getCustomAlphabet("ZeBrAs"), "ZEBRASCDFGHIJKLMNOPQTUVWXY");
        assert.equal(getCustomAlphabet(""), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    });
    it("fibonacci", () => {
        assert.deepEqual(fibonacci(7), [1, 1, 2, 3, 5, 8, 13]);
    });
});

describe("vigenère", () => {
    // Textbook example (Wikipedia)
    it("encrypts ATTACKATDAWN with LEMON", () => {
        assert.equal(vigenereEncrypt("ATTACKATDAWN", "LEMON"), "LXFOPVEFRNHR");
    });
    it("decrypts back", () => {
        assert.equal(vigenereDecrypt("LXFOPVEFRNHR", "LEMON"), "ATTACKATDAWN");
    });
    it("keeps case and skips non-letters (they don't use up the key)", () => {
        assert.equal(vigenereEncrypt("Attack at dawn!", "lemon"), "Lxfopv ef rnhr!");
        assert.equal(vigenereDecrypt("Lxfopv ef rnhr!", "LEMON"), "Attack at dawn!");
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
    it("encrypts with ZEBRAS", () => {
        assert.equal(keywordEncode("FLEE AT ONCE", "ZEBRAS"), "SIAA ZQ LKBA");
    });
    it("decrypts with ZEBRAS", () => {
        assert.equal(keywordDecode("SIAA ZQ LKBA", "ZEBRAS"), "FLEE AT ONCE");
    });
    it("keeps case, whatever the key's case", () => {
        assert.equal(keywordEncode("flee at once", "zebras"), "siaa zq lkba");
    });
    it("keeps case when decoding", () => {
        assert.equal(keywordDecode("Siaa Zq Lkba", "zebras"), "Flee At Once");
    });
    it("round-trips", () => {
        assert.equal(keywordDecode(keywordEncode("Hello World", "Zebras"), "Zebras"), "Hello World");
    });
});

describe("substitution", () => {
    it("substitutes using the keyed alphabet, keeping case", () => {
        assert.equal(substituteChars("flee at once. we are discovered!", "ZEBRAS"), "siaa zq lkba. va zoa rfpbluaoar!");
    });
    it("gives the same result for a lowercase key", () => {
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
