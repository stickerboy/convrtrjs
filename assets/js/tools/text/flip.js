import * as toolkit from '../../lib/toolkit.js';
import * as flip from '../../lib/text/flip.js';
import { emptyContainerCheck, largeDataWarning } from '../../ui/input.js';

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
    flip.flipText(flipString.value) : toolkit.reverseString(flip.flipText(flipString.value));
});