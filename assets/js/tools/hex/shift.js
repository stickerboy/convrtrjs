import * as toolkit from '../../lib/toolkit.js';
import { readToolInput } from '../../ui/tool.js';
import { showToast } from '../../ui/toast.js';
import * as shift from '../../lib/hex/shift.js';

// The shifted hex is shown in several formats, one per tab
const panes = {
    text: (string) => string,
    binary: (string) => toolkit.stringToBinary(string),
    base64: (string) => toolkit.stringToBase64(string),
    decimal: (string) => toolkit.stringToDecimal(string),
};
const pane = (name) => document.getElementById(`${name}-tab-pane`);

document.getElementById("shiftDecode")?.addEventListener("click", () => {
    const shiftText = document.getElementById("shiftText");
    if (!shiftText.value.trim()) {
        ["text", "binary", "hex", "base64", "decimal"].forEach((name) => (pane(name).textContent = ""));
    }

    const values = readToolInput({
        input: "shiftText",
        key: { id: "shiftValue", required: "Please enter a number to shift the hex string by" },
    });
    if (!values) {
        return;
    }

    const delimiter = document.getElementById("shiftDelimiter").value;
    let shiftedHexString;
    try {
        shiftedHexString = shift.shiftHexString(values.text, values.key, delimiter);
    } catch (e) {
        showToast("Error", `An error occurred trying to shift the hex string: ${e.message}`, "danger");
        return;
    }

    const string = toolkit.hexToString(shiftedHexString, delimiter);
    for (const [name, format] of Object.entries(panes)) {
        pane(name).textContent = format(string);
    }
    pane("hex").textContent = shiftedHexString;
});
