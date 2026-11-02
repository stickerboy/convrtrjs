import * as toolkit from '../../lib/toolkit.js';
import { readToolInput } from '../../ui/tool.js';
import { showToast } from '../../ui/toast.js';
import { getLocalStorageItem, saveLocalStorage } from '../../ui/storage.js';
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
const label = (id) => box(id).closest(".card").querySelector(".card-label").textContent.trim();

const live = document.getElementById("liveTyping");
const chain = document.getElementById("chainDecoders");
const announcer = document.getElementById("convrtrsAnnounce");

// Live typing stops here, where the large data warning starts; the buttons still work up to the 1 million cap
const LIVE_LIMIT = 200000;

// The line under each box: where its text came from, or what's wrong with it, and its length
function setStatus(id, message = "", { error = false } = {}) {
    const card = box(id).closest(".card");
    const status = document.getElementById(`convrtrs-${id}-status`);
    status.textContent = message;
    status.classList.toggle("text-danger", error);
    box(id).setAttribute("aria-invalid", String(error));
    box(id).classList.toggle("is-invalid", error);
    const length = box(id).value.length;
    card.querySelector("[data-count]").textContent = `${length.toLocaleString()} character${length === 1 ? "" : "s"}`;
}

let announceTimer;
const announce = (message) => {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => (announcer.textContent = message), 800);
};

// Decode one box to plain text, then fill every other box with that text in its format.
// With "Chain decoders" ticked, each decoder reads from the Text box instead of its own.
// Typing (live) reads the box being typed in, and reports problems under the box rather than in a toast.
function convertFrom(source, { typed = false } = {}) {
    const chained = !typed && source !== "text" && chain.checked;
    let input;

    if (typed) {
        input = box(source).value;
        if (input.trim() === "") {
            for (const id of Object.keys(formats)) {
                if (id !== source) {
                    box(id).value = "";
                }
                setStatus(id);
            }
            return;
        }
        if (input.length > LIVE_LIMIT) {
            setStatus(source, `Too long to convert as you type: use ${source === "text" ? "Encode" : "Decode"}`);
            return;
        }
    } else {
        const values = readToolInput({ input: chained ? "form-text" : `form-${source}` });
        if (!values) {
            return;
        }
        input = values.text;
    }

    let text;
    try {
        text = formats[source].decode(input);
    } catch (e) {
        if (!typed) {
            showToast("Error", `An error occurred trying to decode the data: ${e.message}`, "danger");
        }
        setStatus(chained ? "text" : source, `Couldn't decode: ${e.message}`, { error: true });
        return;
    }

    for (const [id, format] of Object.entries(formats)) {
        if (id !== source) {
            box(id).value = format.encode(text);
            setStatus(id, `From ${label(source)}`);
        }
    }
    setStatus(source, chained ? "Source, read from the Text box" : "Source");
    announce(`${Object.keys(formats).length - 1} formats updated from ${label(source)}`);
}

for (const [id, format] of Object.entries(formats)) {
    document.getElementById(format.button)?.addEventListener("click", () => convertFrom(id));

    // Live typing waits for a short pause, so long text isn't converted on every key
    let timer;
    box(id).addEventListener("input", () => {
        setStatus(id);
        if (live.checked) {
            clearTimeout(timer);
            timer = setTimeout(() => convertFrom(id, { typed: true }), 150);
        }
    });
}

// Live typing is remembered between visits
live.checked = getLocalStorageItem("convrtrsLive") === "on";
live.addEventListener("change", () => {
    saveLocalStorage("convrtrsLive", "Convrtrs live typing", live.checked ? "on" : "off", "Whether Convrtrs converts as you type");
});

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
