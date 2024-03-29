// Forerunner
const fralphabet = [[" "," "],["…","0"],["†","1"],["‡","2"],["ˆ","3"],["Š","4"],["Œ","5"],["Ž","6"],["‘","7"],["’","8"],["“","9"],["™","A"],["š","B"],["œ","C"],["ž","D"],["Ÿ","E"],["¡","F"],["¤","G"],["¥","H"],["¦","I"],["§","J"],["«","K"],["¬","L"],["®","M"],["¯","N"],["±","O"],["²","P"],["´","Q"],["µ","R"],["º","S"],["»","T"],["½","U"],["¾","V"],["¿","W"],["À","X"],["Â","Y"],["Ã","Z"],["Å","Æ"]
];

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

const forerunnerButtons    = document.getElementsByClassName("fr-glyph");
let fR = document.getElementById("forerunnerResults");
let fIR = document.getElementById("forerunnerImageResults");
let fIT = document.getElementById("frImageTransparency");
Array.from(forerunnerButtons, c => c.addEventListener("click", function() {
    Array.from(forerunnerButtons, button => {
        button.classList.remove("active");
    });
    c.classList.add("active");
    fR.textContent += getKeyValue(c.innerHTML, fralphabet);
    fIR.textContent += c.innerHTML;
}));

let forerunnerImage = document.getElementById("generateForerunnerImage");
forerunnerImage.addEventListener("click", function() {
    if(!emptyContainerCheck(fIR.innerHTML, fIR, "There are no glyphs present, please select at lease one glyph to generate an image")) {
        return false;
    }
    let fITransparency = fIT.checked ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 1)";
    createImage(fIR.offsetWidth,fIR.offsetHeight,"forerunner-glyphs.png", forerunnerImage, fIR.innerText, fITransparency);
});