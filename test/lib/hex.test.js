import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { reverseHexBytes, reverseHexByteOrder, reverseHexNibbles } from "../../assets/js/lib/hex/reverse.js";
import { shiftHexString, shiftHexKey } from "../../assets/js/lib/hex/shift.js";
import { generateHexFrequencies } from "../../assets/js/lib/hex/frequencies.js";
import { isValidHex, hexToPairs, hexToBytes, bytesToHex } from "../../assets/js/lib/toolkit.js";

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
    it("subtracts the key's bytes, showing bytes that aren't UTF-8 one character per byte", () => {
        // H-k = 221 (Ý), e-e = 0, l-y = 243 (ó), l-k = 1, o-e = 10
        assert.equal(shiftHexKey("Hello", "key"), "Ý\x00ó\x01\n");
        assert.equal(shiftHexKey(shiftHexKey("Hi", "\x00"), "\x00"), "Hi");
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
    it("accepts hex with any separator, or none", () => {
        for (const hex of ["48 65", "48-65", "48:65", "48,65", "48;65", "4865", "\\x48\\x65", "0x480x65", "%48%65", "48\n65\t6c"]) {
            assert.equal(isValidHex(hex), true, hex);
        }
    });
    it("accepts separators mixed together, and prefixes in either case", () => {
        assert.equal(isValidHex("0x48, 0x65; 0X6c \\X6c-6f"), true);
    });
    it("rejects other characters", () => {
        assert.equal(isValidHex("48 6g"), false);
        assert.equal(isValidHex("48.65"), false);
    });
    it("only accepts x as part of a 0x or \\x prefix", () => {
        assert.equal(isValidHex("4x8"), false);
    });
    it("needs at least one hex digit", () => {
        assert.equal(isValidHex(""), false);
        assert.equal(isValidHex(" , 0x "), false);
    });
});

describe("hex helpers", () => {
    it("splits hex into byte pairs, ignoring surrounding whitespace", () => {
        assert.deepEqual(hexToPairs(" 48 6A\n"), ["48", "6A"]);
        assert.deepEqual(hexToPairs("4869 21"), ["48", "69", "21"]);
        assert.deepEqual(hexToPairs("\\x48\\x69"), ["48", "69"]);
        assert.deepEqual(hexToPairs(" 4869\n"), ["48", "69"]);
    });
    it("reads common ways of writing hex the same", () => {
        for (const hex of ["0x48, 0x69", "%48%69", "48;69", "48\n69", "0X48 \\X69", "0x48-\\x69"]) {
            assert.deepEqual(hexToPairs(hex), ["48", "69"], hex);
        }
    });
    it("parses and formats bytes, prefixing 0x, \\x and %", () => {
        assert.deepEqual(hexToBytes("0x480x69"), [0x48, 0x69]);
        assert.equal(bytesToHex([0x48, 0x69], "0x"), "0x480x69");
        assert.equal(bytesToHex([0x48, 0x69], "\\x"), "\\x48\\x69");
        assert.equal(bytesToHex([0x48, 0x69], "%"), "%48%69");
        assert.equal(bytesToHex([0x48, 0x69], "0x, "), "0x48, 0x69");
        assert.equal(bytesToHex([0x48], "0x, "), "0x48");
        assert.equal(bytesToHex([0x48, 0x69], ":"), "48:69");
        assert.equal(bytesToHex([], "0x"), "");
    });
});

describe("hex tools with every delimiter", () => {
    const delimiters = [" ", "-", ":", ",", "\\x", "0x", "0x, ", "%", ""];
    const hex = (bytes, delimiter) => bytesToHex(bytes, delimiter);
    for (const d of delimiters) {
        it(`delimiter ${JSON.stringify(d)}`, () => {
            const input = hex([0x48, 0x65, 0x6c], d);
            assert.equal(reverseHexBytes(input, d), hex([0x84, 0x56, 0xc6], d));
            assert.equal(reverseHexByteOrder(input, d), hex([0x6c, 0x65, 0x48], d));
            assert.equal(reverseHexNibbles(input, d), hex([0x21, 0x6a, 0x63], d));
            assert.equal(shiftHexString(input, 1, d), hex([0x49, 0x66, 0x6d], d));
            assert.deepEqual(generateHexFrequencies(hex([0x41, 0x41, 0x42], d), d, 4), { [hex([0x41, 0x41], d)]: 1 });
        });
    }
    it("reads input written with a different separator to the one chosen for the result", () => {
        assert.equal(reverseHexByteOrder("0x48, 0x65, 0x6c", " "), "6c 65 48");
        assert.equal(shiftHexString("48-65", 1, ":"), "49:66");
    });
    it("counts runs of 4 identical bytes (quad)", () => {
        assert.deepEqual(generateHexFrequencies("41 41 41 41 42", " ", 8), { "41 41 41 41": 1 });
    });
});
