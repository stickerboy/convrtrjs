import copyToClipboard from "../ui/clipboard.js";
import { clearLocalStorage } from "../ui/storage.js";
import { showToast } from "../ui/toast.js";
import * as toolkit from "../lib/toolkit.js";

/**
 * Selects all text within an element (works with textareas and divs)
 * https://stackoverflow.com/a/20079910/3172872
 * @param {HTMLElement} element - The element containing the text to be selected.
 * @returns {void}
 */
function selectAllText(element, trim = false) {
    if (element.localName === "textarea") {
        element.focus();
        if (trim) {
            element.value = element.value.trim();
        }
        element.setSelectionRange(0, element.value.length);
    } else {
        const selection = window.getSelection();
        selection.removeAllRanges();

        const range = document.createRange();
        range.selectNodeContents(element);
        selection.addRange(range);
    }
}

/**
 * File download with the specified filename and text content
 * @param {string} filename - The desired filename for the downloaded file.
 * @param {string} text - The content to be saved in the file.
 * @returns {void}
 */
function download(filename, text) {
    let e = document.createElement("a");
    e.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    e.setAttribute("download", `${filename}.txt`);

    e.style.display = "none";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
}

const textareas = document.querySelectorAll(".form-control, .data-to-copy");
const resetButtons = document.querySelectorAll(".btn-reset-data");

if (resetButtons.length > 0) {
    resetButtons.forEach(resetBtn => {
        resetBtn.addEventListener("click", function () {
            const tooltip = bootstrap.Tooltip.getInstance(resetBtn);
            let dtcLength = 0;

            [...textareas].forEach(ta => {
                if (toolkit.inArray(ta.localName, ["div", "tbody"])) {
                    if (ta.innerHTML.length !== 0) {
                        dtcLength += ta.innerHTML.length;
                        ta.innerHTML = "";
                    }
                } else {
                    if (ta.value !== undefined && ta.value.length !== 0) {
                        dtcLength += ta.value.length;
                        ta.value = "";
                    }
                }
            });

            resetBtn.querySelector(".bi").classList.add("convrtr-spin");
            clearLocalStorage();

            setTimeout(() => {
                resetBtn.querySelector(".bi").classList.remove("convrtr-spin");
                tooltip?.hide();

                if (dtcLength === 0) {
                    showToast("Information", "Local storage successfully cleared", "info", 3000);
                } else {
                    showToast("Notice", "All data successfully cleared", "convrtr", 3000);
                }
            }, 1000);
        });
    });
}


// Select and focus contents of an element
const selectButtons = document.getElementsByClassName("btn-select");
if (selectButtons.length > 0) {
    Array.from(selectButtons, c => c.addEventListener("click", function () {
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

        if (dtc.trim() === "") {
            showToast("Warning", "There is no content in the container you are trying to select", "warning");
            textarea.classList.add("is-invalid");
            tooltip.setContent({ ".tooltip-inner": "No data to select" });
            setTimeout(() => {
                tooltip.setContent({ ".tooltip-inner": "Select All" });
            }, 3430);
            c.classList.replace("btn-light", "btn-danger");
            return;
        }

        if (textarea.classList.contains("is-invalid")) {
            textarea.classList.remove("is-invalid");
        }
        c.classList.replace("btn-light", "btn-convrtr");
        tooltip.setContent({ ".tooltip-inner": "Selected!" });
        setTimeout(() => {
            c.classList.replace("btn-convrtr", "btn-light");
            tooltip.setContent({ ".tooltip-inner": "Select All" });
        }, 3430);

        selectAllText(textarea, false);
    }));
}

// Copy current textarea contents to clipboard
const copyButtons = document.getElementsByClassName("btn-copy");
if (copyButtons.length > 0) {
    Array.from(copyButtons, c => c.addEventListener("click", function () {
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

        if (dtc.trim() === "") {
            showToast("Warning", "There is no content in the container you are trying to copy", "warning");
            textarea.classList.add("is-invalid");
            tooltip.setContent({ ".tooltip-inner": "No data to copy" });
            setTimeout(() => {
                tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
            }, 3430);
            c.classList.replace("btn-light", "btn-danger");
            return;
        }

        if (textarea.classList.contains("is-invalid")) {
            textarea.classList.remove("is-invalid");
        }
        if (!copyToClipboard(dtc, c)) {
            return false;
        }

        c.classList.replace("btn-light", "btn-convrtr");
        setTimeout(() => {
            c.querySelector(".bi-clipboard").classList.toggle("bi-clipboard-check-fill");
            tooltip.setContent({ ".tooltip-inner": "Copied!" });
        }, 343);
        setTimeout(() => {
            c.classList.replace("btn-convrtr", "btn-light");
            c.querySelector(".bi-clipboard").classList.toggle("bi-clipboard-check-fill");
            tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
        }, 3430);
    }));
}

// Download the contents of the closest textarea
const downloadButtons = document.getElementsByClassName("btn-download");
if (downloadButtons.length > 0) {
    Array.from(downloadButtons, c => c.addEventListener("click", function () {
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

        if (dtc.trim() === "") {
            showToast("Warning", "There is no content in the container you are trying to download", "warning");
            textarea.classList.add("is-invalid");
            tooltip.setContent({ ".tooltip-inner": "No data to download" });
            setTimeout(() => {
                tooltip.setContent({ ".tooltip-inner": "Download" });
            }, 3430);
            c.classList.replace("btn-light", "btn-danger");
            return;
        }

        if (textarea.classList.contains("is-invalid")) {
            textarea.classList.remove("is-invalid");
        }
        download(dt, dtc);

        c.classList.replace("btn-light", "btn-convrtr");
        tooltip.setContent({ ".tooltip-inner": "Downloaded!" });
        setTimeout(() => {
            c.classList.replace("btn-convrtr", "btn-light");
            tooltip.setContent({ ".tooltip-inner": "Download" });
        }, 3430);
    }));
}

// Toggle aria values for checkboxes
const customSwitch = document.querySelector('[role="switch"]');
customSwitch && customSwitch.addEventListener('click', () => {
    const isChecked = customSwitch.getAttribute('aria-checked') === 'true';
    customSwitch.setAttribute('aria-checked', !isChecked);
});
