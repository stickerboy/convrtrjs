import { loadScript } from "../load-script.js";
import { guessEncoding } from "../text/convrtrs.js";

const EXIF_READER_URL = new URL("../../vendor/exif-reader.js", import.meta.url);

/**
 * Reads the Exif / metadata tags from an image file. Loads ExifReader on first use.
 *
 * @param {Blob} file - The image file to read.
 * @param {boolean} [expanded=false] - Group the tags by where they're stored (exif, gps, xmp, iptc, icc, file, …), as
 *   summariseExif takes them, rather than all in one object.
 * @returns {Promise<Object>} - The tags, keyed by tag name, or by group and then tag name.
 * @throws {Error} - If the file is bigger than MAX_EXIF_SIZE, or isn't an image format ExifReader reads. A
 *   MetadataMissingError if the image has no metadata.
 */
export async function readExifTags(file, expanded = false) {
    checkExifSize(file.size);
    await loadScript(EXIF_READER_URL);
    try {
        return await window.ExifReader.load(await file.arrayBuffer(), { includeUnknown: true, async: true, expanded });
    } catch (error) {
        if (error.message === "Invalid image format") {
            throw new Error("it isn't an image the reader knows. It reads JPEG, TIFF, PNG, HEIC, AVIF, WebP and GIF");
        }
        throw error;
    }
}

// The biggest file read: it's read whole, and images with metadata are far smaller, so a bigger one is likely a video
// or disk image dropped by mistake, which could run the browser out of memory
export const MAX_EXIF_SIZE = 500 * 1024 * 1024;

/**
 * Checks a file isn't too big to read for metadata (see MAX_EXIF_SIZE).
 *
 * @param {number} size - The file's size, in bytes.
 * @returns {void}
 * @throws {Error} - If it's bigger than MAX_EXIF_SIZE.
 */
export function checkExifSize(size) {
    if (size > MAX_EXIF_SIZE) {
        throw new Error(`it's ${Math.round(size / 1048576).toLocaleString()} MB, and the reader takes files up to 500 MB. Images with metadata are far smaller`);
    }
}

// ExifReader's groups, in the order they're shown, and what each is called. GPS tags are read with the Exif ones, and
// split out here.
const GROUPS = {
    file: "File", jfif: "JFIF", exif: "Exif", gpsTags: "GPS", xmp: "XMP", iptc: "IPTC", icc: "Colour profile (ICC)",
    png: "PNG", pngText: "PNG text", riff: "WebP", gif: "GIF", mpf: "Multi-picture (MPF)", photoshop: "Photoshop",
    makerNotes: "Maker notes", composite: "Composite", Thumbnail: "Thumbnail",
};

// Tags meant for words, where puzzle makers hide things; any tag whose value looks encoded counts too
const TEXT_TAGS = new Set([
    "ImageDescription", "UserComment", "XPComment", "XPTitle", "XPSubject", "XPKeywords", "XPAuthor", "Artist", "Copyright",
    "DocumentName", "PageName", "Comment", "Comments", "description", "title", "subject", "creator", "rights", "Label",
    "Caption/Abstract", "Headline", "Keywords", "By-line", "Object Name", "Special Instructions", "Copyright Notice",
]);

// Bookkeeping, not information: where the Exif data keeps its other parts
const SKIPPED = /IFD Pointer$|^(?:image|base64|type)$/;

// A tag's value as text: ExifReader's description, which is readable (or its value, if it has none)
function describe(tag) {
    const value = tag.description ?? tag.value;
    return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

/**
 * @typedef {object} ExifTag
 * @property {string} name - The tag's name, e.g. "DateTimeOriginal".
 * @property {string} value - Its value as text.
 * @property {boolean} text - Whether it's a text field, or looks encoded.
 * @property {"binary"|"hex"|"base64"|null} encoding - What the value looks encoded as, if anything.
 */

/**
 * Sorts ExifReader's grouped tags (readExifTags with expanded) into what the Exif reader shows: each group's tags, the
 * text fields, and the location, camera and dates, where the image has them.
 *
 * @param {Object} tags - The tags, grouped, as ExifReader gives them.
 * @returns {{groups: {id: string, name: string, tags: ExifTag[]}[], count: number, textFields: (ExifTag & {group: string})[],
 *   location: {latitude: number, longitude: number, altitude: string|null}|null, camera: [string, string][],
 *   dates: [string, string][], width: number|null, height: number|null}}
 */
export function summariseExif(tags) {
    const exif = tags.exif ?? {};
    const split = {
        ...tags,
        exif: Object.fromEntries(Object.entries(exif).filter(([name]) => !name.startsWith("GPS"))),
        gpsTags: Object.fromEntries(Object.entries(exif).filter(([name]) => name.startsWith("GPS"))),
    };

    const groups = Object.entries(GROUPS).map(([id, name]) => ({
        id, name,
        tags: Object.entries(split[id] ?? {})
            .filter(([tagName, tag]) => !SKIPPED.test(tagName) && tag && typeof tag === "object" && ("description" in tag || "value" in tag))
            .map(([tagName, tag]) => {
                const value = describe(tag).trim();
                const encoding = value.length <= 10000 ? guessEncoding(value) : null;
                return { name: tagName, value, encoding, text: Boolean(value) && (TEXT_TAGS.has(tagName) || encoding !== null) };
            }),
    })).filter((group) => group.tags.length > 0);

    const find = (group, name) => groups.find((g) => g.id === group)?.tags.find((tag) => tag.name === name)?.value || null;
    const pairs = (list) => list.filter(([, value]) => value);

    const gps = tags.gps;
    const location = Number.isFinite(gps?.Latitude) && Number.isFinite(gps?.Longitude)
        ? { latitude: gps.Latitude, longitude: gps.Longitude, altitude: find("gpsTags", "GPSAltitude") }
        : null;

    const exposure = [find("exif", "ExposureTime") && `${find("exif", "ExposureTime")} s`, find("exif", "FNumber"),
        find("exif", "ISOSpeedRatings") && `ISO ${find("exif", "ISOSpeedRatings")}`].filter(Boolean).join(" · ");
    const camera = pairs([
        ["Make", find("exif", "Make")], ["Model", find("exif", "Model")], ["Lens", find("exif", "LensModel")],
        ["Exposure", exposure], ["Focal length", find("exif", "FocalLength")], ["Software", find("exif", "Software")],
    ]);

    const gpsDate = [find("gpsTags", "GPSDateStamp"), find("gpsTags", "GPSTimeStamp")].filter(Boolean).join(" ");
    const dates = pairs([
        ["Taken", find("exif", "DateTimeOriginal")], ["Digitised", find("exif", "DateTimeDigitized")],
        ["Modified", find("exif", "DateTime")], ["GPS time (UTC)", gpsDate],
        ["Created (XMP)", find("xmp", "CreateDate")], ["Modified (XMP)", find("xmp", "ModifyDate")],
        ["Created (IPTC)", find("iptc", "Date Created")],
    ]);

    const number = (group, name) => parseInt(find(group, name), 10) || null;
    return {
        groups,
        count: groups.reduce((sum, group) => sum + group.tags.length, 0),
        textFields: groups.flatMap((group) => group.tags.filter((tag) => tag.text).map((tag) => ({ ...tag, group: group.name }))),
        location,
        camera,
        dates,
        width: number("file", "Image Width") ?? number("exif", "PixelXDimension") ?? number("png", "Image Width"),
        height: number("file", "Image Height") ?? number("exif", "PixelYDimension") ?? number("png", "Image Height"),
    };
}
