import * as toolkit from '../../lib/toolkit.js';
import { bindToolFrame } from '../../ui/tool-frame.js';
import * as shift from '../../lib/hex/shift.js';

const delimiter = document.getElementById("shiftDelimiter");
const amount = document.getElementById("shiftValue");

// The shifted hex, and the text it spells in other formats, one per output tab. Move to input always moves the hex,
// as the input is hex.
bindToolFrame({
    id: "shift",
    modes: [{
        button: "shiftRun",
        run: (text, by) => {
            const hex = shift.shiftHexString(text, by, delimiter.value);
            const string = toolkit.hexToString(hex);
            return {
                Text: string,
                Hex: hex,
                Binary: toolkit.stringToBinary(string),
                Base64: toolkit.stringToBase64(string),
                Decimal: toolkit.stringToDecimal(string),
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
