// ROT Text
const rotButtons = document.getElementsByClassName("rot-link");
const rotPrevious = document.getElementById("rotPrev");
const rotNext     = document.getElementById("rotNext");

Array.from(rotButtons, c => c.addEventListener('click', function() {
    const rotText = document.getElementById("rotText");
    const rotNumber = c.getAttribute("data-rot-number");

    if(!emptyContainerCheck(rotText.value, rotText)) {
        document.getElementById("rotResults").textContent = "";
        return false;
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

    if(!emptyContainerCheck(rotText.value, rotText)) {
        return false;
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

    if(!emptyContainerCheck(rotText.value, rotText)) {
        return false;
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


// Vigenère cipher
const vigenereEncryptButton = document.getElementById("vigenereEncrypt");
vigenereEncryptButton.addEventListener('click', function() {
    const vigenereString = document.getElementById("vigenereText");
    const vigenereKey = document.getElementById("vigenereKey");

    if(!emptyContainerCheck(vigenereString.value, vigenereString)) {
        return false;
    }

    document.getElementById("vigenereResults").textContent = vignereEncrypt(vigenereString.value, vigenereKey.value);
});
const vigenereDecryptButton = document.getElementById("vigenereDecrypt");
vigenereDecryptButton.addEventListener('click', function() {
    const vigenereString = document.getElementById("vigenereText");
    const vigenereKey = document.getElementById("vigenereKey");

    if(!emptyContainerCheck(vigenereString.value, vigenereString)) {
        return false;
    }

    document.getElementById("vigenereResults").textContent = vignereDecrypt(vigenereString.value, vigenereKey.value);
});

// Hash strings
const hashButton = document.getElementById("hashDecode");
hashButton.addEventListener('click', function() {
    const hashString = document.getElementById("hashText");
    let hashResults = document.getElementById("hashResults");
    hashResults.innerHTML = "";

    if(!emptyContainerCheck(hashString.value, hashString)) {
        return false;
    }

    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">MD5</span>&nbsp;</th><td>${generateHashes(hashString.value, "MD5")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-1</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA1")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-256</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA256")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-512</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA512")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [224]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3224")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [256]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3256")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [384]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3384")}&nbsp;</td></tr>`);
    hashResults.insertAdjacentHTML('beforeend', `<tr><th scope="row"><span class="display-6 fs-6 fw-normal">SHA-3 [512]</span>&nbsp;</th><td>${generateHashes(hashString.value, "SHA3512")}&nbsp;</td></tr>`);
});