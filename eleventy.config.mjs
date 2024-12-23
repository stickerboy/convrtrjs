import fs from "fs";
import path from "path";

export default function (eleventyConfig) {
    eleventyConfig.ignores.add("README.md");
    eleventyConfig.setWatchThrottleWaitTime(100);
    eleventyConfig.addPassthroughCopy("assets/css/*.css");
    eleventyConfig.addPassthroughCopy("assets/favicons/*");
    eleventyConfig.addPassthroughCopy("assets/img/*");
    eleventyConfig.addPassthroughCopy("assets/fonts/*");
    eleventyConfig.addPassthroughCopy("assets/js/**/*.js");
    eleventyConfig.addPassthroughCopy("assets/js/**/*.mjs");
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    eleventyConfig.addFilter("fileExists", (filePath) => {
        const fullPath = path.join("_includes", filePath);
        return fs.existsSync(fullPath);
    });
    eleventyConfig.addFilter("assetExists", function(filePath) {
        const fullJSPath = path.join("assets", filePath);
        return fs.existsSync(fullJSPath);
    });
    eleventyConfig.addFilter("listFiles", function(folderPath) {
        const fullPath = path.join("_includes", folderPath);
        return fs.readdirSync(fullPath).map(file => path.join(folderPath, file));
    });
    eleventyConfig.addFilter("listFilesWithInfo", function(folderPath) {
        const fullPath = path.join("_includes", folderPath);
        return fs.readdirSync(fullPath).map(file => {
            const fileNoExtension = path.parse(file).name;
            return {
                filePath: path.join(folderPath, file),
                fileName: fileNoExtension
            };
        });
    });
    eleventyConfig.addFilter("upperFirst", (filename) => `${filename.charAt(0).toUpperCase() + filename.slice(1)}`);
    eleventyConfig.setLiquidOptions({
        dynamicPartials: true,
        strict_filters: true,
    });
}
