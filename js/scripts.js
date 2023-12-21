// Enable tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Enable dropdowns
const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

// Enable popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

const resetData = document.getElementById("resetData");
const textareas = document.getElementsByClassName("data-to-copy");
resetData.addEventListener("click", function() {
    const tooltip = bootstrap.Tooltip.getInstance(resetData);
    [...textareas].map(ta => {
        ta.value = "";
    });
    resetData.querySelector(".bi").classList.add("convrtr-spin");
    
    setTimeout(() => {
        resetData.querySelector(".bi").classList.remove("convrtr-spin");
        tooltip.hide();
        showToast("Notice", "Data successfully cleared", "convrtr", 3000);
    }, 1000);
});

// Select text
// https://stackoverflow.com/a/20079910/3172872
// Modified to work with inputs and divs
function selectAllText(element) {
    if (element.localName === 'textarea') {
        element.focus();
        element.setSelectionRange(0, element.value.length);
    } else {
        window.getSelection()
            .selectAllChildren(
                element
        );
    }
}

// File downloads
function download(filename, text) {
    let e = document.createElement('a');
    e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    e.setAttribute('download', `${filename}.txt`);
  
    e.style.display = 'none';
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
}

// Select and focus contents of an element
const selectButtons = document.getElementsByClassName("btn-select"); 
Array.from(selectButtons, c => c.addEventListener('click', function() {
    let card = c.closest(".card");
    let textarea = card.querySelector(".data-to-copy.active");
    let dtc = textarea.localName === "textarea" ? textarea.value : textarea.textContent;
    const tooltip = bootstrap.Tooltip.getInstance(c);

    Array.from(selectButtons, button => {
        button.classList.remove("btn-convrtr", "btn-danger");
        button.classList.add("btn-light");
    });

    Array.from(textareas, ta => {
        ta.classList.remove("is-invalid");
    });

    if(dtc.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to select", "warning");
        textarea.classList.add("is-invalid");
        tooltip.setContent({ '.tooltip-inner': 'No data to select' });
        setTimeout(() => {
            tooltip.setContent({ '.tooltip-inner': 'Select All' });
        }, 3430);
        c.classList.replace("btn-light", "btn-danger");
        return;
    }

    if(textarea.classList.contains("is-invalid")) {
        textarea.classList.remove("is-invalid");
    }        
    c.classList.replace("btn-light", "btn-convrtr");
    tooltip.setContent({ '.tooltip-inner': 'Selected!' });
    setTimeout(() => {
        c.classList.replace("btn-convrtr", "btn-light");
        tooltip.setContent({ '.tooltip-inner': 'Sellect All' });
    }, 3430);

    selectAllText(textarea);        
}));

// Copy current textarea contents to clipboard
const copyButtons = document.getElementsByClassName("btn-copy"); 
Array.from(copyButtons, c => c.addEventListener('click', function() {
    let card = c.closest(".card");
    let textarea = card.querySelector(".data-to-copy.active");
    let dtc = textarea.localName === "textarea" ? textarea.value : textarea.textContent;
    const tooltip = bootstrap.Tooltip.getInstance(c);

    Array.from(copyButtons, button => {
        button.classList.remove("btn-convrtr", "btn-danger");
        button.classList.add("btn-light");
    });

    Array.from(textareas, ta => {
        ta.classList.remove("is-invalid");
    });

    if(dtc.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to copy", "warning");
        textarea.classList.add("is-invalid");
        tooltip.setContent({ '.tooltip-inner': 'No data to copy' });
        setTimeout(() => {
            tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
        }, 3430);
        c.classList.replace("btn-light", "btn-danger");
        return;
    }

    if(textarea.classList.contains("is-invalid")) {
        textarea.classList.remove("is-invalid");
    }        
    c.classList.replace("btn-light", "btn-convrtr");
    setTimeout(() => {
        c.querySelector(".bi-clipboard").classList.toggle("bi-clipboard-check-fill");
        tooltip.setContent({ '.tooltip-inner': 'Copied!' });
    }, 343);
    setTimeout(() => {
        c.classList.replace("btn-convrtr", "btn-light");
        c.querySelector(".bi-clipboard").classList.toggle("bi-clipboard-check-fill");
        tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
    }, 3430);

    copyToClipboard(dtc, c);        
}));

// Download the contents of the closest textarea
const downloadButtons = document.getElementsByClassName("btn-download"); 
Array.from(downloadButtons, c => c.addEventListener('click', function() {
    let card = c.closest(".card");
    let textarea = card.querySelector(".data-to-copy.active");
    let dt = card.querySelector(".card-label").textContent;
    let dtc = textarea.localName === "textarea" ? textarea.value : textarea.textContent;
    const tooltip = bootstrap.Tooltip.getInstance(c);

    Array.from(downloadButtons, button => {
        button.classList.remove("btn-convrtr", "btn-danger");
        button.classList.add("btn-light");
    });
    
    Array.from(textareas, ta => {
        ta.classList.remove("is-invalid");
    });

    if(dtc.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to download", "warning");
        textarea.classList.add("is-invalid");
        tooltip.setContent({ '.tooltip-inner': 'No data to download' });
        setTimeout(() => {
            tooltip.setContent({ '.tooltip-inner': 'Download' });
        }, 3430);
        c.classList.replace("btn-light", "btn-danger");
        return;
    }

    if(textarea.classList.contains("is-invalid")) {
        textarea.classList.remove("is-invalid");
    }        
    c.classList.replace("btn-light", "btn-convrtr");
    tooltip.setContent({ '.tooltip-inner': 'Downloaded!' });
    setTimeout(() => {
        c.classList.replace("btn-convrtr", "btn-light");
        tooltip.setContent({ '.tooltip-inner': 'Download' });
    }, 3430);
    
    download(dt, dtc);
}));

// ROT Text
const rotButtons = document.getElementsByClassName("rot-link");
const rotPrevious = document.getElementById("rotPrev");
const rotNext     = document.getElementById("rotNext");

Array.from(rotButtons, c => c.addEventListener('click', function() {
    const rotText = document.getElementById("rotText");
    const rotNumber = c.getAttribute("data-rot-number");

    if(rotText.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        rotText.classList.add("is-invalid");
        document.getElementById("rotResults").textContent = "";
        return;
    }
    if(rotText.classList.contains("is-invalid")) {
        rotText.classList.remove("is-invalid");
    }
    Array.from(rotButtons, button => {
        button.classList.remove("active");
    });
    c.classList.add("active");

    document.getElementById("rotResults").textContent = rot(rotText.value.trim(), parseInt(rotNumber));
}));

// ROT - Go backwards
rotPrevious.addEventListener('click', function() {
    const rotText = document.getElementById("rotText");

    if(rotText.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        rotText.classList.add("is-invalid");
        return;
    }

    if(rotText.classList.contains("is-invalid")) {
        rotText.classList.remove("is-invalid");
    }
    let activeButton;
    if(document.querySelector(".rot-link.active") !== null) {
        activeButton = document.querySelector(".rot-link.active");
    } else {
        activeButton = document.querySelector(".rot-link:first-child");
    }
    let activeRotNumber = activeButton.getAttribute("data-rot-number");
    let previousRotNumber = parseInt(activeRotNumber) - 1; 

    if (activeButton.getAttribute("data-rot-number") === "1") {
        document.getElementById("rot26").click();
    } else {
        document.getElementById(`rot${previousRotNumber}`).click();
    }
});

// TOR - Go forwards
rotNext.addEventListener('click', function() {
    const rotText = document.getElementById("rotText");

    if(rotText.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        rotText.classList.add("is-invalid");
        return;
    }

    if(rotText.classList.contains("is-invalid")) {
        rotText.classList.remove("is-invalid");
    }
    let activeButton;
    if(document.querySelector(".rot-link.active") !== null) {
        activeButton = document.querySelector(".rot-link.active");
    } else {
        activeButton = document.querySelector(".rot-link:first-child");
    }
    let activeRotNumber = activeButton.getAttribute("data-rot-number");
    let nextRotNumber = parseInt(activeRotNumber) + 1; 

    if (activeButton.getAttribute("data-rot-number") === "26") {
        document.getElementById("rot1").click();
    } else {
        document.getElementById(`rot${nextRotNumber}`).click();
    }
});

// Flip text upside down
const flipButton = document.getElementById("flipDecode");
flipButton.addEventListener('click', function() {
    const flipString = document.getElementById("flipText");

    if(flipString.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        flipString.classList.add("is-invalid");
        document.getElementById("flipResults").textContent = "";
        return;
    }

    if(flipString.classList.contains("is-invalid")) {
        flipString.classList.remove("is-invalid");
    }
    let flipDirection = document.getElementById("flipDirection");
    document.getElementById("flipResults").textContent = flipDirection.checked ? 
                                                         flipText(flipString.value, alphabet, alphaFlip) : 
                                                         reverseString(flipText(flipString.value, alphabet, alphaFlip));
});

// Re-code Hex on delimeter change
let hexDelimiterSelect = document.getElementById("hexDelimiter");
hexDelimiterSelect.addEventListener('change', function() {
    let hexData = document.getElementById("form-hex").value;
    if(hexData === "") {
        return;
    }
    document.getElementById("encode").click();
});

// Re-code Morsenary on delimeter change
let morsenarySelect = document.getElementById("morsenarySetting");
morsenarySelect.addEventListener('change', function() {
    let morsenaryData = document.getElementById("form-morsenary").value;
    if(morsenaryData === "") {
        return;
    }
    document.getElementById("mrsnryDecode").click();
});


// Shift Hex
const shiftButton = document.getElementById("shiftDecode");
shiftButton.addEventListener('click', function() {
    const shiftString = document.getElementById("shiftText");
    let shiftValue = document.getElementById("shiftValue");

    if(shiftString.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        shiftString.classList.add("is-invalid");
        document.getElementById("text-tab-pane").textContent = "";
        document.getElementById("binary-tab-pane").textContent = "";
        document.getElementById("hex-tab-pane").textContent = "";
        document.getElementById("base64-tab-pane").textContent = "";
        document.getElementById("decimal-tab-pane").textContent = "";
        return;
    }

    if(shiftValue.value.trim() === "") {
        shiftValue.classList.add("is-invalid");
        return;
    }

    if(shiftString.classList.contains("is-invalid")) {
        shiftString.classList.remove("is-invalid");
    }
    if(shiftValue.classList.contains("is-invalid")) {
        shiftValue.classList.remove("is-invalid");
    }

    document.getElementById("text-tab-pane").textContent = decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value));
    document.getElementById("binary-tab-pane").textContent = stringToBinary(decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value)));
    document.getElementById("hex-tab-pane").textContent = stringToHex(decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value)));
    document.getElementById("base64-tab-pane").textContent = stringToBase64(decimalToString(shiftHexString(shiftString.value.trim(), shiftValue.value)));
    document.getElementById("decimal-tab-pane").textContent =  shiftHexString(shiftString.value.trim(), shiftValue.value);
});

const toolChange = document.getElementById("toolChange");
toolChange.addEventListener('click', function() {
    let toolsString = document.getElementById("toolsTextarea");

    if(toolsString.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        toolsString.classList.add("is-invalid");
        return;
    }

    if(toolsString.classList.contains("is-invalid")) {
        toolsString.classList.remove("is-invalid");
    }

    let textTools = document.getElementById("textToolsSelect");
    let chainCommands = document.getElementById("chainCommands");
    let textResults = chainCommands.checked ? document.getElementById("textResults").textContent : toolsString.value;

    switch (textTools.value) {
        case 'stripspaces':
            document.getElementById("textResults").textContent = stripSpaces(textResults);
            break;
        case 'uppercase':
            document.getElementById("textResults").textContent = uppercase(textResults);
            break;
        case 'lowercase':
            document.getElementById("textResults").textContent = lowercase(textResults);
            break;
        case 'numbersonly':
            document.getElementById("textResults").textContent = numbersOnly(textResults);
            break;
        case 'lettersonly':
            document.getElementById("textResults").textContent = lettersOnly(textResults);
            break;
        case 'stripspecialchars':
            document.getElementById("textResults").textContent = stripSpecialChars(textResults);
            break;
        case 'removenumbers':
            document.getElementById("textResults").textContent = stripNumbers(textResults);
            break;
        case 'removeletters':
            document.getElementById("textResults").textContent = stripLetters(textResults);
            break;
        case 'specialcharsonly':
            document.getElementById("textResults").textContent = specialCharsOnly(textResults);
            break;
        case 'urlencode':
            document.getElementById("textResults").textContent = urlEncode(textResults);
            break;
        case 'urldecode':
            document.getElementById("textResults").textContent = urlDecode(textResults);
            break;
            default:
    }
});


// Reverse Hex
const reverseHexButton = document.getElementById("reverseHexDecode");
reverseHexButton.addEventListener('click', function() {
    const reverseHexString = document.getElementById("reverseHexText");

    if(reverseHexString.value.trim() === "") {
        showToast("Warning", "There is no content in the container you are trying to convert", "warning");
        reverseHexString.classList.add("is-invalid");
        return;
    }

    if(reverseHexString.classList.contains("is-invalid")) {
        reverseHexString.classList.remove("is-invalid");
    }

    document.getElementById("reverseHexResults").textContent = reverseHex(reverseHexString.value);
});
