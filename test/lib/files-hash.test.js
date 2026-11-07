import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { getFileHeader, matchFileHeader, convertToHexString, HEADER_LENGTH, extensionOf, nameMismatch, looksLikeText } from "../../assets/js/lib/files/check.js";
import HEADERS from "../../assets/js/data/headers.json" with { type: "json" };
import { generateHashes, crc32 } from "../../assets/js/lib/ciphers/hash.js";

describe("file check", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0x0D, 0x49, 0x48, 0x44, 0x52, ...Array(24).fill(0xFF)]);
    const text = (string) => [...Buffer.from(string, "latin1")];

    it("formats bytes as hex", () => {
        assert.equal(convertToHexString(new Uint8Array([0, 15, 255])), "00 0f ff");
    });
    it("recognises a PNG header", () => {
        const match = matchFileHeader("89 50 4e 47 0d 0a 1a 0a");
        assert.equal(match.name, "PNG image");
        assert.deepEqual(match.extensions, ["png"]);
        assert.equal(match.header, "89 50 4E 47 0D 0A 1A 0A");
    });
    it("returns null for an unknown header", () => {
        assert.equal(matchFileHeader("00 11 22 33"), null);
    });
    it("only matches headers at the start of a file", () => {
        // "BM" (BMP) and "MZ" (Windows program) partway in
        assert.equal(matchFileHeader(text("hello BM MZ")), null);
    });
    it("prefers the longest header that matches", () => {
        assert.equal(matchFileHeader("FF FE 00 00 41 00").name, "UTF-32 text (little endian)");
        assert.equal(matchFileHeader("FF FE 41 00").name, "UTF-16 text (little endian)");
    });
    it("matches any byte where a header has ??", () => {
        const webp = [...text("RIFF"), 1, 2, 3, 4, ...text("WEBPVP8 ")];
        assert.equal(matchFileHeader(webp).name, "WebP image");
        assert.deepEqual(matchFileHeader(webp).mask, [true, true, true, true, false, false, false, false, true, true, true, true]);
        assert.equal(matchFileHeader([...text("RIFF"), 1, 2, 3, 4, ...text("WAVE")]).name, "WAV audio");
        assert.equal(matchFileHeader([...text("RIFF"), 1, 2, 3, 4, ...text("XXXX")]).name, "RIFF file");
        assert.equal(matchFileHeader([0, 0, 0, 0x18, ...text("ftypheic")]).name, "HEIC image");
        assert.equal(matchFileHeader([0, 0, 0, 0x18, ...text("ftypzzzz")]).name, "ISO media");
    });
    it("tells MP3 and GIF apart", () => {
        assert.equal(matchFileHeader(text("ID3\x03\x00")).name, "MP3 audio");
        assert.equal(matchFileHeader(text("GIF89a")).name, "GIF image");
    });
    it("matches the OpenSSH private key header within the bytes read", () => {
        assert.equal(matchFileHeader(text("-----BEGIN OPENSSH PRIVATE KEY-----\nb3Blbn")).name, "OpenSSH private key");
        assert.equal(matchFileHeader(text("-----BEGIN CERTIFICATE-----")).name, "PEM file");
    });
    it("reads the first 36 bytes of a file", async () => {
        const header = await getFileHeader(new Blob([png]));
        assert.equal(header.bytes.length, 36);
        assert.equal(header.hex.split(" ").length, 36);
        assert.equal(header.match.name, "PNG image");
    });
    it("keeps every header within the bytes read, written as hex or ??", () => {
        for (const { name, hex } of HEADERS) {
            for (const header of hex) {
                assert.match(header, /^(?:[0-9A-F]{2}|\?\?)(?: (?:[0-9A-F]{2}|\?\?))*$/, name);
                assert.ok(header.split(" ").length <= HEADER_LENGTH, name);
            }
        }
    });
    it("has no header twice", () => {
        const all = HEADERS.flatMap((type) => type.hex);
        assert.equal(new Set(all).size, all.length);
    });
    it("reads a name's extension, skipping version numbers after it", () => {
        assert.equal(extensionOf("photo.JPG"), "jpg");
        assert.equal(extensionOf("libz.so.1.2"), "so");
        assert.equal(extensionOf("archive.tar.gz"), "gz");
        assert.equal(extensionOf("report.2024"), "2024");
        assert.equal(extensionOf("README"), "");
    });
    it("warns when a name doesn't fit its header, but not for types any name fits", () => {
        const png = matchFileHeader("89 50 4E 47 0D 0A 1A 0A");
        assert.equal(nameMismatch("image.png", png), false);
        assert.equal(nameMismatch("notes.txt", png), true);
        assert.equal(nameMismatch("no-extension", png), false);
        // A byte order mark only says how text is stored, so a .json with one is fine
        const utf8 = matchFileHeader("EF BB BF 7B");
        assert.equal(utf8.anyName, true);
        assert.equal(nameMismatch("data.json", utf8), false);
        assert.equal(nameMismatch("macro.xlsm", matchFileHeader("50 4B 03 04")), false);
        assert.equal(nameMismatch("libz.so.1", matchFileHeader("7F 45 4C 46")), false);
        assert.equal(nameMismatch("anything.bin", null), false);
    });
    it("tells plain text from binary", () => {
        const bytes = (text) => new TextEncoder().encode(text);
        assert.equal(looksLikeText(bytes("Hello, world!\r\n\tSecond line")), true);
        assert.equal(looksLikeText(bytes("Café ✓ 😀")), true);
        // The bytes read can end halfway through a character
        assert.equal(looksLikeText(bytes("abc😀").subarray(0, 5)), true);
        assert.equal(looksLikeText(new Uint8Array([0x00, 0x01, 0x02, 0x41])), false);
        assert.equal(looksLikeText(new Uint8Array([0xFF, 0x41, 0x42, 0x43, 0x44])), false);
        assert.equal(looksLikeText(new Uint8Array()), false);
    });
});

describe("hashes", () => {
    // Standard test vectors (NIST / RFC 1321 / Keccak team)
    const vectors = {
        MD5: ["abc", "900150983cd24fb0d6963f7d28e17f72"],
        SHA1: ["abc", "a9993e364706816aba3e25717850c26c9cd0d89d"],
        RIPEMD160: ["", "9c1185a5c5e9fc54612808977ee8f548b2258d31"],
        SHA224: ["abc", "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7"],
        SHA256: ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
        SHA384: ["abc", "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7"],
        SHA512: ["abc", "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"],
        SHA3256: ["", "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a"],
        KECCAK256: ["", "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"],
        CRC32: ["123456789", "cbf43926"],
    };
    for (const [method, [input, expected]] of Object.entries(vectors)) {
        it(method, async () => assert.equal(await generateHashes(input, method), expected));
    }
    it("hashes text as UTF-8 (checked against Node's crypto and zlib)", async () => {
        const text = "Café ✓ 😀";
        assert.equal(await generateHashes(text, "MD5"), crypto.createHash("md5").update(text, "utf8").digest("hex"));
        assert.equal(await generateHashes(text, "SHA3256"), crypto.createHash("sha3-256").update(text, "utf8").digest("hex"));
        assert.equal(crc32(text), (zlib.crc32(Buffer.from(text, "utf8")) >>> 0).toString(16).padStart(8, "0"));
    });
    it("reports an unknown method", async () => {
        assert.equal(await generateHashes("x", "NOPE"), "Invalid hash method provided or not supported");
    });
});
