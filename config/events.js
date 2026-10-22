import fs from "node:fs";
import path from "node:path";
import * as pagefind from "pagefind";
import { resetGitDates } from "./git-dates.js";

export default function (eleventyConfig) {
    eleventyConfig.on("eleventy.before", ({ directories }) => {
        // Start from a clean output directory so stale pages/folders don't linger
        // (retries cover Windows briefly locking files, e.g. editors/indexers holding them open)
        fs.rmSync(directories.output, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
        resetGitDates();
    });

    // Build the Pagefind search index from the generated HTML
    eleventyConfig.on("eleventy.after", async ({ directories }) => {
        const { index, errors } = await pagefind.createIndex();
        if (errors.length) {
            throw new Error(`Pagefind: ${errors.join(", ")}`);
        }

        try {
            const added = await index.addDirectory({ path: directories.output, glob: "**/*.html" });
            const written = await index.writeFiles({ outputPath: path.join(directories.output, "pagefind") });
            const failures = [...added.errors, ...written.errors];
            if (failures.length) {
                throw new Error(`Pagefind: ${failures.join(", ")}`);
            }
            console.log(`[pagefind] Indexed ${added.page_count} pages`);
        } finally {
            await pagefind.close();
        }
    });
}
