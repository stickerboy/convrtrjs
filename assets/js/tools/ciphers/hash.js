
import { emptyContainerCheck, largeDataWarning } from '../../ui/input.js';
import * as hash from '../../lib/ciphers/hash.js';

const hashButton = document.getElementById("hashDecode");
hashButton && hashButton.addEventListener("click", async function() {
    const hashString = document.getElementById("hashText");
    const hashResults = document.getElementById("hashResults");
    hashResults.innerHTML = "";

    if (!emptyContainerCheck(hashString.value, hashString)) {
        return false;
    }
    if (!largeDataWarning(hashString.value, hashString)) {
        return false;
    }

    // Mapping object for hash types and their labels
    const hashTypes = [
        { label: "MD5", type: "MD5" },
        { label: "SHA-1", type: "SHA1" },
        { label: "RIPEMD-160", type: "RIPEMD160" },
        { label: "SHA-224", type: "SHA224" },
        { label: "SHA-256", type: "SHA256" },
        { label: "SHA-384", type: "SHA384" },
        { label: "SHA-512", type: "SHA512" },
        { label: "SHA-3 [224]", type: "SHA3224" },
        { label: "SHA-3 [256]", type: "SHA3256" },
        { label: "SHA-3 [384]", type: "SHA3384" },
        { label: "SHA-3 [512]", type: "SHA3512" },
        { label: "Keccak [224]", type: "KECCAK224" },
        { label: "Keccak [256]", type: "KECCAK256" },
        { label: "Keccak [384]", type: "KECCAK384" },
        { label: "Keccak [512]", type: "KECCAK512" },
        { label: "CRC32", type: "CRC32" }
    ];

    // Insert each hash result
    for (const { label, type } of hashTypes) {
        const value = await hash.generateHashes(hashString.value, type);
        hashResults.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <th scope="row"><span class="display-6 fs-6 fw-normal">${label}</span>&nbsp;</th>
                <td>${value}&nbsp;</td>
            </tr>`
        );
    }
});
