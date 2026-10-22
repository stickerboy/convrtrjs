import fs from "node:fs";
import path from "node:path";

export default function (eleventyConfig) {
    eleventyConfig.addShortcode("year", () => `2013 &mdash; ${new Date().getFullYear()}`);

    eleventyConfig.addFilter("fileExists", (filePath, joinPath = "_includes") => fs.existsSync(path.join(joinPath, filePath)));

    // No-op stand-in for Nunjucks' built-in `safe` - remove once templates are converted
    eleventyConfig.addFilter("safe", (content) => content);

    eleventyConfig.addFilter("dateISO", (date) => new Date(date).toISOString());

    // Landing pages show every tool in a category, so reveal the collapse toggles hidden on single tool pages
    eleventyConfig.addFilter("removeHiddenClass", (content, isLandingPage) => {
        if (!isLandingPage) {
            return content;
        }
        return content.replace(/class="([^"]*d-none[^"]*)"/g, (match, classes) => `class="${classes.replace(/\bd-none\b/g, "").trim()}"`);
    });
}
