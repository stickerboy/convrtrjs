const fs = require('node:fs');
const path = require('node:path');

module.exports = function(eleventyConfig) {
    eleventyConfig.ignores.add("README.md");
    eleventyConfig.setWatchThrottleWaitTime(100);
    eleventyConfig.addPassthroughCopy("assets/css/*.css");
    eleventyConfig.addPassthroughCopy("assets/favicons/*");
    eleventyConfig.addPassthroughCopy("assets/img/*");
    eleventyConfig.addPassthroughCopy("assets/fonts/*");
    eleventyConfig.addPassthroughCopy("assets/js/**/*.js");
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    eleventyConfig.addFilter('fileExists', function(filePath) {
        const fullPath = path.join('_includes', filePath);
        return fs.existsSync(fullPath);
    });
    eleventyConfig.addFilter('assetExists', function(filePath) {
        const fullJSPath = path.join('assets', filePath);
        console.log(fullJSPath);
        return fs.existsSync(fullJSPath);
    });
}