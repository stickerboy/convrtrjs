// Filters the file headers table by name, description, extension or hex. Hex can be typed with any separators (or none)
// and matches anywhere in a header, between its ?? bytes.
const filter = document.getElementById("headersFilter");
const count = document.getElementById("headersCount");
const empty = document.getElementById("headersEmpty");
const rows = [...document.querySelectorAll("[data-search]")];

filter.addEventListener("input", () => {
    const query = filter.value.trim().toLowerCase();
    const hex = query.replace(/0x|\\x|[\s:,;%-]+/g, "");
    const isHex = hex.length >= 2 && /^[0-9a-f]+$/.test(hex);
    let shown = 0;
    for (const row of rows) {
        const match = !query || row.dataset.search.includes(query) || (isHex && row.dataset.hex.includes(hex));
        row.hidden = !match;
        shown += match;
    }
    empty.hidden = shown > 0;
    count.textContent = query ? `${shown} of ${rows.length} file types` : `${rows.length} file types`;
});
