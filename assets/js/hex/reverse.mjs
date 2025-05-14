import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as reverse from './reverse-fn.mjs';


const reverseHexButton = document.getElementById("reverseDecode");
reverseHexButton && reverseHexButton.addEventListener("click", function() {
    const chainReverse = document.getElementById("reverseChain");

    const reverseHexString = document.getElementById("reverseText");
    let reverseHexDelimiter = document.getElementById("reverseDelimiter").value;
    let reverseType = document.getElementById("reverseType");
    let reverseResults = document.getElementById("reverseResults");

    if(!emptyContainerCheck(reverseHexString.value, reverseHexString)) {
        return false;
    }
    if (!largeDataWarning(reverseHexString.value, reverseHexString)) {
        return false;
    }

    let revHexContent;
    
    try {
        switch (reverseType.value) { 
            case "bytes":
                if (chainReverse.checked && reverseResults.textContent.length > 0) {
                    revHexContent = reverse.reverseHexBytes(reverseResults.textContent.trim(), reverseHexDelimiter);
                } else {
                    revHexContent = reverse.reverseHexBytes(reverseHexString.value.trim(), reverseHexDelimiter);
                }
            break;
            case "byte-order": 
                if (chainReverse.checked && reverseResults.textContent.length > 0) {
                    revHexContent = reverse.reverseHexByteOrder(reverseResults.textContent.trim(), reverseHexDelimiter);
                } else {
                    revHexContent = reverse.reverseHexByteOrder(reverseHexString.value.trim(), reverseHexDelimiter);
                }
            break;
            case "nibbles":
                if (chainReverse.checked && reverseResults.textContent.length > 0) {
                    revHexContent = reverse.reverseHexNibbles(reverseResults.textContent.trim(), reverseHexDelimiter);
                } else {
                    revHexContent = reverse.reverseHexNibbles(reverseHexString.value.trim(), reverseHexDelimiter);
                }
            break;
            default:
                throw new Error("Invalid selection, only 'bytes', 'byte-order', or 'nibbles' are valid options");
        }
    } catch (e) {
        showToast("Error", `An error occurred trying to reverse the hex string: ${e.message}`, "danger");
        return;
    }

    document.getElementById("reverseResults").textContent = revHexContent;
});