import rot from '../rot.mjs';
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import { getCustomAlphabet } from "./ciphers-fn.mjs";
// import * as caesar from './caesar-fn.mjs';

Object.entries(rot).forEach(([functionName, functionRef]) => {
    console.log(`Function name: ${functionName}`);
    console.log(`Function ref: ${functionRef}`);
    window[functionName] = functionRef;
});

// Caesar (ROT) Text
const caesarButtons    = document.getElementsByClassName("caesar-link");
const caesarPrevious   = document.getElementById("caesarPrev");
const caesarNext       = document.getElementById("caesarNext");
const caesarKey        = document.getElementById("caesarKey");

if(caesarButtons.length > 0) {
    Array.from(caesarButtons, c => c.addEventListener("click", function() {
        const caesarText = document.getElementById("caesarText");
        const caesarNumber = c.getAttribute("data-caesar-number");
        let chainRots = document.getElementById("chainRots");
        let rR = document.getElementById("caesarResults").textContent;
        let caesarResults = chainRots.checked && rR.length > 0 ? rR : caesarText.value.trim();

        if(!emptyContainerCheck(caesarText.value, caesarText)) {
            caesarResults = "";
            return false;
        }
        if (!largeDataWarning(caesarText.value, caesarText)) {
            return false;
        }
        if (caesarKey.value.length > 0 && /[^A-Za-z]/.test(caesarKey.value)) {
            showToast("Error", "Caesar key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here", "danger");
            return;
        }

        Array.from(caesarButtons, button => {
            button.classList.remove("active");
        });
        c.classList.add("active");
        if(caesarKey.value.length > 0) {
            document.getElementById("caesarResults").textContent = rot(caesarResults, parseInt(caesarNumber), getCustomAlphabet(caesarKey.value));
        } else {
            document.getElementById("caesarResults").textContent = rot(caesarResults, parseInt(caesarNumber));
        }
    }));
}
// Caesar - Go backwards
caesarPrevious && caesarPrevious.addEventListener("click", function() {
    const caesarText = document.getElementById("caesarText");

    if (!emptyContainerCheck(caesarText.value, caesarText)) {
        return false;
    }
    if (!largeDataWarning(caesarText.value, caesarText)) {
        return false;
    }

    let activeButton;
    if (document.querySelector(".caesar-link.active") !== null) {
        activeButton = document.querySelector(".caesar-link.active");
    } else {
        activeButton = document.querySelector(".caesar-link:first-child");
    }
    let activeCaesarNumber = activeButton.getAttribute("data-caesar-number");
    let previousCaesarNumber = parseInt(activeCaesarNumber) - 1; 

    if (activeButton.getAttribute("data-caesar-number") === "1") {
        document.getElementById("caesar26").click();
    } else {
        document.getElementById(`caesar${previousCaesarNumber}`).click();
    }
});

// TOR - Go forwards
caesarNext && caesarNext.addEventListener("click", function() {
    const caesarText = document.getElementById("caesarText");

    if (!emptyContainerCheck(caesarText.value, caesarText)) {
        return false;
    }
    if (!largeDataWarning(caesarText.value, caesarText)) {
        return false;
    }

    let activeButton;
    if (document.querySelector(".caesar-link.active") !== null) {
        activeButton = document.querySelector(".caesar-link.active");
    } else {
        activeButton = document.querySelector(".caesar-link:first-child");
    }
    let activeCaesarNumber = activeButton.getAttribute("data-caesar-number");
    let nextCaesarNumber = parseInt(activeCaesarNumber) + 1;

    if (activeButton.getAttribute("data-caesar-number") === "26") {
        document.getElementById("caesar1").click();
    } else {
        document.getElementById(`caesar${nextCaesarNumber}`).click();
    }
});