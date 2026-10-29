import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { convertBraille } from "../../assets/js/lib/misc/braille.js";
import { hexToChunks } from "../../assets/js/lib/misc/colors.js";
import { convertElements } from "../../assets/js/lib/misc/elements.js";
import { fralphabet } from "../../assets/js/lib/misc/forerunner.js";
import { getKeyValue } from "../../assets/js/lib/toolkit.js";

describe("forerunner", () => {
    it("maps each glyph to its character, plus space", () => {
        assert.equal(fralphabet.length, 38);
        assert.equal(getKeyValue("…", fralphabet), "0");
        assert.equal(getKeyValue("™", fralphabet), "A");
        assert.equal(getKeyValue("Å", fralphabet), "Æ");
        assert.equal(getKeyValue(" ", fralphabet), " ");
    });
});

// `mode` names the input: "braille" (default) reads Braille, "text" reads text
describe("braille", () => {
    it("converts text to braille", () => {
        assert.equal(convertBraille("hello 1", "text"), "⠓⠑⠇⠇⠕ ⠂");
    });
    it("converts braille to text (uppercase)", () => {
        assert.equal(convertBraille("⠓⠑⠇⠇⠕"), "HELLO");
    });
    it("rejects an unknown mode", () => {
        assert.throws(() => convertBraille("a", "nope"), /Invalid mode/);
    });
});

describe("colors", () => {
    it("splits hex into 6-digit colours, padding the last one", () => {
        const html = hexToChunks("ffffff0000", 6);
        assert.match(html, /#ffffff/);
        assert.match(html, /#0000FF/);
        assert.match(hexToChunks("0000", 6, "0"), /#000000/);
    });
    it("only pads with 0 or F", () => {
        assert.throws(() => hexToChunks("00", 6, "A"), /Invalid padding/);
    });
    it("renders the same HTML as before", (t) => {
        t.assert.snapshot(hexToChunks("48656c6c6f", 6));
    });
});

describe("periodic elements", () => {
    it("converts symbols to names and numbers", async () => {
        assert.equal(await convertElements("H He Li", "symbol", "name"), "Hydrogen Helium Lithium");
        assert.equal(await convertElements("H He Li", "symbol", "number"), "1 2 3");
    });
    it("converts numbers to symbols, optionally without delimiters", async () => {
        assert.equal(await convertElements("1 2 3", "number", "symbol"), "H He Li");
        assert.equal(await convertElements("1 2 3", "number", "symbol", true), "HHeLi");
    });
    it("throws for an unknown element", async () => {
        await assert.rejects(() => convertElements("Xx", "symbol", "name"), /not found/);
    });
});
