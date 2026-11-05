import { bindToolFrame } from '../../ui/tool-frame.js';
import * as reverse from '../../lib/hex/reverse.js';

const reversals = {
    "digits": reverse.reverseHexDigits,
    "bits": reverse.reverseHexBits,
    "nibbles": reverse.reverseHexNibbles,
    "byte-order": reverse.reverseHexByteOrder,
};
const type = document.getElementById("reverseType");
const delimiter = document.getElementById("reverseDelimiter");

bindToolFrame({
    id: "reverse",
    modes: [{
        button: "reverseRun",
        run: (text) => {
            const reversal = reversals[type.value];
            if (!reversal) {
                throw new Error("Choose what to reverse from the list");
            }
            return reversal(text.trim(), delimiter.value);
        },
    }],
    watch: ["reverseType", "reverseDelimiter"],
    flow: () => ["Reverse ", { value: type.selectedOptions[0].textContent.toLowerCase() }],
    errorPrefix: "Couldn't reverse the hex",
});
