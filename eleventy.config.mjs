import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load allowed tags from JSON file
const allowedTagsPath = path.join(__dirname, "_data", "labels.json");
const allowedTagsData = JSON.parse(fs.readFileSync(allowedTagsPath, "utf-8"));

export default function (eleventyConfig) {
    eleventyConfig.ignores.add("README.md");
    eleventyConfig.ignores.add("_templates/");
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

    // Only allow certian tags within changelogs
    const allowedTags = allowedTagsData.labels;
    const allowedTagKeys = allowedTags.map((tag) => tag.key); 

    eleventyConfig.on("beforeBuild", () => {
        const outputDir = path.join(process.cwd(), "_site");

        // Check if the _site directory exists
        if (fs.existsSync(outputDir)) {
            // Read all files and subdirectories inside _site
            const files = fs.readdirSync(outputDir);

            // Iterate over each file/subdirectory and remove it
            files.forEach((file) => {
                const filePath = path.join(outputDir, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    // Remove subdirectory recursively
                    fs.rmSync(filePath, { recursive: true, force: true });
                    // Recreate the subdirectory
                    fs.mkdirSync(filePath);
                } else {
                    // Remove file
                    fs.unlinkSync(filePath);
                }
            });

            console.log("Cleaned and recreated contents of _site directory.");
        }

        const changelogDir = path.join(__dirname, "changelog");
        const files = fs.readdirSync(changelogDir).filter((file) => file.endsWith(".md"));

        files.forEach((file) => {
            const filePath = path.join(changelogDir, file);
            const content = fs.readFileSync(filePath, "utf-8");

            // Extract front matter using gray-matter
            const frontMatter = matter(content).data;

            if (frontMatter.tags) {
                const invalidTags = frontMatter.tags.filter((tag) => !allowedTagKeys.includes(tag));
                if (invalidTags.length > 0) {
                    throw new Error(`Invalid tags found in "${file}": ${invalidTags.join(", ")}`);
                }
            }
        });
    });

    eleventyConfig.addCollection("versions", (collectionApi) => {
        return collectionApi.getFilteredByGlob("./changelog/*.md").sort((a, b) => {
            const parseVersion = (version) => version.split('.').map(Number);
            const [aMajor, aMinor, aPatch] = parseVersion(a.data.title);
            const [bMajor, bMinor, bPatch] = parseVersion(b.data.title);

            // Compare major, then minor, then patch
            if (aMajor !== bMajor) {
                return bMajor - aMajor; // Sort by major version (descending)
            }
            if (aMinor !== bMinor) {
                return bMinor - aMinor; // Sort by minor version (descending)
            }
            return bPatch - aPatch; // Sort by patch version (descending)
        });
    });

    // Automatically set permalink for changelog items
    eleventyConfig.addGlobalData("eleventyComputed", {
        permalink: (data) => {
            if (data.page.inputPath.includes("changelog/")) {
                const versionSlug = data.page.fileSlug; // Use the file name (e.g., "2.0.0")
                return `/changelog/${versionSlug}/`; // Set the desired permalink
            }
            return data.permalink; // Keep existing permalink for other files
        },
        description: (data) => {
            if (data.page.inputPath.includes("changelog/")) {
                const date = new Date(data.date);
                return `Released on ${date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}`;
            }
            return data.description; // Keep existing description for other pages
        }
    });
}
