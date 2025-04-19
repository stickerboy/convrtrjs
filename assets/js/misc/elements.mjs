import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as elements from './elements-fn.mjs';

const elementsChange = document.getElementById("elementsChange");
elementsChange && elementsChange.addEventListener("click", function () {
    let elementsString = document.getElementById("elementsTextarea");

    if (!emptyContainerCheck(elementsString.value, elementsString)) {
        return false;
    }
    if (!largeDataWarning(elementsString.value, elementsString)) {
        return false;
    }

    let elementPropFrom = document.getElementById("elementPropFrom");
    let elementPropTo = document.getElementById("elementPropTo");
    let removeDelimiters = document.getElementById("removeDelimiters");

    try {
        elements.convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value);
    } catch (e) {
        showToast("Error", `An error occurred trying to map elements: ${e.message}`, "danger");
        return;
    }

    document.getElementById("elementResults").textContent = elements.convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value, removeDelimiters.checked);
});