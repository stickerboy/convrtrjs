import { readExifTags, summariseExif } from '../../lib/files/exif.js';
import { bindFileDrop } from '../../ui/file-drop.js';
import { escapeHtml } from '../../ui/tool-frame.js';

// Convrtrs' address, from the link in the intro, so it follows the site's base path
const convrtrsUrl = document.querySelector("[data-convrtrs-link]").href;
// The longest text sent to Convrtrs in a link, as Convrtrs reads no more
const LINK_LIMIT = 10000;
const ENCODING_NAMES = { binary: "binary", hex: "hex", base64: "Base64" };

const fileSize = (bytes) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
const degrees = (value, positive, negative) => `${Math.abs(value).toFixed(5)}° ${value >= 0 ? positive : negative}`;
const plural = (count, word) => `${count.toLocaleString()} ${word}${count === 1 ? "" : "s"}`;

// A value, marked if it's a text field, with what it looks encoded as and a link to decode it in Convrtrs. The value
// goes in the link after #, so it isn't sent anywhere, and Convrtrs only ever puts it in a box as text.
function valueHtml(tag) {
    const value = escapeHtml(tag.value || "—");
    if (!tag.text) {
        return value;
    }
    const link = tag.encoding && tag.value.length <= LINK_LIMIT
        ? ` · <a href="${escapeHtml(`${convrtrsUrl}#${tag.encoding}=${encodeURIComponent(tag.value)}`)}" class="text-convrtr" target="_blank" rel="noopener">` +
          `Open in Convrtrs<span class="visually-hidden"> (new tab)</span></a>`
        : "";
    const hint = tag.encoding ? `<span class="exif-hint">Looks like ${ENCODING_NAMES[tag.encoding]}${link}</span>` : "";
    return `<mark>${value}</mark>${hint}`;
}

const rowsHtml = (rows) => rows.map(([name, html]) => `<dt>${escapeHtml(name)}</dt><dd>${html}</dd>`).join("");
const card = (title, rows, { icon = "", warn = false, extra = "" } = {}) =>
    `<section class="exif-card${warn ? " exif-card--warn" : ""}"><h3 class="exif-card__title">${icon}${title}</h3>` +
    `<dl class="exif-tags">${rowsHtml(rows)}</dl>${extra}</section>`;

// The highlights: text fields, location, camera and dates, each only when the image has it
function cardsHtml({ textFields, location, camera, dates }) {
    const cards = [];
    if (textFields.length) {
        cards.push(card("Text fields", textFields.map((tag) => [`${tag.name} (${tag.group})`, valueHtml(tag)]),
            { icon: `<i class="bi bi-exclamation-triangle" aria-hidden="true"></i>`, warn: true }));
    }
    if (location) {
        const { latitude, longitude } = location;
        const map = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
        cards.push(card("Location", [
            ["Latitude", degrees(latitude, "N", "S")], ["Longitude", degrees(longitude, "E", "W")],
            ...(location.altitude ? [["Altitude", escapeHtml(location.altitude)]] : []),
        ], { icon: `<i class="bi bi-geo-alt" aria-hidden="true"></i>`, extra:
            `<p class="exif-card__link"><a href="${escapeHtml(map)}" class="text-convrtr" target="_blank" rel="noopener">` +
            `Open in OpenStreetMap<span class="visually-hidden"> (new tab)</span> <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p>` }));
    }
    if (camera.length) {
        cards.push(card("Camera", camera.map(([name, value]) => [name, escapeHtml(value)])));
    }
    if (dates.length) {
        cards.push(card("Dates", dates.map(([name, value]) => [name, escapeHtml(value)])));
    }
    return cards.length ? `<div class="exif-cards">${cards.join("")}</div>` : "";
}

// Every tag, in a fold per group, closed; filtering opens the groups with a match
function foldsHtml(groups, query) {
    const search = query.trim().toLowerCase();
    const shown = groups.map((group) => ({ ...group, tags: group.tags.filter((tag) =>
        !search || tag.name.toLowerCase().includes(search) || tag.value.toLowerCase().includes(search)) }))
        .filter((group) => group.tags.length);
    if (!shown.length) {
        return { html: `<p class="file-empty">No tags match “${escapeHtml(query.trim())}”</p>`, count: 0 };
    }
    return {
        html: shown.map((group) => `<details class="tool-fold"${search ? " open" : ""}><summary>` +
            `<i class="bi bi-chevron-right tool-fold__chevron" aria-hidden="true"></i>${escapeHtml(group.name)}<small>${plural(group.tags.length, "tag")}</small></summary>` +
            `<div class="exif-fold"><dl class="exif-tags">${rowsHtml(group.tags.map((tag) => [tag.name, valueHtml(tag)]))}</dl></div></details>`).join(""),
        count: shown.reduce((sum, group) => sum + group.tags.length, 0),
    };
}

const copyText = (groups) => groups.map((group) =>
    [group.name, ...group.tags.map((tag) => `${tag.name}: ${tag.value}`)].join("\n")).join("\n\n");

bindFileDrop({
    id: "exif",
    errorPrefix: "Couldn't read the image",
    run: async ([file], output) => {
        const meta = (summary) => [summary?.groups.find((g) => g.id === "file")?.tags.find((t) => t.name === "FileType")?.value || file.type,
            fileSize(file.size), summary?.width && summary?.height ? `${summary.width} × ${summary.height}` : null].filter(Boolean).join(" · ");
        let summary;
        try {
            summary = summariseExif(await readExifTags(file, true));
        } catch (error) {
            if (error.name !== "MetadataMissingError") {
                throw error;
            }
        }
        const heading = (badges = "") => `<div class="file-summary"><span class="file-summary__name">${escapeHtml(file.name)}</span>` +
            `<span class="file-summary__meta">${escapeHtml(meta(summary))}</span>${badges}</div>`;
        if (!summary?.count) {
            output.innerHTML = heading() + `<p class="file-empty">This image has no Exif or other metadata the reader can find.</p>`;
            delete output.dataset.copy;
            return "";
        }

        const { groups, count, textFields, location } = summary;
        const badges = `<span class="file-summary__badges"><span class="file-badge">${plural(count, "tag")}</span>` +
            (location ? `<span class="file-badge file-badge--warn">Has a location</span>` : "") +
            (textFields.length ? `<span class="file-badge file-badge--warn">${plural(textFields.length, "text field")}</span>` : "") + `</span>`;
        output.innerHTML = heading(badges) + `<div data-exif-cards>${cardsHtml(summary)}</div>` +
            `<div class="exif-all"><h3 class="exif-all__title">Every tag</h3>` +
            `<div class="exif-all__filter"><div class="input-group"><label class="input-group-text" for="exifFilter"><i class="bi bi-search" aria-hidden="true"></i>` +
            `<span class="visually-hidden">Filter tags</span></label><input type="search" class="form-control" id="exifFilter" ` +
            `placeholder="Filter tags, such as date or GPS" autocomplete="off" spellcheck="false" aria-describedby="exifFilterCount"></div>` +
            `<span class="tool-pane__status" id="exifFilterCount" role="status"></span></div><div data-exif-folds>${foldsHtml(groups, "").html}</div></div>`;
        output.dataset.copy = copyText(groups);

        // Filtering hides the highlights, so what matches is in view
        const filter = output.querySelector("#exifFilter");
        filter.addEventListener("input", () => {
            const { html, count: matched } = foldsHtml(groups, filter.value);
            output.querySelector("[data-exif-folds]").innerHTML = html;
            output.querySelector("[data-exif-cards]").hidden = filter.value.trim() !== "";
            output.querySelector("#exifFilterCount").textContent = filter.value.trim() ? `${matched} of ${plural(count, "tag")}` : "";
        });
        return "";
    },
});
