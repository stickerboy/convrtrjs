import { loadScript } from "../load-script.js";

const EXIF_READER_URL = new URL("../../vendor/exif-reader.js", import.meta.url);

/**
 * Reads the Exif / metadata tags from an image file. Loads ExifReader on first use.
 *
 * @param {Blob} file - The image file to read.
 * @returns {Promise<Object<string, {value: *, description: string}>>} - The tags, keyed by tag name.
 */
export async function readExifTags(file) {
    await loadScript(EXIF_READER_URL);
    return window.ExifReader.load(await file.arrayBuffer(), { includeUnknown: true, async: true });
}
