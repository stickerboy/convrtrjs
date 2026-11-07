import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { convertBraille, translateBraille } from "../../assets/js/lib/misc/braille.js";
import { textToColours, coloursToText } from "../../assets/js/lib/misc/colors.js";
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

// `mode` names the input: "braille" (default) reads Braille, "text" reads text. The code is Unified English Braille
// unless "ascii" is given.
describe("braille", () => {
    const toUeb = (text) => convertBraille(text, "text");
    it("writes capitals with capital signs, a word in capitals with two, and three such words as a passage", () => {
        assert.equal(toUeb("Hello"), "⠠⠓⠑⠇⠇⠕");
        assert.equal(toUeb("NASA"), "⠠⠠⠝⠁⠎⠁");
        assert.equal(toUeb("CDs"), "⠠⠉⠠⠙⠎");
        assert.equal(toUeb("DON'T"), "⠠⠠⠙⠕⠝⠄⠞");
        assert.equal(toUeb("I AM LOUD now"), "⠠⠠⠠⠊ ⠁⠍ ⠇⠕⠥⠙⠠⠄ ⠝⠕⠺");
    });
    it("writes numbers after the number sign, with . and , inside them", () => {
        assert.equal(toUeb("123"), "⠼⠁⠃⠉");
        assert.equal(toUeb("3.14 1,000"), "⠼⠉⠲⠁⠙ ⠼⠁⠂⠚⠚⠚");
        // a to j straight after a number would read as digits, so the grade 1 indicator goes first
        assert.equal(toUeb("1a 1A 2k"), "⠼⠁⠰⠁ ⠼⠁⠠⠁ ⠼⠃⠅");
    });
    it("writes punctuation as UEB does, and ? on its own with the grade 1 indicator", () => {
        assert.equal(toUeb("Hi, you! Why?"), "⠠⠓⠊⠂ ⠽⠕⠥⠖ ⠠⠺⠓⠽⠦");
        assert.equal(toUeb("?"), "⠰⠦");
        assert.equal(toUeb("\"Hi\" (a) [b] {c}"), "⠦⠠⠓⠊⠴ ⠐⠣⠁⠐⠜ ⠨⠣⠃⠨⠜ ⠸⠣⠉⠸⠜");
        assert.equal(toUeb("50% $1 a/b a\\b @"), "⠼⠑⠚⠨⠴ ⠈⠎⠼⠁ ⠁⠸⠌⠃ ⠁⠸⠡⠃ ⠈⠁");
        assert.equal(toUeb("don’t"), "⠙⠕⠝⠄⠞");
    });
    it("keeps accents, written before their letter, and other letters", () => {
        assert.equal(toUeb("Café Émile naïve"), "⠠⠉⠁⠋⠘⠌⠑ ⠠⠘⠌⠑⠍⠊⠇⠑ ⠝⠁⠘⠒⠊⠧⠑");
        assert.equal(toUeb("ß ø æ"), "⠨⠮ ⠈⠡⠕ ⠁⠘⠖⠑");
    });
    it("keeps spaces, tabs and new lines", () => {
        assert.equal(toUeb("ab\ncd\tx"), "⠁⠃\n⠉⠙\t⠭");
    });
    it("reads UEB back as it was written", () => {
        for (const text of ["Hello, World!", "I AM LOUD now", "DON'T stop, CDs", "3.14 and 1,000; 1a 1A", "Café Émile naïve",
            "Straße, Øl, æble", "Why? (a) [b] {c} 50% $1 a/b a\\b", "ab\ncd\tx", "WELL-KNOWN"]) {
            assert.equal(convertBraille(toUeb(text)), text);
        }
        // Straight double quotes come back as curly ones, as UEB writes opening and closing quotes
        assert.equal(convertBraille(toUeb("\"Hi,\" I said")), "“Hi,” I said");
        assert.equal(convertBraille("⠀⠓⠊"), " hi");
    });
    it("lists what has no Braille, or isn't Braille, once each, and leaves it out", () => {
        assert.deepEqual(translateBraille("Hi 😀 😀 ok", "text"), { text: "⠠⠓⠊   ⠕⠅", missing: ["😀"] });
        assert.deepEqual(translateBraille("⠓⠊⣿"), { text: "hi", missing: ["⣿"] });
    });
    it("writes and reads Braille ASCII, one cell for each character, in capitals, without accents", () => {
        assert.equal(convertBraille("hello 1", "text", "ascii"), "⠓⠑⠇⠇⠕ ⠂");
        assert.equal(convertBraille("Café", "text", "ascii"), "⠉⠁⠋⠑");
        assert.equal(convertBraille("⠓⠑⠇⠇⠕", "braille", "ascii"), "HELLO");
        assert.deepEqual(translateBraille("a\n😀", "text", "ascii"), { text: "⠁\n", missing: ["😀"] });
    });
    it("rejects an unknown mode or code", () => {
        assert.throws(() => convertBraille("a", "nope"), /Invalid mode/);
        assert.throws(() => convertBraille("a", "text", "nope"), /Invalid code/);
    });
});

describe("colors", () => {
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
        await assert.rejects(() => convertElements("Xx", "symbol", "name"), /No element has the symbol "Xx"/);
        await assert.rejects(() => convertElements("999", "atomic_mass", "name"), /No element has the atomic mass "999"/);
    });
    it("gives every element sharing a value, once each", async () => {
        assert.equal(await convertElements("247", "atomic_mass", "name"), "Curium/Berkelium");
        assert.equal(await convertElements("1100", "melt", "symbol"), "Md/No");
        assert.equal(await convertElements("247 1", "atomic_mass", "number", true), "96/971");
    });
    it("matches measured values typed rounded", async () => {
        assert.equal(await convertElements("1.01", "atomic_mass", "name"), "Hydrogen");
        assert.equal(await convertElements("1.0080", "atomic_mass", "name"), "Hydrogen");
        assert.equal(await convertElements("14", "melt", "name"), "Hydrogen");
        // Only measured values: atomic numbers and symbols must be exact
        await assert.rejects(() => convertElements("1.0", "number", "name"), /No element/);
    });
    it("says when an element has no value to convert to", async () => {
        await assert.rejects(() => convertElements("Og", "symbol", "melt"), /Oganesson has no melting point/);
    });
    it("ignores case, and keeps the separator used", async () => {
        assert.equal(await convertElements("se, n,TE", "symbol", "number"), "34, 7, 52");
        assert.equal(await convertElements("hydrogen", "name", "symbol"), "H");
    });
    it("matches on the property converted from only", async () => {
        // "26" is iron's atomic number, but no element melts at or near 26 K
        await assert.rejects(() => convertElements("26", "melt", "name"), /No element has the melting point "26"/);
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
