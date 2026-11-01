export default function (eleventyConfig) {
    eleventyConfig.addShortcode("year", () => `2013 &mdash; ${new Date().getFullYear()}`);

    // Items whose `key` equals `value`, e.g. nav | where("id", "search") | first
    eleventyConfig.addFilter("where", (array, key, value) => (array || []).filter((item) => item?.[key] === value));

    eleventyConfig.addFilter("dateISO", (date) => new Date(date).toISOString());

    // Dates are read in UTC, so local builds match CI. Month names come from a lookup rather than toLocaleString, which
    // is slow, and the changelog panel formats every release's date on every page.
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // e.g. "September 04, 2025"
    eleventyConfig.addFilter("readableDate", (date) => {
        const d = new Date(date);
        return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}, ${d.getUTCFullYear()}`;
    });

    // e.g. "Sep 2025"
    eleventyConfig.addFilter("monthYear", (date) => {
        const d = new Date(date);
        return `${months[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
    });
}
