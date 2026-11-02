import * as toolkit from '../../lib/toolkit.js';
import { bindToolFrame, renderResults } from '../../ui/tool-frame.js';
import * as shift from '../../lib/hex/shift.js';

const delimiter = document.getElementById("shiftDelimiter");

// The shifted hex, then the text it spells and that text in other formats, as rows with their own copy buttons
bindToolFrame({
    id: "shift",
    modes: [{
        button: "shiftRun",
        run: (text, amount) => {
            const hex = shift.shiftHexString(text, amount, delimiter.value);
            const string = toolkit.hexToString(hex);
            return [
                { label: "Hex", value: hex },
                { label: "Text", value: string },
                { label: "Binary", value: toolkit.stringToBinary(string) },
                { label: "Base64", value: toolkit.stringToBase64(string) },
                { label: "Decimal", value: toolkit.stringToDecimal(string) },
            ];
        },
    }],
    key: {
        id: "shiftValue",
        required: "Please enter a number to shift the hex string by",
        pattern: /^-?\d+$/,
        invalid: "The shift can only be a whole number, such as 1 or -3",
    },
    watch: ["shiftDelimiter"],
    render: (rows, output) => renderResults(output, rows, "5 formats"),
    errorPrefix: "Couldn't shift the hex",
});
