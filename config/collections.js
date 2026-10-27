import fs from "node:fs";
import labels from "../_data/labels.json" with { type: "json" };

const TAG_PAGE_SIZE = 20;
const allowedTags = labels.labels.map((label) => label.key);

// Each folder in pages/ is a tool category (ciphers, hex, text, ...)
const categories = fs.readdirSync("pages", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

/**
 * All changelog entries, newest version first.
 * Throws if an entry uses a tag that isn't defined in _data/labels.json.
 */
function getVersions(collectionApi) {
    const versions = collectionApi.getFilteredByGlob("./changelog/**/*.md");

    for (const item of versions) {
        const invalidTags = (item.data.tags || []).filter((tag) => !allowedTags.includes(tag));
        if (invalidTags.length > 0) {
            throw new Error(`Invalid tags found in "${item.inputPath}": ${invalidTags.join(", ")}`);
        }
    }

    // Numeric collation compares "3.10.0" > "3.9.0" segment by segment
    return versions.sort((a, b) => b.data.title.localeCompare(a.data.title, undefined, { numeric: true }));
}

/**
 * Splits the changelog into paginated tag pages (/changelog/tag/<tag>/, /changelog/tag/<tag>/2/, ...).
 */
function getTagPages(collectionApi) {
    const tagMap = new Map();

    for (const item of getVersions(collectionApi)) {
        for (const tag of item.data.tags || []) {
            if (!tagMap.has(tag)) {
                tagMap.set(tag, []);
            }
            tagMap.get(tag).push(item);
        }
    }

    return [...tagMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .flatMap(([tag, items]) => {
            const totalPages = Math.ceil(items.length / TAG_PAGE_SIZE);
            const base = `/changelog/tag/${encodeURIComponent(tag)}/`;
            const hrefs = Array.from({ length: totalPages }, (_, i) => (i === 0 ? base : `${base}${i + 1}/`));

            return hrefs.map((href, pageIndex) => ({
                tag,
                permalink: href,
                items: items.slice(pageIndex * TAG_PAGE_SIZE, (pageIndex + 1) * TAG_PAGE_SIZE),
                pagination: {
                    label: `Pagination for ${tag} changelog pages`,
                    pageNumber: pageIndex,
                    pages: hrefs.map((_, i) => i + 1),
                    hrefs,
                    href: {
                        first: hrefs[0],
                        last: hrefs[hrefs.length - 1],
                    },
                    previousPageHref: hrefs[pageIndex - 1] ?? null,
                    nextPageHref: hrefs[pageIndex + 1] ?? null,
                },
            }));
        });
}

export default function (eleventyConfig) {
    // One collection per tool category, e.g. collections.ciphers - sorted by name to match the sidebar
    for (const category of categories) {
        eleventyConfig.addCollection(category, (collectionApi) =>
            collectionApi.getFilteredByGlob(`./pages/${category}/*`)
                .sort((a, b) => a.fileSlug.localeCompare(b.fileSlug))
        );
    }

    eleventyConfig.addCollection("versions", getVersions);
    eleventyConfig.addCollection("filteredTagPages", getTagPages);

    // Old URLs listed in a page's `redirectFrom` (string or list) - redirect pages are built by redirects.njk
    eleventyConfig.addCollection("redirects", (collectionApi) =>
        collectionApi.getAll().flatMap((item) => [item.data.redirectFrom ?? []].flat().map((from) => ({ from, to: item.url })))
    );
}
