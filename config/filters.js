export default function (eleventyConfig) {
    eleventyConfig.addShortcode("year", () => `2013 &mdash; ${new Date().getFullYear()}`);

    // Items whose `key` equals `value`, e.g. nav | where("id", "search") | first
    eleventyConfig.addFilter("where", (array, key, value) => (array || []).filter((item) => item?.[key] === value));

    eleventyConfig.addFilter("dateISO", (date) => new Date(date).toISOString());

    // e.g. "September 04, 2025" (UTC, so local builds match CI)
    eleventyConfig.addFilter("readableDate", (date) => {
        const d = new Date(date);
        const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
        return `${month} ${String(d.getUTCDate()).padStart(2, "0")}, ${d.getUTCFullYear()}`;
    });
}
