import { getFileHeader } from '../../lib/files/check.js';
import { bindFileDrop } from '../../ui/file-drop.js';
import { escapeHtml } from '../../ui/tool-frame.js';

const MAX_FILES = 5;

const fileSize = (bytes) => bytes < 1024 ? `${bytes.toLocaleString()} byte${bytes === 1 ? "" : "s"}`
    : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
const extensionOf = (name) => (name.includes(".") ? name.split(".").pop().toLowerCase() : "");
const hexByte = (byte) => byte.toString(16).toUpperCase().padStart(2, "0");
const printable = (byte) => (byte >= 32 && byte < 127 ? String.fromCharCode(byte) : ".");

// What the header says, and whether the file's name disagrees: a renamed file is a common way to hide one
function verdictOf(file, match) {
    const extension = extensionOf(file.name);
    const mismatch = Boolean(match && extension && match.extensions.length && !match.extensions.includes(extension));
    return { match, extension, mismatch };
}

function verdictHtml({ match, extension, mismatch }) {
    if (!match) {
        return `<div class="file-verdict file-verdict--unknown">` +
            `<i class="bi bi-question-circle file-verdict__icon" aria-hidden="true"></i>` +
            `<div><p class="file-verdict__title">Not a header we know</p>` +
            `<p>None of the file headers match the start of this file. It may be plain text, or a type that's missing from the list.</p></div></div>`;
    }
    const extensions = match.extensions.map((ext) => `<span class="file-badge">.${escapeHtml(ext)}</span>`).join("");
    return `<div class="file-verdict file-verdict--${mismatch ? "mismatch" : "match"}">` +
        `<i class="bi ${mismatch ? "bi-exclamation-triangle" : "bi-check-circle"} file-verdict__icon" aria-hidden="true"></i>` +
        `<div><p class="file-verdict__title">${escapeHtml(match.name)}</p>` +
        (mismatch
            ? `<p><strong>The name ends in .${escapeHtml(extension)}, but the header says ${escapeHtml(match.name)}</strong>, usually .${escapeHtml(match.extensions[0])}. ` +
              `${escapeHtml(match.description)}.</p>`
            : `<p>${escapeHtml(match.description)}.</p>`) +
        `<p class="file-verdict__badges">${extensions}<span class="file-badge">Header <code>${escapeHtml(match.header)}</code></span></p></div></div>`;
}

// The bytes read, 16 to a row, as hex and as text, with the header's bytes marked
function dumpHtml(bytes, match) {
    const rows = [];
    for (let offset = 0; offset < bytes.length; offset += 16) {
        const row = [...bytes.slice(offset, offset + 16)];
        const mark = (i, html) => (match?.mask[offset + i] ? `<mark>${html}</mark>` : html);
        rows.push(`<tr><th scope="row">${hexByte(offset >> 8)}${hexByte(offset & 255)}</th>` +
            `<td>${row.map((byte, i) => mark(i, hexByte(byte))).join(" ")}</td>` +
            `<td class="file-dump__text">${row.map((byte, i) => mark(i, escapeHtml(printable(byte)))).join("")}</td></tr>`);
    }
    return `<div class="file-dump" tabindex="0" role="region" aria-label="The file's first ${bytes.length} bytes">` +
        `<table><thead><tr><th scope="col">Offset</th><th scope="col">Hex</th><th scope="col">Text</th></tr></thead>` +
        `<tbody>${rows.join("")}</tbody></table></div>`;
}

function summaryHtml(file) {
    return `<p class="file-summary"><span class="file-summary__name">${escapeHtml(file.name)}</span>` +
        `<span class="file-summary__meta">${fileSize(file.size)}${file.type ? ` · your browser calls it ${escapeHtml(file.type)}` : ""}</span></p>`;
}

function copyText({ file, bytes, verdict }) {
    const { match, extension, mismatch } = verdict;
    return [
        file.name,
        match ? `Type: ${match.name} (header ${match.header})` : "Type: not a header we know",
        mismatch ? `Warning: the name ends in .${extension}, but the header says ${match.name}` : null,
        `Hex: ${[...bytes].map(hexByte).join(" ")}`,
        `Text: ${[...bytes].map(printable).join("")}`,
    ].filter(Boolean).join("\n");
}

bindFileDrop({
    id: "check",
    max: MAX_FILES,
    run: async (files, output) => {
        const checked = await Promise.all(files.map(async (file) => {
            const { bytes, match } = await getFileHeader(file);
            return { file, bytes, verdict: verdictOf(file, match) };
        }));
        const details = (item) => verdictHtml(item.verdict) + dumpHtml(item.bytes, item.verdict.match);
        if (checked.length === 1) {
            output.innerHTML = summaryHtml(checked[0].file) + details(checked[0]);
        } else {
            // A fold per file, its type on the right, so the list is the overview
            output.innerHTML = checked.map((item) => {
                const { match, mismatch } = item.verdict;
                const type = mismatch ? `<i class="bi bi-exclamation-triangle" aria-hidden="true"></i> ${escapeHtml(match.name)}, not .${escapeHtml(item.verdict.extension)}`
                    : match ? escapeHtml(match.name) : "Not known";
                return `<details class="tool-fold file-fold${mismatch ? " file-fold--mismatch" : ""}">` +
                    `<summary><i class="bi bi-chevron-right tool-fold__chevron" aria-hidden="true"></i>` +
                    `<span class="file-fold__name">${escapeHtml(item.file.name)}</span><small>${type}</small></summary>` +
                    `<div class="file-fold__body">${summaryHtml(item.file)}${details(item)}</div></details>`;
            }).join("");
        }
        output.dataset.copy = checked.map(copyText).join("\n\n");
        const mismatches = checked.filter((item) => item.verdict.mismatch).length;
        return checked.length === 1 ? "" : `Checked ${checked.length} files` +
            (mismatches ? `: ${mismatches} ${mismatches === 1 ? "has a name that doesn't match its header" : "have names that don't match their headers"}` : "");
    },
});
