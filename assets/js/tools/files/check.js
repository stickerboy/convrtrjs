import { getFileHeader, extensionOf, nameMismatch, looksLikeText } from '../../lib/files/check.js';
import { bindFileDrop, readProblem } from '../../ui/file-drop.js';
import { escapeHtml } from '../../ui/tool-frame.js';

const MAX_FILES = 5;

const fileSize = (bytes) => bytes < 1024 ? `${bytes.toLocaleString()} byte${bytes === 1 ? "" : "s"}`
    : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
/**
 * Starts a message with a capital, for one shown on its own rather than after "Couldn't read the file: ".
 *
 * @param {string} text - The message.
 * @returns {string} The message, with its first letter a capital.
 */
const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const hexByte =(byte) => byte.toString(16).toUpperCase().padStart(2, "0");
const printable = (byte) => (byte >= 32 && byte < 127 ? String.fromCharCode(byte) : ".");

/**
 * What the header says, and whether the file's name disagrees: a renamed file is a common way to hide one. With no
 * header, whether the file is empty, or starts like plain text.
 *
 * @param {File} file - The file.
 * @param {Uint8Array} bytes - Its first bytes.
 * @param {object|null} match - What its header matched (see matchFileHeader).
 * @returns {{match: object|null, extension: string, mismatch: boolean, empty: boolean, text: boolean}} The verdict.
 */
function verdictOf(file, bytes, match) {
    return {
        match,
        extension: extensionOf(file.name),
        mismatch: nameMismatch(file.name, match),
        empty: bytes.length === 0,
        text: !match && looksLikeText(bytes),
    };
}

/**
 * Says what the file is, as verdictOf found.
 *
 * @param {ReturnType<typeof verdictOf>} verdict - The verdict.
 * @returns {string} The verdict's HTML.
 */
function verdictHtml({ match, extension, mismatch, empty, text }) {
    if (empty) {
        return `<div class="file-verdict file-verdict--unknown">` +
            `<i class="bi bi-question-circle file-verdict__icon" aria-hidden="true"></i>` +
            `<div><p class="file-verdict__title">The file is empty</p><p>It has no bytes, so there's no header to check.</p></div></div>`;
    }
    if (text) {
        return `<div class="file-verdict file-verdict--match">` +
            `<i class="bi bi-file-earmark-text file-verdict__icon" aria-hidden="true"></i>` +
            `<div><p class="file-verdict__title">No header: it looks like plain text</p>` +
            `<p>The start of the file reads as text. Text files, such as .txt, .csv, .json and .html, usually have no header, so the name can't be checked.</p></div></div>`;
    }
    if (!match) {
        return `<div class="file-verdict file-verdict--unknown">` +
            `<i class="bi bi-question-circle file-verdict__icon" aria-hidden="true"></i>` +
            `<div><p class="file-verdict__title">Not a header we know</p>` +
            `<p>None of the file headers match the start of this file. It may be a type that's missing from the list, or data with no header, such as raw or encrypted bytes.</p></div></div>`;
    }
    const extensions = match.extensions.map((ext) => `<span class="file-badge">.${escapeHtml(ext)}</span>`).join("");
    return `<div class="file-verdict file-verdict--${mismatch ? "mismatch" : "match"}">` +
        `<i class="bi ${mismatch ? "bi-exclamation-triangle" : "bi-check-circle"} file-verdict__icon" aria-hidden="true"></i>` +
        `<div><p class="file-verdict__title">${escapeHtml(match.name)}</p>` +
        (mismatch
            ? `<p><strong>The name ends in .${escapeHtml(extension)}, but the header says ${escapeHtml(match.name)}</strong>, usually .${escapeHtml(match.extensions[0])}. ` +
              `${escapeHtml(match.description)}.</p>`
            : `<p>${escapeHtml(match.description)}.${match.anyName ? " Many kinds of file start this way, so the name can't be checked." : ""}</p>`) +
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
    const { match, extension, mismatch, empty, text } = verdict;
    return [
        file.name,
        match ? `Type: ${match.name} (header ${match.header})`
            : empty ? "Type: empty file" : text ? "Type: no header, looks like plain text" : "Type: not a header we know",
        mismatch ? `Warning: the name ends in .${extension}, but the header says ${match.name}` : null,
        `Hex: ${[...bytes].map(hexByte).join(" ")}`,
        `Text: ${[...bytes].map(printable).join("")}`,
    ].filter(Boolean).join("\n");
}

bindFileDrop({
    id: "check",
    max: MAX_FILES,
    run: async (files, output) => {
        // Each file is read on its own, so one the browser can't open (such as a dropped folder) doesn't lose the others'
        // results. With one file, the problem is said in the status line, as for any tool.
        const checked = await Promise.all(files.map(async (file) => {
            try {
                const { bytes, match } = await getFileHeader(file);
                return { file, bytes, verdict: verdictOf(file, bytes, match) };
            } catch (error) {
                if (files.length === 1) {
                    throw error;
                }
                return { file, problem: readProblem(error) };
            }
        }));
        const details = (item) => verdictHtml(item.verdict) + (item.verdict.empty ? "" : dumpHtml(item.bytes, item.verdict.match));
        if (checked.length === 1) {
            output.innerHTML = summaryHtml(checked[0].file) + details(checked[0]);
        } else {
            // A fold per file, its type on the right, so the list is the overview; a file that couldn't be read says why
            output.innerHTML = checked.map((item) => {
                if (item.problem) {
                    return `<details class="tool-fold file-fold file-fold--mismatch">` +
                        `<summary><i class="bi bi-chevron-right tool-fold__chevron" aria-hidden="true"></i>` +
                        `<span class="file-fold__name">${escapeHtml(item.file.name)}</span><small>Couldn't read</small></summary>` +
                        `<div class="file-fold__body"><div class="file-verdict file-verdict--unknown">` +
                        `<i class="bi bi-question-circle file-verdict__icon" aria-hidden="true"></i>` +
                        `<div><p class="file-verdict__title">Couldn't read this file</p><p>${escapeHtml(capitalise(item.problem))}.</p></div></div></div></details>`;
                }
                const { match, mismatch, empty, text } = item.verdict;
                const type = mismatch ? `<i class="bi bi-exclamation-triangle" aria-hidden="true"></i> ${escapeHtml(match.name)}, not .${escapeHtml(item.verdict.extension)}`
                    : match ? escapeHtml(match.name) : empty ? "Empty" : text ? "Plain text" : "Not known";
                return `<details class="tool-fold file-fold${mismatch ? " file-fold--mismatch" : ""}">` +
                    `<summary><i class="bi bi-chevron-right tool-fold__chevron" aria-hidden="true"></i>` +
                    `<span class="file-fold__name">${escapeHtml(item.file.name)}</span><small>${type}</small></summary>` +
                    `<div class="file-fold__body">${summaryHtml(item.file)}${details(item)}</div></details>`;
            }).join("");
        }
        output.dataset.copy = checked.map((item) => (item.problem ? `${item.file.name}\nCouldn't read: ${item.problem}` : copyText(item))).join("\n\n");
        const mismatches = checked.filter((item) => item.verdict?.mismatch).length;
        const unread = checked.filter((item) => item.problem).length;
        const notes = [
            mismatches ? `${mismatches} ${mismatches === 1 ? "has a name that doesn't match its header" : "have names that don't match their headers"}` : "",
            unread ? `${unread} couldn't be read` : "",
        ].filter(Boolean);
        return checked.length === 1 ? "" : `Checked ${checked.length} files${notes.length ? `: ${notes.join(", and ")}` : ""}`;
    },
});
