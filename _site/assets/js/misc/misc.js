// Braille
var braille = [[" "," "],["⠀"," "],["⠸","_"],["⠤","-"],["⠠",","],["⠰",";"],["⠱",":"],["⠮","!"],["⠹","?"],["⠨","."],["⠷","("],["⠪","["],["⠈","@"],["⠡","*"],["⠌","/"],["⠄","'"],["⠐","\""],["⠳","\\"],["⠯","&"],["⠩","%"],["⠘","^"],["⠬","+"],["⠣","<"],["⠜",">"],["⠫","$"],["⠴","0"],["⠂","1"],["⠆","2"],["⠒","3"],["⠲","4"],["⠢","5"],["⠖","6"],["⠶","7"],["⠦","8"],["⠔","9"],["⠁","A"],["⠃","B"],["⠉","C"],["⠙","D"],["⠑","E"],["⠋","F"],["⠛","G"],["⠓","H"],["⠊","I"],["⠚","J"],["⠅","K"],["⠇","L"],["⠍","M"],["⠝","N"],["⠕","O"],["⠏","P"],["⠟","Q"],["⠗","R"],["⠎","S"],["⠞","T"],["⠥","U"],["⠧","V"],["⠺","W"],["⠭","X"],["⠵","Z"],["⠻","]"],["⠼","#"],["⠽","Y"],["⠾",")"],["⠿","="]];

// Forerunner
const fralphabet = [[" "," "],["…","0"],["†","1"],["‡","2"],["ˆ","3"],["Š","4"],["Œ","5"],["Ž","6"],["‘","7"],["’","8"],["“","9"],["™","A"],["š","B"],["œ","C"],["ž","D"],["Ÿ","E"],["¡","F"],["¤","G"],["¥","H"],["¦","I"],["§","J"],["«","K"],["¬","L"],["®","M"],["¯","N"],["±","O"],["²","P"],["´","Q"],["µ","R"],["º","S"],["»","T"],["½","U"],["¾","V"],["¿","W"],["À","X"],["Â","Y"],["Ã","Z"],["Å","Æ"]
];

/**
 * Converts between Braille and text using a specified map.
 * If `mode` is 'braille', converts from Braille to text.
 * If `mode` is 'text', converts from text to Braille.
 * @param {string} string - The string to convert.
 * @param {string} mode - The mode of conversion, either 'braille' or 'text'.
 * @param {Array<Array<string>>} [map=braille] - The custom map to use for conversion. Defaults to the 'braille' map.
 * @returns {string} - The converted string.
 */
function convertBraille(string, mode, map = braille) {
    if (mode === 'braille') {
        return string.split("").map(b => getKeyValue(b.toUpperCase(), map)).join("");
    } else if (mode === 'text') {
        return string.split("").map(b => getKeyValue(b.toUpperCase(), map, 'value')).join("");
    } else {
        throw new Error(`Invalid mode "${mode}". Use "braille" or "text".`);
    }
}


/**
 * Converts periodic elements from a string representation to their corresponding target property values.
 * @param {string} string - The input string containing element representations.
 * @param {string} sourceProp - The property used for matching elements in the input string.
 * @param {string} targetProp - The target property whose value should be extracted.
 * @param {boolean} removeDelimiters - Whether to remove delimiters (optional, default is false).
 * @returns {string} - The resulting string after converting elements.
 * @throws {Error} - Throws an error if an element with the specified source property is not found,
 * or if the target property does not exist for a matched element.
 */
function convertElements(string, sourceProp, targetProp, removeDelimiters) {
    const strings = string.trim().split(/[ ,:;\-]+/);
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
        showToast("Error", `An error occurred trying to map elements: ${e.message}`, "danger");
        return;
    }

    document.getElementById("elementResults").textContent = convertElements(elementsString.value, elementPropFrom.value, elementPropTo.value, removeDelimiters.checked);
});

// Braille
let bR = document.getElementById("brailleResults");
let bIR = document.getElementById("brailleImageResults");
let bIT = document.getElementById("brImageTransparency");
let brailleImage = document.getElementById("generateBrailleImage");
let brailleSwitch = document.getElementById("brailleSwitch");

const brailleButton = document.getElementById("brailleConvert");
brailleButton.addEventListener("click", function() {
    const brailleString = document.getElementById("brailleTextarea");

    if(!emptyContainerCheck(brailleString.value, brailleString)) {
        bR.textContent = "";
        return false;
    }
    if (!largeDataWarning(brailleString.value, brailleString)) {
        return false;
    }
    
    if(brailleSwitch.checked) {
        bR.textContent = convertBraille(brailleString.value, 'braille');
    } else {
        bIR.textContent = convertBraille(brailleString.value, 'text');
    }
});

brailleSwitch.addEventListener("click", function() {
    if(brailleSwitch.checked) {
        this.nextElementSibling.innerText = "Convert Braille to Text";
    } else {
        this.nextElementSibling.innerText = "Convert Text to Braille";
    }
});

brailleImage.addEventListener("click", function() {
    if(!emptyContainerCheck(bIR.innerHTML, bIR, "There are no symbols present, please add at least one symbol to generate an image")) {
        return false;
    }
    let bOptions = {};
    bOptions.font = `3rem system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    bOptions.paddingTop = 0;
    bOptions.fontAdjust = true;
    if (bIT.checked) {
        bOptions.bgcolor = "rgba(0, 0, 0, 0)";
    }
    createImage(bIR.offsetWidth, bIR.offsetHeight, "braille.png", brailleImage, bIR.innerText, bOptions);
});

// Forerunner glyphs
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
    if(!emptyContainerCheck(fIR.innerHTML, fIR, "There are no glyphs present, please select at least one glyph to generate an image")) {
        return false;
    }
    let fOptions = {};
    if (fIT.checked) {
        fOptions.bgcolor = "rgba(0, 0, 0, 0)";
    } 
    createImage(fIR.offsetWidth, fIR.offsetHeight, "forerunner-glyphs.png", forerunnerImage, fIR.innerText, fOptions);
});

// Covenant glyphs
const covenantButtons    = document.getElementsByClassName("cov-glyph");
let cR = document.getElementById("covenantResults");
let cIR = document.getElementById("covenantImageResults");
let cIT = document.getElementById("covImageTransparency");
Array.from(covenantButtons, c => c.addEventListener("click", function() {
    Array.from(covenantButtons, button => {
        button.classList.remove("active");
    });
    c.classList.add("active");
    cR.textContent += c.textContent;
    cIR.textContent += c.innerHTML;
}));

let covenantImage = document.getElementById("generateCovenantImage");
covenantImage.addEventListener("click", function() {
    if(!emptyContainerCheck(cIR.innerHTML, cIR, "There are no glyphs present, please select at lease one glyph to generate an image")) {
        return false;
    }
    let cOptions = {};
    cOptions.font = "6rem 'Covenant'";
    cOptions.paddingTop = 108;
    if (cIT.checked) {
        cOptions.bgcolor = "rgba(0, 0, 0, 0)";
    } 
    createImage(cIR.offsetWidth, cIR.offsetHeight, "covenant-glyphs.png", covenantImage, cIR.innerText, cOptions);
});