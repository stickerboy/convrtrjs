// Enable tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Enable dropdowns
const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

// Enable popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
const textareas = document.querySelectorAll(".form-control, .data-to-copy");

const resetData = document.getElementById("resetData");
resetData.addEventListener("click", function() {
    const tooltip = bootstrap.Tooltip.getInstance(resetData);
    let dtcLength = 0;
    [...textareas].map(ta => {
        if(ta.localName === 'textarea' || ta.localName === 'input') {
            if(ta.value.length !== 0) {
                dtcLength += ta.value.length;
                ta.value = "";
            }
        } else {
            if(ta.innerHTML.length !== 0) {
                dtcLength += ta.value.length;
                ta.innerHTML = "";
            }
        }
    });

    if(dtcLength === 0) {
        tooltip.hide();
        showToast("Warning", "No data to clear", "warning", 3000);
        return;
    }
    resetData.querySelector(".bi").classList.add("convrtr-spin");
    setTimeout(() => {
        resetData.querySelector(".bi").classList.remove("convrtr-spin");
        tooltip.hide();
        showToast("Notice", "Data successfully cleared", "convrtr", 3000);
    }, 1000);
});

// YEAH Toast!
function showToast(heading, content, color, delay) {
    let toastEL = document.getElementById('toast');
    const toast = bootstrap.Toast.getOrCreateInstance(toastEL, {delay: delay? delay : 5000});

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

function largeDataWarning(data) {
    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");
        return false;
    }
    return true;
}

function emptyContainerCheck(data, container) {
    let allElements = Array.from(document.querySelectorAll('.data-to-copy'));
    for (let element of allElements) {
        element.classList.remove('is-invalid');
    }

    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", "There is no content in the container you are trying to encode", "warning");
        return false;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    return true;
}

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
    if(!copyToClipboard(dtc, c)) {
        return false;
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
    download(dt, dtc);

    c.classList.replace("btn-light", "btn-convrtr");
    tooltip.setContent({ '.tooltip-inner': 'Downloaded!' });
    setTimeout(() => {
        c.classList.replace("btn-convrtr", "btn-light");
        tooltip.setContent({ '.tooltip-inner': 'Download' });
    }, 3430);
}));
