import rot from '../../lib/ciphers/rot.js';
import { bindToolFrame } from '../../ui/tool-frame.js';
import { getCustomAlphabet, upperAlphabet } from "../../lib/ciphers/common.js";

const key = document.getElementById("caesarKey");
const shift = document.getElementById("caesarShift");
const live = document.getElementById("caesarLive");
const map = document.getElementById("caesarMap");

const alphabet = () => (key.value ? getCustomAlphabet(key.value) : upperAlphabet);

bindToolFrame({
    id: "caesar",
    modes: [{ button: "caesarRun", run: (text, amount) => rot(text, parseInt(amount), alphabet()) }],
    key: [
        {
            id: "caesarShift",
            flow: "by",
            required: "A shift from 1 to 25 is required",
            pattern: /^(?:[1-9]|1[0-9]|2[0-5])$/,
            invalid: "The shift can only be a whole number from 1 to 25",
        },
        {
            id: "caesarKey",
            flow: "with key",
            pattern: /^[A-Za-z]+$/,
            invalid: "Caesar key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
        },
    ],
    errorPrefix: "Couldn't run the Caesar cipher",
});

// What the shift does to the first letter of the alphabet, e.g. "A → D", including any key's reordering
const showMap = () => {
    const letters = alphabet();
    const amount = parseInt(shift.value);
    map.textContent = amount >= 1 && amount <= 25 ? `${letters[0]} → ${letters[amount % letters.length]}` : "";
};
shift.addEventListener("input", showMap);
key.addEventListener("input", showMap);
showMap();

// Previous and next step through the shifts, wrapping between 1 and 25, and apply the new one straight away
const step = (direction) => {
    const current = parseInt(shift.value) || 1;
    shift.value = ((current - 1 + direction + 25) % 25) + 1;
    shift.dispatchEvent(new Event("input", { bubbles: true }));
    if (!live.checked && document.getElementById("caesarText").value.trim() !== "") {
        document.getElementById("caesarRun").click();
    }
};
document.getElementById("caesarPrev").addEventListener("click", () => step(-1));
document.getElementById("caesarNext").addEventListener("click", () => step(1));
