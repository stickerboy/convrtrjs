import rot from '../../lib/ciphers/rot.js';
import { readToolInput } from '../../ui/tool.js';
import { getCustomAlphabet } from "../../lib/ciphers/common.js";

const caesarText = document.getElementById("caesarText");
const caesarButtons = document.getElementsByClassName("caesar-link");

const tool = {
    input: "caesarText",
    output: "caesarResults",
    chain: "chainRots",
    key: {
        id: "caesarKey",
        pattern: /^[A-Za-z]+$/,
        invalid: "Caesar key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
    },
};

// Caesar (ROT) text - one button per shift (1-26), with an optional key for a custom alphabet
Array.from(caesarButtons, (button) => button.addEventListener("click", () => {
    const values = readToolInput(tool);
    if (!values) {
        return;
    }
    // The input is trimmed; a chained (previous) result is used as-is
    const text = values.text === caesarText.value ? values.text.trim() : values.text;

    Array.from(caesarButtons, (b) => b.classList.remove("active"));
    button.classList.add("active");

    const shift = parseInt(button.getAttribute("data-caesar-number"));
    document.getElementById("caesarResults").textContent = values.key.length > 0
        ? rot(text, shift, getCustomAlphabet(values.key))
        : rot(text, shift);
}));

// Previous / next shift, wrapping around between 1 and 26
function step(direction) {
    if (!readToolInput({ input: "caesarText" })) {
        return;
    }
    const active = document.querySelector(".caesar-link.active") ?? document.querySelector(".caesar-link:first-child");
    const current = parseInt(active.getAttribute("data-caesar-number"));
    const next = ((current - 1 + direction + 26) % 26) + 1;
    document.getElementById(`caesar${next}`).click();
}

document.getElementById("caesarPrev")?.addEventListener("click", () => step(-1));
document.getElementById("caesarNext")?.addEventListener("click", () => step(1));
