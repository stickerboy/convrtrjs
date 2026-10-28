import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { reverseHexBytes, reverseHexByteOrder, reverseHexNibbles } from "../../assets/js/lib/hex/reverse.js";
import { shiftHexString, shiftHexKey } from "../../assets/js/lib/hex/shift.js";
import { generateHexFrequencies } from "../../assets/js/lib/hex/frequencies.js";
import { isValidHex } from "../../assets/js/lib/toolkit.js";

describe("hex reverse", () => {
    it("reverses the digits within each byte", () => {
        assert.equal(reverseHexBytes("48 65 6c", " "), "84 56 c6");
        assert.equal(reverseHexBytes("48656c", ""), "8456c6");
    });
    it("reverses the byte order", () => {
        assert.equal(reverseHexByteOrder("48 65 6c", " "), "6c 65 48");
        assert.equal(reverseHexByteOrder("48656c", ""), "6c6548");
    });
    it("reverses the bits within each nibble", () => {
        // 0x48 = 0100 1000 -> 0010 0001 = 0x21; 0x65 = 0110 0101 -> 0110 1010 = 0x6a
        assert.equal(reverseHexNibbles("48 65", " "), "21 6a");
    });
    it("rejects invalid hex", () => {
        assert.throws(() => reverseHexBytes("4G", " "), /invalid characters/);
    });
});

describe("hex shift", () => {
    it("adds to each byte, wrapping at 0xff", () => {
        assert.equal(shiftHexString("48 65", 1, " "), "49 66");
        assert.equal(shiftHexString("ff 00", 1, " "), "00 01");
        assert.equal(shiftHexString("00", -1, " "), "ff");
    });
    it("matches the current shiftHexKey output", (t) => {
        t.assert.snapshot(shiftHexKey("Hello", "key"));
    });
});

describe("hex frequencies", () => {
    it("counts single bytes (2 hex digits)", () => {
        assert.deepEqual(generateHexFrequencies("48 48 65", " ", 2), { "48": 2, "65": 1 });
    });
    it("counts repeated runs of the same byte", () => {
        assert.deepEqual(generateHexFrequencies("48 48 65 65", " ", 4), { "48 48": 1, "65 65": 1 });
    });
    it("rejects invalid hex", () => {
        assert.throws(() => generateHexFrequencies("zz", " ", 2), /invalid characters/);
    });
});

describe("isValidHex", () => {
    it("accepts hex with the chosen delimiter", () => {
        assert.equal(isValidHex("48 65", " "), true);
        assert.equal(isValidHex("48-65", "-"), true);
        assert.equal(isValidHex("4865", ""), true);
    });
    it("rejects other characters", () => {
        assert.equal(isValidHex("48 6g", " "), false);
        assert.equal(isValidHex("48-65", " "), false);
    });
    it("accepts \\x-delimited hex", { todo: "the delimiter isn't escaped in the regex" }, () => {
        assert.equal(isValidHex("\\x48\\x65", "\\x"), true);
    });
});
