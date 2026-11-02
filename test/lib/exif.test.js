import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { summariseExif } from "../../assets/js/lib/files/exif.js";

// Tags as ExifReader gives them with expanded: true
const tag = (description) => ({ value: description, description });
const sample = {
    file: { FileType: tag("JPEG"), "Image Width": tag("1306px"), "Image Height": tag("707px") },
    exif: {
        Make: tag("Apple"), Model: tag("iPhone 13"), ImageDescription: tag("dGhlIGtleSBpcyB1bmRlciB0aGUgcm9jaw=="),
        Artist: tag("57 45 53 54"), Copyright: tag("Look closer"), Software: tag("16.4.1"),
        "Exif IFD Pointer": tag(212), ExposureTime: tag("1/120"), FNumber: tag("f/1.6"), ISOSpeedRatings: tag(64),
        DateTimeOriginal: tag("2024:03:14 09:26:53"), UserComment: tag(""),
        GPSLatitude: tag(55.8642), GPSAltitude: tag("38 m"),
    },
    gps: { Latitude: 55.8642, Longitude: -4.2518 },
    Thumbnail: { image: new ArrayBuffer(4), type: "image/jpeg" },
};

describe("Exif summary", () => {
    const summary = summariseExif(sample);
    it("groups the tags, with the GPS tags split from Exif and bookkeeping left out", () => {
        assert.deepEqual(summary.groups.map((g) => g.name), ["File", "Exif", "GPS"]);
        assert.deepEqual(summary.groups[2].tags.map((t) => t.name), ["GPSLatitude", "GPSAltitude"]);
        assert.ok(!summary.groups[1].tags.some((t) => t.name === "Exif IFD Pointer"));
        assert.equal(summary.count, 16);
    });
    it("finds text fields, saying what looks encoded, and skips empty ones", () => {
        assert.deepEqual(summary.textFields.map((t) => [t.name, t.encoding]),
            [["ImageDescription", "base64"], ["Artist", "hex"], ["Copyright", null]]);
    });
    it("pulls out the location, camera, dates and size", () => {
        assert.deepEqual(summary.location, { latitude: 55.8642, longitude: -4.2518, altitude: "38 m" });
        assert.deepEqual(summary.camera.find(([name]) => name === "Exposure"), ["Exposure", "1/120 s · f/1.6 · ISO 64"]);
        assert.deepEqual(summary.dates, [["Taken", "2024:03:14 09:26:53"]]);
        assert.equal(summary.width, 1306);
        assert.equal(summary.height, 707);
    });
    it("has no location without GPS coordinates", () => {
        assert.equal(summariseExif({ exif: { Make: tag("Apple") } }).location, null);
    });
});
