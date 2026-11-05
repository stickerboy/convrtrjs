import * as toolkit from '../../lib/toolkit.js';
import { bindToolFrame } from '../../ui/tool-frame.js';
import * as shift from '../../lib/hex/shift.js';

const delimiter = document.getElementById("shiftDelimiter");
const amount = document.getElementById("shiftValue");

// The shifted bytes in each format, one per output tab, all from the bytes themselves: bytes that aren't valid UTF-8
// show as one character per byte in Text, which mustn't then be encoded again for the other tabs. Move to input always
// moves the hex, as the input is hex.
bindToolFrame({
    id: "shift",
    modes: [{
        button: "shiftRun",
        run: (text, by) => {
            const bytes = shift.shiftHexBytes(text, by);
            return {
                Text: toolkit.bytesToString(bytes),
                Hex: toolkit.bytesToHex(bytes, delimiter.value),
                Binary: toolkit.bytesToBinary(bytes),
                Base64: toolkit.bytesToBase64(bytes),
                Decimal: toolkit.bytesToDecimal(bytes),
            };
        },
    }],
    key: {
        id: "shiftValue",
        required: "Please enter a number to shift the hex string by",
        pattern: /^-?\d+$/,
        invalid: "The shift can only be a whole number, such as 1 or -3",
    },
    watch: ["shiftDelimiter"],
    flow: () => ["Shift each byte by ", { value: amount.value }],
    moveTab: "Hex",
    errorPrefix: "Couldn't shift the hex",
});
