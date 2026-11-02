// Results for the frequency tools (Character frequencies, Hex frequencies): a row of figures, then tables of counts that
// sort by any column and scroll on their own, each in a fold when there are several. The counting lives in lib/.
import { escapeHtml } from "./tool-frame.js";

// Characters that show as nothing, or as something else, named instead
const NAMES = { 0: "NUL", 9: "Tab", 10: "New line", 13: "Return", 32: "Space", 127: "DEL", 160: "No-break space", 173: "Soft hyphen", 0x200B: "Zero-width space", 0xFEFF: "BOM" };

/**
 * A name for a character that can't be seen, such as "Space" or "New line", or null for one that can.
 *
 * @param {string} char - One character.
 * @returns {string|null}
 */
export function characterName(char) {
    const code = char.codePointAt(0);
    return NAMES[code] ?? (code < 32 || (code > 127 && code < 160) ? "Control" : null);
}

/** A character as a table cell's HTML, or its name, quietly marked, for one that can't be seen. */
export const characterCell = (char) => {
    const name = characterName(char);
    return name ? `<span class="frequency-table__name">${name}</span>` : escapeHtml(char);
};

// What each table is sorted by, kept between runs so live typing doesn't reset it, and what each output last showed
const sorts = new Map();
const shown = new WeakMap();
const DEFAULT_SORT = { key: "count", descending: true };

const percent = (count, total) => `${(count / total * 100).toFixed(1)}%`;

// Every table ends with how often each value appears, and its share of the table's total as a figure and a bar
const withCounts = (columns) => [
    ...columns,
    { key: "count", label: "Count", numeric: true, text: (row) => row.count.toLocaleString() },
    { key: "count", label: "Share", sortable: false, text: (row, total) => percent(row.count, total),
      html: (row, total, most) => `<span class="frequency-table__share"><span class="frequency-table__track" aria-hidden="true">` +
        `<span class="frequency-table__bar" style="width: ${(row.count / most * 100).toFixed(1)}%"></span></span>` +
        `<span class="frequency-table__percent">${percent(row.count, total)}</span></span>` },
];

// A table's rows in their sort order: ties stay in the order the values first appear
function sortedRows(table) {
    const { key, descending } = sorts.get(table.id) ?? DEFAULT_SORT;
    const column = table.columns.find((c) => c.key === key);
    return table.rows.map((row, index) => ({ row, index })).sort((a, b) => {
        const [x, y] = [a.row[key], b.row[key]];
        const order = column?.numeric || key === "count" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return (descending ? -order : order) || a.index - b.index;
    }).map(({ row }) => row);
}

function tableHtml(table) {
    const sort = sorts.get(table.id) ?? DEFAULT_SORT;
    const columns = withCounts(table.columns);
    const total = table.rows.reduce((sum, row) => sum + row.count, 0);
    const most = Math.max(...table.rows.map((row) => row.count));
    const head = columns.map((column) => {
        const classes = column.numeric ? ` class="text-end"` : "";
        if (column.sortable === false) {
            return `<th scope="col"${classes}>${column.label}</th>`;
        }
        const sorted = sort.key === column.key;
        const arrow = sorted ? `<i class="bi ${sort.descending ? "bi-arrow-down-short" : "bi-arrow-up-short"}" aria-hidden="true"></i>` : "";
        return `<th scope="col"${classes}${sorted ? ` aria-sort="${sort.descending ? "descending" : "ascending"}"` : ""}>` +
            `<button type="button" data-sort="${column.key}">${column.label}${arrow}</button></th>`;
    }).join("");
    const cellClass = (column) => [column.numeric && "text-end", column.mono && "font-monospace"].filter(Boolean).join(" ");
    const body = sortedRows(table).map((row) => `<tr>${columns.map((column) =>
        `<td${cellClass(column) ? ` class="${cellClass(column)}"` : ""}>` +
        `${column.html ? column.html(row, total, most) : escapeHtml(column.text(row, total))}</td>`).join("")}</tr>`).join("");
    return `<table class="frequency-table__table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

// The results as text for select, copy and download: the figures, then each table as tab-separated columns, which paste
// into a spreadsheet
function copyText({ stats, tables }) {
    const figures = stats.map(({ label, value }) => `${label}: ${value}`).join("\n");
    const blocks = tables.map((table) => {
        const columns = withCounts(table.columns);
        const total = table.rows.reduce((sum, row) => sum + row.count, 0);
        const lines = sortedRows(table).map((row) => columns.map((column) => column.text(row, total)).join("\t"));
        return [tables.length > 1 ? table.name : null, columns.map((column) => column.label).join("\t"), ...lines].filter((line) => line !== null).join("\n");
    });
    return [figures, ...blocks].join("\n\n");
}

/**
 * Shows a frequency tool's results in its frame's results area (the toolFrame "analysis" layout).
 *
 * @param {HTMLElement} output - The frame's results area (<id>Results).
 * @param {object} results
 * @param {{label: string, value: string}[]} results.stats - Figures to show first, such as "Bytes".
 * @param {string} [results.extra] - HTML to show between the figures and the tables.
 * @param {{id: string, name: string, columns: object[], rows: {count: number}[]}[]} results.tables - The tables of counts,
 *   empty ones left out. Each column has a key (the rows' property it sorts by), a label, a text(row) for copying and,
 *   optionally, html(row) to show, numeric or mono, and startDescending (default: numeric) for which way its first click
 *   sorts. Count and Share columns are added to each. With more than one
 *   table, each is in a fold, the first open to start with.
 */
export function renderFrequencies(output, { stats, extra = "", tables }) {
    const visible = tables.filter((table) => table.rows.length);
    const open = new Set([...output.querySelectorAll("details[open]")].map((fold) => fold.dataset.table));
    const firstRun = !output.querySelector("details");
    const tableBlock = (table) => `<div class="frequency-table" data-table="${table.id}" tabindex="0" role="region" aria-label="${escapeHtml(table.name)}">${tableHtml(table)}</div>`;

    output.innerHTML =
        `<dl class="tool-stats">${stats.map(({ label, value }) =>
            `<div class="tool-stats__item"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` +
        extra +
        (visible.length > 1
            ? visible.map((table, index) => {
                const values = `${table.rows.length.toLocaleString()} ${table.rows.length === 1 ? "value" : "values"}`;
                const isOpen = firstRun ? index === 0 : open.has(table.id);
                return `<details class="frequency-fold" data-table="${table.id}"${isOpen ? " open" : ""}>` +
                    `<summary><i class="bi bi-chevron-right" aria-hidden="true"></i>${escapeHtml(table.name)}<small>${values}</small></summary>` +
                    `${tableBlock(table)}</details>`;
            }).join("")
            : visible.map(tableBlock).join(""));

    const results = { stats, tables: visible };
    shown.set(output, results);
    output.dataset.copy = copyText(results);

    // Sorting: once per output, as the tables inside are redrawn on every run
    if (!output.dataset.sortable) {
        output.dataset.sortable = "true";
        output.addEventListener("click", (event) => {
            const button = event.target.closest("[data-sort]");
            if (!button) {
                return;
            }
            const results = shown.get(output);
            const wrap = button.closest(".frequency-table");
            const table = results.tables.find((t) => t.id === wrap.dataset.table);
            const key = button.dataset.sort;
            const current = sorts.get(table.id) ?? DEFAULT_SORT;
            const column = table.columns.find((c) => c.key === key);
            // A new column starts with the most useful end: the highest numbers, or A to Z, unless it says otherwise
            const startDescending = key === "count" || (column.startDescending ?? Boolean(column.numeric));
            sorts.set(table.id, { key, descending: current.key === key ? !current.descending : startDescending });
            wrap.innerHTML = tableHtml(table);
            output.dataset.copy = copyText(results);
            wrap.querySelector(`[data-sort="${key}"]`).focus();
        });
    }
}
