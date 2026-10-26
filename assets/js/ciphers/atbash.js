import * as atbash from './atbash-fn.js';
import { emptyContainerCheck, largeDataWarning } from '../scripts.js';

Object.entries(atbash).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const atbashDecodeButton = document.getElementById("atbashDecode");
atbashDecodeButton && atbashDecodeButton.addEventListener("click", function() {
    const atbashString = document.getElementById("atbashText");

    if(!emptyContainerCheck(atbashString.value, atbashString)) {
        return false;
    }
    if (!largeDataWarning(atbashString.value, atbashString)) {
        return false;
    }

    let chainAb = document.getElementById("chainAb");
    let abR = document.getElementById("atbashResults").textContent;
    let atbashResults = chainAb.checked && abR.length > 0 ? abR : atbashString.value;

    document.getElementById("atbashResults").textContent = atbash.atbashCipher(atbashResults);
});