import * as toolkit from '../../lib/toolkit.js';
import { readToolInput } from '../../ui/tool.js';
import { showToast } from '../../ui/toast.js';
import * as home from '../../lib/text/convrtrs.js';

const hexDelimiter = () => document.getElementById("convrtrsDelimiter").value;

// Morsenary conversions use the ". = 0" / "- = 0" setting chosen on the page
const morsenarySetting = document.getElementById("morsenarySetting");

// Every format on the page: its box (form-<id>), button, and how to convert it to and from plain text
const formats = {
    text:      { button: "encode",       decode: (data) => data,                                   encode: (text) => text },
    binary:    { button: "binaryDecode", decode: (data) => home.binaryToString(data),              encode: (text) => toolkit.stringToBinary(text) },
    hex:       { button: "hexDecode",    decode: (data) => toolkit.hexToString(data, hexDelimiter()), encode: (text) => toolkit.stringToHex(text, hexDelimiter()) },
    base64:    { button: "b64Decode",    decode: (data) => home.base64ToString(data),              encode: (text) => toolkit.stringToBase64(text) },
    decimal:   { button: "decDecode",    decode: (data) => toolkit.decimalToString(data),          encode: (text) => toolkit.stringToDecimal(text) },
    reverse:   { button: "revDecode",    decode: (data) => toolkit.reverseString(data),            encode: (text) => toolkit.reverseString(text) },
    rot13:     { button: "rot13Decode",  decode: (data) => toolkit.rot13(data),                    encode: (text) => toolkit.rot13(text) },
    morse:     { button: "morseDecode",  decode: (data) => home.morseToString(data),               encode: (text) => home.stringToMorse(text) },
    morsenary: { button: "mrsnryDecode", decode: (data) => home.morsenaryToString(data, morsenarySetting.value), encode: (text) => home.stringToMorsenary(text, morsenarySetting.value) },
};
const box = (id) => document.getElementById(`form-${id}`);

// Decode one box to plain text, then fill every other box with that text in its format.
// With "Chain decoders" ticked, each decoder reads from the Text box instead of its own.
function convertFrom(source) {
    const chained = source !== "text" && document.getElementById("chainDecoders").checked;
    const values = readToolInput({ input: chained ? "form-text" : `form-${source}` });
    if (!values) {
        return;
    }

    let text;
    try {
        text = formats[source].decode(values.text);
    } catch (e) {
        showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        return;
    }

    for (const [id, format] of Object.entries(formats)) {
        if (id !== source) {
            box(id).value = format.encode(text);
        }
    }
}

for (const [id, format] of Object.entries(formats)) {
    document.getElementById(format.button)?.addEventListener("click", () => convertFrom(id));
}

// Re-code Hex on delimiter change
document.getElementById("convrtrsDelimiter").addEventListener("change", function () {
    if (box("hex").value === "") {
        return;
    }
    document.getElementById("encode").click();
});

// Re-code Morsenary on delimiter change
morsenarySetting.addEventListener("change", function () {
    if (box("morsenary").value === "") {
        return;
    }
    document.getElementById("mrsnryDecode").click();
});
