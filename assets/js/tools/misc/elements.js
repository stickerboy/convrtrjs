import { emptyContainerCheck, largeDataWarning } from '../../ui/input.js';
import { showToast } from '../../ui/toast.js';
import * as elements from '../../lib/misc/elements.js';

const elementsChange = document.getElementById("elementsChange");
elementsChange && elementsChange.addEventListener("click", async function () {
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

    let result;
    try {
        result = await elements.convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value, removeDelimiters.checked);
    } catch (e) {
        showToast("Error", `An error occurred trying to map elements: ${e.message}`, "danger");
        return;
    }

    document.getElementById("elementResults").textContent = result;
});