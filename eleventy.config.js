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

    // Data and content contain trusted HTML (descriptions, popovers), so output isn't escaped - matching Liquid
    eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: false });

    eleventyConfig.setLiquidOptions({
        dynamicPartials: true,
        strict_filters: true,
    });

    eleventyConfig.setWatchThrottleWaitTime(100);
}
