// Forerunner
const fralphabet = " …†‡ˆŠŒŽ‘’“™šœžŸ¡¤¥¦§«¬®¯±²´µº»½¾¿ÀÂÃÅ";

function convertElements(string, sourceProp, targetProp, removeDelimiters) {
    const strings = string.split(/[ ,:;\-]+/);
    const results = [];

    for (const str of strings) {
        let found = false;

        for (const el of ELEMENTS) {
            if (el.hasOwnProperty(sourceProp)) {
                // Compare the value regardless of its type (string or number)
                if (el[sourceProp] === str || el["number"] === Number(str)) {
                    if (el.hasOwnProperty(targetProp)) {
                        const targetValue = el[targetProp];
                        // console.log(`Converted ${sourceProp} (${str}) to ${targetProp} (${targetValue})`);
                        results.push(targetValue);
                        found = true;
                        break;
                    } else {
                        throw new Error(`Property "${targetProp}" does not exist for ${el.name}`);
                    }
                }
            }
        }

        if (!found) {
            throw new Error(`Element with ${sourceProp} "${str}" not found`);
        }
    }

    let convertedElements;
    if (removeDelimiters && removeDelimiters === true) {
        convertedElements = results.join("");
    } else {
        convertedElements = results.join(string.match(/[ ,\-]+/));
    }
    return convertedElements;
}


// Periodic element conversion
const elementsChange = document.getElementById("elementsChange");
elementsChange.addEventListener("click", function() {
    let elementsString = document.getElementById("elementsTextarea");

    if(!emptyContainerCheck(elementsString.value, elementsString)) {
        return false;
    }
    if (!largeDataWarning(elementsString.value, elementsString)) {
        return false;
    }

    let elementPropFrom = document.getElementById("elementPropFrom");
    let elementPropTo = document.getElementById("elementPropTo");
    let removeDelimiters = document.getElementById("removeDelimiters");

    try {
        convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value);
    } catch(e) {
        showToast("Error", `An error occured trying to map elements: ${e.message}`, "danger");
        return;
    }

    document.getElementById("elementResults").textContent = convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value, removeDelimiters.checked);
});