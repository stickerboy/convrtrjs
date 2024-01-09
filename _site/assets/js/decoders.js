// TEAH Toast!
function showToast(heading, content, color, delay) {
    let toastEL = document.getElementById('toast');
    const toast = new bootstrap.Toast(toastEL, {delay: delay? delay : 5000});
    toastEL.addEventListener('hidden.bs.toast', () => {
        toastEL.querySelector(".toast-header").classList.remove("text-bg-warning", "text-bg-danger");
        toastEL.querySelector(".toast-header").classList.add("text-bg-convrtr");
    });

    if (color) {
        toastEL.querySelector(".toast-header").classList.replace("text-bg-convrtr", `text-bg-${color}`);
    }
    toastEL.querySelector(".toast-header strong").textContent = heading;
    toastEL.querySelector(".toast-body").textContent = content;
  
    toast.show();
}

// Make it so
document.getElementById("encode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }

    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to encode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(data);
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(data);
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(data);
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(data);
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(data);
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(data);
});


// Convert from Binary
document.getElementById("binaryDecode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        binaryToString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = binaryToString(data);
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(binaryToString(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(binaryToString(data));
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(binaryToString(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(binaryToString(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(binaryToString(data));
});


// Convert from Hex
document.getElementById("hexDecode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        hexToString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = hexToString(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(hexToString(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(hexToString(data));
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(hexToString(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(hexToString(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(hexToString(data));
});


// Convert from Base64
document.getElementById("b64Decode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        base64ToString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = base64ToString(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(base64ToString(data));
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(base64ToString(data));
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(base64ToString(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(base64ToString(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(base64ToString(data));
});


// Convert from Decimal
document.getElementById("decDecode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        decimalToString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = decimalToString(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(decimalToString(data));
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(decimalToString(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(decimalToString(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(decimalToString(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(decimalToString(data));
});


// Reverse
document.getElementById("revDecode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        reverseString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = reverseString(stringToBinary(data));
    document.getElementById("convrtr-hex").querySelector("textarea").value = reverseString(stringToHex(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = reverseString(stringToBase64(data));
    document.getElementById("convrtr-decimal").querySelector("textarea").value = reverseString(stringToDecimal(data));
    document.getElementById("convrtr-rot13").querySelector("textarea").value = reverseString(rot13(data));
    document.getElementById("convrtr-morse").querySelector("textarea").value = reverseString(stringToMorse(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = reverseString(stringToMorsenary(data));
});


// Convert from Rot13
document.getElementById("rot13Decode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        rot13(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = rot13(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(rot13(data));
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(rot13(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(rot13(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(rot13(data));
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(rot13(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(rot13(data));
});


// Convert from Morse
document.getElementById("morseDecode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        morseToString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = morseToString(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(morseToString(data));
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(morseToString(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(morseToString(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = rot13(morseToString(data));
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(morseToString(data));
    document.getElementById("convrtr-morsenary").querySelector("textarea").value = stringToMorsenary(morseToString(data));
});


// Convert from Morsenary
document.getElementById("mrsnryDecode").addEventListener('click', function() {
    const container = this.closest(".card-body").querySelector("textarea");
    const data = container.value;

    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return;
    }

    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }
    
    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to decode", "warning");
        return;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    try {
        morsenaryToString(data);
    } catch (e) {
        showToast("Error", "An error occured trying to decode the data.", "danger");
        return;
    }
    document.getElementById("convrtr-text").querySelector("textarea").value = morsenaryToString(data);
    document.getElementById("convrtr-binary").querySelector("textarea").value = stringToBinary(morsenaryToString(data));
    document.getElementById("convrtr-hex").querySelector("textarea").value = stringToHex(morsenaryToString(data));
    document.getElementById("convrtr-base64").querySelector("textarea").value = stringToBase64(morsenaryToString(data));
    document.getElementById("convrtr-reverse").querySelector("textarea").value = reverseString(data);
    document.getElementById("convrtr-rot13").querySelector("textarea").value = "";
    document.getElementById("convrtr-decimal").querySelector("textarea").value = stringToDecimal(morsenaryToString(data));
    document.getElementById("convrtr-morse").querySelector("textarea").value = stringToMorse(morsenaryToString(data));
});