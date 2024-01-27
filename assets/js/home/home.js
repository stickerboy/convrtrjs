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


// Text tools
const toolChange = document.getElementById("toolChange");
toolChange.addEventListener('click', function() {
    let toolsString = document.getElementById("toolsTextarea");

    if(!emptyContainerCheck(toolsString.value, toolsString)) {
        return false;
    }
    if (!largeDataWarning(toolsString.value, toolsString)) {
        return false;
    }

    let textTools = document.getElementById("textToolsSelect");
    let chainCommands = document.getElementById("chainCommands");
    let tR = document.getElementById("textResults").textContent
    let textResults = chainCommands.checked && tR.length > 0 ? tR : toolsString.value;

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
        case 'alphabet':
            document.getElementById("textResults").textContent = lettersToNumbers(textResults);
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


// Flip text upside down
const flipButton = document.getElementById("flipDecode");
flipButton.addEventListener('click', function() {
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
                                                         flipText(flipString.value, alphabet, alphaFlip) : 
                                                         reverseString(flipText(flipString.value, alphabet, alphaFlip));
});


// Frequencies
const freqButton = document.getElementById("freqDecode");
freqButton.addEventListener('click', function() {
    const freqString = document.getElementById("freqText");
    let freqResults = document.getElementById("freqResults");
    freqResults.innerHTML = "";

    if(!emptyContainerCheck(freqString.value, freqString)) {
        return false;
    }
    if (!largeDataWarning(freqString.value, freqString)) {
        return false;
    }

    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Word count</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "word-count")}</code>&nbsp;<br /></div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Character count</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "char-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Character count (no spaces)</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "char-count-ns")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Letter count</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "letter-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Letter count (only capitals)</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "letter-count-caps")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Letter count (only lowercase)</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "letter-count-low")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Number count</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "number-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Special character count</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "special-count")}</code>&nbsp;</div>`);
    freqResults.insertAdjacentHTML('beforeend', `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3"><span class="display-6 fs-5">Special character count (no spaces)</span>&nbsp;<br /><code class="d-inline-flex px-2 text-dark bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">${stringStats(freqString.value, "special-count-ns")}</code>&nbsp;</div>`);
    
    freqResults.insertAdjacentHTML('beforeend', `${styledUniqueArrayItems(uniqueArray(freqString.value))}`);
    freqResults.insertAdjacentHTML('beforeend', `${styledArrayFrequencies(countArrayFreq(freqString.value))}`);
});


// Replace characters
const replaceButton = document.getElementById("replaceDecode");
replaceButton.addEventListener('click', function() {
    const replaceString = document.getElementById("replaceText");
    const replaceOld = document.getElementById("replaceValue");
    const replaceNew = document.getElementById("replacementValue");

    if(!emptyContainerCheck(replaceString.value, replaceString)) {
        return false;
    }
    if (!largeDataWarning(replaceString.value, replaceString)) {
        return false;
    }

    let chainReplacements = document.getElementById("replaceChain");
    let replaceCase = document.getElementById("replaceCase").checked;
    let replaceResults = document.getElementById("replaceResults");

    if(chainReplacements.checked && replaceResults.textContent.length > 0) {
        replaceResults.textContent = replaceChars(replaceResults.textContent, replaceOld.value, replaceNew.value, replaceCase);
    } else {
        replaceResults.textContent = replaceChars(replaceString.value, replaceOld.value, replaceNew.value, replaceCase);
    }
});