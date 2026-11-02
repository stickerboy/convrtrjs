import { bindToolFrame } from '../../ui/tool-frame.js';
import { showToast } from '../../ui/toast.js';
import * as hash from '../../lib/ciphers/hash.js';

// Hash groups, their types and labels, in list order
const hashGroups = [
    { name: "Legacy", note: "not for security", hashes: [
        { label: "MD5", type: "MD5" },
        { label: "SHA-1", type: "SHA1" },
        { label: "RIPEMD-160", type: "RIPEMD160" },
    ] },
    { name: "SHA-2", hashes: [
        { label: "SHA-224", type: "SHA224" },
        { label: "SHA-256", type: "SHA256" },
        { label: "SHA-384", type: "SHA384" },
        { label: "SHA-512", type: "SHA512" },
    ] },
    { name: "SHA-3", hashes: [
        { label: "SHA-3 [224]", type: "SHA3224" },
        { label: "SHA-3 [256]", type: "SHA3256" },
        { label: "SHA-3 [384]", type: "SHA3384" },
        { label: "SHA-3 [512]", type: "SHA3512" },
    ] },
    { name: "Keccak", note: "pre-standard SHA-3, used by Ethereum", hashes: [
        { label: "Keccak [224]", type: "KECCAK224" },
        { label: "Keccak [256]", type: "KECCAK256" },
        { label: "Keccak [384]", type: "KECCAK384" },
        { label: "Keccak [512]", type: "KECCAK512" },
    ] },
    { name: "Checksum", hashes: [
        { label: "CRC32", type: "CRC32" },
    ] },
];
const total = hashGroups.reduce((sum, group) => sum + group.hashes.length, 0);

const list = document.getElementById("hashResults");
const check = document.getElementById("hashCheck");
const checkResult = document.getElementById("hashCheckResult");
const status = document.getElementById("hashStatus");

// "Check a hash": highlights the row whose hash matches what's pasted, ignoring case, spaces, colons and a 0x prefix
const applyCheck = () => {
    const wanted = check.value.toLowerCase().replace(/^0x|[\s:-]/g, "");
    let match = null;
    for (const row of list.querySelectorAll(".hash-row")) {
        const isMatch = wanted !== "" && row.dataset.hash === wanted;
        row.classList.toggle("is-match", isMatch);
        match ??= isMatch ? row : null;
    }
    if (wanted === "") {
        checkResult.textContent = "";
    } else if (!list.children.length) {
        checkResult.textContent = "Generate the hashes to check against them";
    } else if (match) {
        checkResult.textContent = `Matches ${match.dataset.label}`;
        match.scrollIntoView({ block: "nearest" });
    } else {
        checkResult.textContent = "No algorithm matches this hash for this input";
    }
};
check.addEventListener("input", applyCheck);

// Each row's hash can be copied on its own; the buttons above the list copy or download all of them
list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy-hash]");
    if (!button) {
        return;
    }
    const row = button.closest(".hash-row");
    navigator.clipboard.writeText(row.dataset.hash).then(() => {
        const icon = button.querySelector(".bi");
        icon.classList.replace("bi-clipboard", "bi-clipboard-check-fill");
        status.textContent = `Copied the ${row.dataset.label} hash`;
        setTimeout(() => icon.classList.replace("bi-clipboard-check-fill", "bi-clipboard"), 2000);
    }, () => showToast("Error", "Couldn't copy to the clipboard", "danger"));
});

const escapeHtml = (string) => string.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

bindToolFrame({
    id: "hash",
    modes: [{
        button: "hashRun",
        run: (text) => Promise.all(hashGroups.map(async (group) => ({
            ...group,
            rows: await Promise.all(group.hashes.map(async ({ label, type }) => ({ label, value: await hash.generateHashes(text, type) }))),
        }))),
    }],
    // The rows' text reads "MD5: …" one per line, so select, copy and download give a tidy list
    render: (groups, output) => {
        output.innerHTML = groups.map(({ name, note, rows }) =>
            `<div class="hash-group"><h3 class="hash-group__title">${name}${note ? ` <small>(${note})</small>` : ""}</h3>\n` +
            rows.map(({ label, value }) =>
                `<div class="hash-row" data-hash="${escapeHtml(value)}" data-label="${escapeHtml(label)}">` +
                `<span class="hash-row__name">${label}<span class="visually-hidden">: </span></span>` +
                `<code class="hash-row__value">${escapeHtml(value)}</code>` +
                `<button type="button" class="btn btn-md btn-light" aria-label="Copy the ${label} hash" title="Copy" data-copy-hash>` +
                `<i class="bi bi-clipboard" aria-hidden="true"></i></button></div>\n`
            ).join("") + "</div>\n"
        ).join("");
        output.closest("[data-tool-frame]").querySelector("[data-count-output]").textContent = `${total} hashes`;
        applyCheck();
    },
    errorPrefix: "Couldn't generate the hashes",
});
