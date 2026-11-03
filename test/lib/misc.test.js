import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { convertBraille } from "../../assets/js/lib/misc/braille.js";
import { hexToChunks, textToColours, coloursToText } from "../../assets/js/lib/misc/colors.js";
import { convertElements, categoryKey } from "../../assets/js/lib/misc/elements.js";
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
    it("turns text into colours, three bytes each, with the characters each holds", () => {
        assert.deepEqual(textToColours("Hello"), [
            { hex: "48656C", text: "Hel", padded: false },
            { hex: "6C6FFF", text: "lo", padded: true },
        ]);
        assert.equal(textToColours("Hi", "0")[0].hex, "486900");
        assert.deepEqual(textToColours(""), []);
    });
    it("reads text back from colours, however they're written, dropping the padding", () => {
        assert.equal(coloursToText("#48656C #6C6FFF").text, "Hello");
        assert.equal(coloursToText("48656c, 6c6f00").text, "Hello");
        assert.equal(coloursToText("0x48656C\n0x6C6F21").text, "Hello!");
        assert.equal(coloursToText("#48656C6C6FFF").text, "Hello");
        assert.deepEqual(coloursToText("#48656C #6C6FFF").colours, ["48656C", "6C6FFF"]);
    });
    it("round-trips text that isn't plain English", () => {
        for (const text of ["Café ✓", "😀 ok", "a"]) {
            assert.equal(coloursToText(textToColours(text).map((c) => c.hex).join(" ")).text, text);
        }
    });
    it("rejects what isn't a hex colour", () => {
        assert.throws(() => coloursToText("#12345"), /isn't a hex color/);
        assert.throws(() => coloursToText("#GGGGGG"), /isn't a hex color/);
        assert.throws(() => coloursToText(" , "), /no colors/);
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
    it("ignores case, and keeps the separator used", async () => {
        assert.equal(await convertElements("se, n,TE", "symbol", "number"), "34, 7, 52");
        assert.equal(await convertElements("hydrogen", "name", "symbol"), "H");
    });
    it("matches on the property converted from only", async () => {
        // "1" is hydrogen's atomic number, but no element melts at 1 K
        await assert.rejects(() => convertElements("1", "melt", "name"), /not found/);
        assert.equal(await convertElements("1.008", "atomic_mass", "name"), "Hydrogen");
    });
    it("groups categories as the periodic table colours them", () => {
        assert.equal(categoryKey("diatomic nonmetal"), "nonmetal");
        assert.equal(categoryKey("alkaline earth metal"), "alkaline");
        assert.equal(categoryKey("alkali metal"), "alkali");
        assert.equal(categoryKey("unknown, probably transition metal"), "transition");
        assert.equal(categoryKey("unknown, probably post-transition metal"), "post-transition");
        assert.equal(categoryKey("something new"), "unknown");
    });
});
