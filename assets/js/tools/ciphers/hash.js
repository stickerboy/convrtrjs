import { bindTool } from '../../ui/tool.js';
import * as hash from '../../lib/ciphers/hash.js';

// Hash groups, their types and labels, in table order
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

bindTool({
    button: "hashDecode",
    input: "hashText",
    output: "hashResults",
    clear: true,
    run: (text) => Promise.all(hashGroups.map(async (group) => ({
        ...group,
        rows: await Promise.all(group.hashes.map(async ({ label, type }) => ({ label, value: await hash.generateHashes(text, type) }))),
    }))),
    render: (groups, output) => {
        output.innerHTML = groups.map(({ name, note, rows }) =>
            `<tr class="table-active hash-group">
                <th scope="colgroup" colspan="2">${name}${note ? ` <span class="fw-normal small text-body-secondary">(${note})</span>` : ""}</th>
            </tr>` +
            rows.map(({ label, value }) =>
                `<tr>
                <th scope="row"><span class="display-6 fs-6 fw-normal">${label}</span>&nbsp;</th>
                <td>${value}&nbsp;</td>
            </tr>`
            ).join("")
        ).join("");
    },
});
