
import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';
import * as hash from './hash-fn.mjs';

Object.entries(hash).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const hashButton = document.getElementById("hashDecode");
hashButton && hashButton.addEventListener("click", function() {
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
        { label: "SHA-256", type: "SHA256" },
        { label: "SHA-512", type: "SHA512" },
        { label: "SHA-3 [224]", type: "SHA3224" },
        { label: "SHA-3 [256]", type: "SHA3256" },
        { label: "SHA-3 [384]", type: "SHA3384" },
        { label: "SHA-3 [512]", type: "SHA3512" }
    ];

    // Insert each hash result
    hashTypes.forEach(({ label, type }) => {
        hashResults.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <th scope="row"><span class="display-6 fs-6 fw-normal">${label}</span>&nbsp;</th>
                <td>${hash.generateHashes(hashString.value, type)}&nbsp;</td>
            </tr>`
        );
    });
});
