import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { findIcons, iconMap, fontVersion, SCSS } from "../../scripts/icons.mjs";

// The site ships a cut-down Bootstrap Icons font (scripts/icons.mjs), so an icon missing from it shows as nothing
describe("icon font", () => {
    const icons = findIcons();
    const scss = fs.readFileSync(SCSS, "utf8");

    it("only uses names that are Bootstrap Icons", () => {
        const map = iconMap();
        assert.deepEqual(icons.filter((name) => !(name in map)), [], "Not Bootstrap Icons names - check the spelling");
    });
    it("includes every icon the site uses (run npm run icons)", () => {
        assert.deepEqual(icons.filter((name) => !scss.includes(`.bi-${name}::before`)), []);
    });
    it("links the font it was built with (run npm run icons)", () => {
        assert.ok(scss.includes(`bootstrap-icons.woff2?v=${fontVersion()}"`));
    });
});
