import * as toolkit from '../toolkit.mjs';
import * as flip from './flip-fn.mjs';
import { emptyContainerCheck, largeDataWarning } from '../scripts.mjs';

Object.entries(flip).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const flipButton = document.getElementById("flipDecode");
flipButton.addEventListener("click", function() {
    const flipString = document.getElementById("flipText");

    if(!emptyContainerCheck(flipString.value, flipString)) {
        document.getElementById("flipResults").textContent = "";
        return false;
    }
    if (!largeDataWarning(flipString.value, flipString)) {
        return false;
    }

    let flipDirection = document.getElementById("flipDirection");
    document.getElementById("flipResults").textContent = flipDirection.checked ? 
    flip.flipText(flipString.value) : toolkit.reverseString(flipText(flipString.value));
});