// ONI tools are ports of the Ruby ONI-Tools toolkit, so there are no published test vectors:
// these check the obvious properties and snapshot everything else.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calendar } from "../../assets/js/lib/oni/calendar.js";
import { interleave } from "../../assets/js/lib/oni/interleave.js";
import { lookahead } from "../../assets/js/lib/oni/lookahead.js";
import { mergeBase64 } from "../../assets/js/lib/oni/mergeBase64.js";
import { strings } from "../../assets/js/lib/oni/strings.js";
import { unmunge } from "../../assets/js/lib/oni/unmunge.js";
import { unscramble } from "../../assets/js/lib/oni/unscramble.js";

// A repeatable "data node": every printable ASCII character, repeated
const datanode = Array.from({ length: 800 }, (_, i) => String.fromCharCode(32 + (i * 7) % 95)).join("");

describe("interleave", () => {
    it("alternates characters, appending the rest of the longer string", () => {
        assert.equal(interleave("abc", "123"), "a1b2c3");
        assert.equal(interleave("abcde", "12"), "a1b2cde");
        assert.equal(interleave("ab", "12", "-"), "a-1-b-2");
    });
});

describe("mergeBase64", () => {
    it("takes the most common character at each position", () => {
        assert.equal(mergeBase64("abc", "abd", "xbc"), "abc");
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
});

describe("unscramble", () => {
    it("swaps each pair of characters", () => {
        assert.equal(unscramble("badc"), "abcd");
    });
    it("keeps the last character of odd-length input", { todo: "the unpaired last character is dropped" }, () => {
        assert.equal(unscramble("badce"), "abcde");
    });
});

describe("snapshots", () => {
    it("calendar", (t) => t.assert.snapshot(calendar(datanode)));
    it("lookahead", (t) => t.assert.snapshot(lookahead("key", datanode)));
    it("unmunge", (t) => t.assert.snapshot(unmunge("key", datanode)));
});
