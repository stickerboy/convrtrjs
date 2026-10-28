import { RenderPlugin } from "@11ty/eleventy";
import collections from "./config/collections.js";
import computed from "./config/computed.js";
import events from "./config/events.js";
import filters from "./config/filters.js";

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(RenderPlugin);
    eleventyConfig.addPlugin(filters);
    eleventyConfig.addPlugin(collections);
    eleventyConfig.addPlugin(events);
    eleventyConfig.addGlobalData("eleventyComputed", computed);
    eleventyConfig.addGlobalData("layout", "layouts/base.njk");

    // Repo docs - kept in the root for GitHub, rendered onto /community pages via renderFile
    [
        ".github/",
        "_templates/",
        "a11y.md",
        "about.md",
        "privacy.md",
        "README.md",
        "SECURITY.md",
        "CONTRIBUTING.md",
        "CODE_OF_CONDUCT.md",
        "LICENSE",
    ].forEach((ignore) => eleventyConfig.ignores.add(ignore));

    ["assets/css/*.css", "assets/favicons", "assets/img", "assets/fonts", "assets/js"].forEach((asset) =>
        eleventyConfig.addPassthroughCopy(asset)
    );

    // npm packages used in the browser, mapped to their bare names by the import map in layouts/base.njk
    eleventyConfig.addPassthroughCopy({
        "node_modules/@noble/hashes/*.js": "assets/js/vendor/noble-hashes",
        "node_modules/@noble/hashes/LICENSE": "assets/js/vendor/noble-hashes/LICENSE",
    });

    // Data and content contain trusted HTML (descriptions, popovers), so output isn't escaped
    eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: false });

    // Shared JSON data used by both the browser JS and templates (_data/elements.js, _data/headers.js)
    eleventyConfig.addWatchTarget("assets/js/data/");
    eleventyConfig.setWatchThrottleWaitTime(100);
}

export const config = {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
};
