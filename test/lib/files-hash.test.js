import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { getFileHeader, matchFileHeader, convertToHexString } from "../../assets/js/lib/files/check.js";
import { generateHashes, crc32 } from "../../assets/js/lib/ciphers/hash.js";

describe("file check", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0x0D, 0x49, 0x48, 0x44, 0x52, 0xFF, 0xFF]);

    it("formats bytes as hex", () => {
        assert.equal(convertToHexString(new Uint8Array([0, 15, 255])), "00 0f ff");
    });
    it("recognises a PNG header", () => {
        assert.match(matchFileHeader("89 50 4e 47 0d 0a 1a 0a"), /Portable Network Graphics/);
    });
    it("returns null for an unknown header", () => {
        assert.equal(matchFileHeader("00 11 22 33"), null);
    });
    it("reads only the first 16 bytes of a file", async () => {
        const header = await getFileHeader(new Blob([png]));
        assert.equal(header.hex, "89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52");
        assert.match(header.label, /Portable Network Graphics/);
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
