import { bindToolFrame, renderResults } from '../../ui/tool-frame.js';
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

// "Check a hash": highlights the row whose hash matches what's pasted, ignoring case, spaces, colons and a 0x prefix
const applyCheck = () => {
    const wanted = check.value.toLowerCase().replace(/^0x|[\s:-]/g, "");
    let match = null;
    for (const row of list.querySelectorAll(".tool-result")) {
        const isMatch = wanted !== "" && row.dataset.value === wanted;
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

bindToolFrame({
    id: "hash",
    modes: [{
        button: "hashRun",
        run: (text) => Promise.all(hashGroups.map(async (group) => ({
            ...group,
            rows: await Promise.all(group.hashes.map(async ({ label, type }) => ({ label, value: await hash.generateHashes(text, type) }))),
        }))),
    }],
    render: (groups, output) => {
        renderResults(output, groups, `${total} hashes`);
        applyCheck();
    },
    errorPrefix: "Couldn't generate the hashes",
});
