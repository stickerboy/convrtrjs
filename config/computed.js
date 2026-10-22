import { lastModified } from "./git-dates.js";

const isToolPage = (data) => data.page.inputPath.includes("/pages/");
const isChangelogEntry = (data) => data.page.inputPath.includes("/changelog/");

/**
 * Global computed data, applied to every template.
 */
export default {
    permalink: (data) => {
        if (data.customPermalink) {
            return data.customPermalink;
        }
        // ./pages/hex/shift.liquid -> /hex/shift/
        if (isToolPage(data)) {
            return `/${data.page.inputPath.replace(/^.*\/pages\//, "").replace(/\.[^/.]+$/, "")}/`;
        }
        // ./changelog/3/3.10/3.10.0.md -> /changelog/3.10.0/
        if (isChangelogEntry(data)) {
            return `/changelog/${data.page.fileSlug}/`;
        }
        return data.permalink;
    },

    description: (data) => {
        if (isChangelogEntry(data)) {
            const released = new Date(data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            return `Released on ${released}`;
        }
        return data.description;
    },

    // The tool category a page belongs to, e.g. "hex" for ./pages/hex/shift.liquid
    folderName: (data) => (isToolPage(data) ? data.page.inputPath.split("/").at(-2) : null),

    pageId: (data) => data.page.fileSlug,

    // Pages that render another file (e.g. privacy.md via renderFile) can set `lastmodFrom` to date that file instead
    lastmod: (data) => lastModified(data.lastmodFrom ? `./${data.lastmodFrom}` : data.page.inputPath),
};
