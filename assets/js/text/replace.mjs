import * as toolkit from '../toolkit.mjs';
import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';

Object.entries(replace).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

const replaceButton = document.getElementById("replaceDecode");
replaceButton.addEventListener("click", function() {
    const replaceString = document.getElementById("replaceText");
    const replaceOld = document.getElementById("replaceValue");
    const replaceNew = document.getElementById("replacementValue");

    if(!emptyContainerCheck(replaceString.value, replaceString)) {
        return false;
    }
    if(!emptyContainerCheck(replaceOld.value, replaceOld, "Please provide the characters, words, or phrases you want to replace")) {
        return false;
    }
    if(!emptyContainerCheck(replaceNew.value, replaceNew, "Please provide the new characters, word, or phrases you want to be the replacements")) {
        return false;
    }
    if (!largeDataWarning(replaceString.value, replaceString)) {
        return false;
    }

    let chainReplacements = document.getElementById("replaceChain");
    let replaceCase = document.getElementById("replaceCase").checked;
    let replaceResults = document.getElementById("replaceResults");

    if(chainReplacements.checked && replaceResults.textContent.length > 0) {
        try {
            toolkit.replaceChars(replaceResults.textContent, replaceOld.value, replaceNew.value, replaceCase)
        } catch (e) {
            showToast("Error", `An error occurred trying to replace characters: ${e.message}`, "danger");
            return;
        }
        replaceResults.textContent = toolkit.replaceChars(replaceResults.textContent, replaceOld.value, replaceNew.value, replaceCase);
    } else {
        try {
            toolkit.replaceChars(replaceString.value, replaceOld.value, replaceNew.value, replaceCase)
        } catch (e) {
            showToast("Error", `An error occurred trying to replace characters: ${e.message}`, "danger");
            return;
        }
        replaceResults.textContent = toolkit.replaceChars(replaceString.value, replaceOld.value, replaceNew.value, replaceCase);
    }
});