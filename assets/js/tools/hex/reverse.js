import { bindTool } from '../../ui/tool.js';
import * as reverse from '../../lib/hex/reverse.js';

const reversals = {
    "bytes": reverse.reverseHexBytes,
    "byte-order": reverse.reverseHexByteOrder,
    "nibbles": reverse.reverseHexNibbles,
};

bindTool({
    button: "reverseDecode",
    input: "reverseText",
    output: "reverseResults",
    chain: "reverseChain",
    errorPrefix: "An error occurred trying to reverse the hex string",
    run: (text) => {
        const reversal = reversals[document.getElementById("reverseType").value];
        if (!reversal) {
            throw new Error("Invalid selection, only 'bytes', 'byte-order', or 'nibbles' are valid options");
        }
        return reversal(text.trim(), document.getElementById("reverseDelimiter").value);
    },
});
