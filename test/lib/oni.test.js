// ONI tools are ports of the Ruby ONI-Tools toolkit, so there are no published test vectors:
// these check the obvious properties and snapshot everything else.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calendar } from "../../assets/js/lib/oni/calendar.js";
import { interleave } from "../../assets/js/lib/oni/interleave.js";
import { lookahead } from "../../assets/js/lib/oni/lookahead.js";
import { mergeBase64, compareBase64 } from "../../assets/js/lib/oni/mergeBase64.js";
import { strings, findStrings } from "../../assets/js/lib/oni/strings.js";
import { unmunge } from "../../assets/js/lib/oni/unmunge.js";
import { unscramble } from "../../assets/js/lib/oni/unscramble.js";

// A repeatable "data node": every printable ASCII character, repeated
const datanode = Array.from({ length: 800 }, (_, i) => String.fromCharCode(32 + (i * 7) % 95)).join("");

describe("interleave", () => {
    it("alternates characters, appending the rest of the longer string", () => {
        assert.equal(interleave("abc", "123"), "a1b2c3");
        assert.equal(interleave("abcde", "12"), "a1b2cde");
        assert.equal(interleave("ab", "12", "-"), "a-1-b-2");
        assert.equal(interleave("12", "abcde"), "1a2bcde");
    });
    it("keeps emoji whole", () => {
        assert.equal(interleave("😀😀", "ab"), "😀a😀b");
    });
});

describe("mergeBase64", () => {
    it("takes the most common character at each position", () => {
        assert.equal(mergeBase64("abc", "abd", "xbc"), "abc");
    });
    it("gives a tie to the character seen first", () => {
        assert.equal(mergeBase64("ab", "xy"), "ab");
    });
    it("counts only the strings that reach a position", () => {
        assert.equal(mergeBase64("abcd", "ab", "ab"), "abcd");
        assert.equal(mergeBase64("ab", "abcd"), "abcd");
    });
    it("counts the positions where the strings disagree", () => {
        assert.deepEqual(compareBase64("SGVzbG8h", "SGVsbG8h", "SGVsbG9h"), { merged: "SGVsbG8h", disagreements: 2 });
        assert.deepEqual(compareBase64("abc", "abc"), { merged: "abc", disagreements: 0 });
    });
    it("needs at least two strings", () => {
        assert.throws(() => mergeBase64(), /at least two/);
        assert.throws(() => mergeBase64("abc"), /at least two/);
    });
});

describe("strings", () => {
    it("extracts runs of at least n printable characters", () => {
        assert.deepEqual(strings("\x01\x02hello world\x00ab\x7Fsecret", 4), ["hello world", "secret"]);
        assert.deepEqual(strings("ab\x00cd", 2), ["ab", "cd"]);
    });
    it("needs n of at least 1", () => {
        assert.throws(() => strings("abc", 0), /less than one/);
    });
    it("says where each run starts, counting an emoji as one character", () => {
        assert.deepEqual(findStrings("\x00\x01JFIF😀\xFFHello there", 4), [{ text: "JFIF", position: 2 }, { text: "Hello there", position: 8 }]);
        assert.deepEqual(findStrings("\x00\x01", 4), []);
    });
    it("needs n to be a whole number", () => {
        assert.throws(() => strings("hello world", 2.5), /whole number/);
        assert.throws(() => strings("hello world", "x"), /whole number/);
        assert.deepEqual(strings("hi hello", "3"), ["hi hello"]);
    });
});

describe("unscramble", () => {
    it("swaps each pair of characters", () => {
        assert.equal(unscramble("badc"), "abcd");
    });
    it("keeps the last character of odd-length input", () => {
        assert.equal(unscramble("badce"), "abcde");
        assert.equal(unscramble("a"), "a");
        assert.equal(unscramble(""), "");
    });
    it("is its own inverse, and keeps emoji intact", () => {
        assert.equal(unscramble(unscramble("Hello, World!")), "Hello, World!");
        assert.equal(unscramble("😀a"), "a😀");
    });
    it("can drop the unpaired last character, like the original Ruby", () => {
        assert.equal(unscramble("badce", true), "abcd");
        assert.equal(unscramble("badc", true), "abcd");
    });
});

describe("unmunge", () => {
    it("reads columns from the key, then the key reversed without its first digit", () => {
        // e f g = 101 102 103 -> columns 1 2 3, then 3 2 (as in the Ruby: key + key.reverse[0...-1])
        assert.equal(unmunge("efg", "0123456789".repeat(6)), "123321");
    });
    it("counts emoji as one character", () => {
        assert.equal(unmunge("e", "0😀23456789"), "😀");
    });
    it("needs a key", () => {
        assert.throws(() => unmunge("", "0123456789"), /can't be empty/);
    });
});

describe("lookahead", () => {
    it("adds the key byte when the first of the pair is odd, otherwise subtracts it", () => {
        // "1" (49) is odd: 66 + 65 = 131; "2" (50) is even: 66 - 65 = 1
        assert.equal(lookahead("A", "1B2B"), "\x83\x01");
    });
    it("needs a key", () => {
        assert.throws(() => lookahead("", "1B2B"), /can't be empty/);
    });
});

describe("calendar", () => {
    it("counts emoji as one character", () => {
        assert.equal(calendar("a".repeat(31) + "😀" + "b".repeat(10)), "😀");
    });
});

describe("snapshots", () => {
    it("calendar", (t) => t.assert.snapshot(calendar(datanode)));
    it("lookahead", (t) => t.assert.snapshot(lookahead("key", datanode)));
});
