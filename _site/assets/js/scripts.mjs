import copyToClipboard from '../js/clip.mjs';
import { inArray } from './toolkit.mjs';

/**
 * Saves a value to local storage
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to be stored.
 * @returns {void}
 */
function saveLocalStorage(key, value) {
    return localStorage.setItem(key, value);
}

/**
 * Retrieves an item from local storage
 * @param {string} string - The key of the item to retrieve.
 * @returns {any} - The parsed value retrieved from local storage.
 */
function getLocalStorageItem(string) {
    string = string.replace("\"", ""); // Remove any double quotes
    return JSON.parse(localStorage.getItem(string));
}

/**
 * Clears all items from local storage
 * @returns {void}
 */
function clearLocalStorage() {
    localStorage.clear();
}

/**
 * YEAH Toast! Displays a toast notification
 * @param {string} heading - The heading for the toast.
 * @param {string} content - The content of the toast.
 * @param {string} color - The color theme for the toast (optional).
 * @param {number} delay - The delay in milliseconds before the toast disappears (optional, default is 5000 milliseconds).
 * @returns {void}
 */
export function showToast(heading, content, color, delay) {
    let toastEL = document.getElementById("toast");
    const toast = bootstrap.Toast.getOrCreateInstance(toastEL, {delay: delay? delay : 5000});

    toastEL.addEventListener("hidden.bs.toast", () => {
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

/**
 * Checks if the data length exceeds a certain threshold and displays a warning if necessary
 * @param {string} data - The data to be checked.
 * @param {HTMLElement} container - The container element associated with the data (optional).
 * @returns {boolean} - Returns true if the data length is within acceptable limits, otherwise false.
 */
export function largeDataWarning(data, container) {
    if(container) {
        container.classList.remove("is-invalid", "ld-warning");
    }
    if(data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if(data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");

        if(container) {
            container.classList.add("is-invalid", "ld-warning");
        }
        return false;
    }
    return true;
}

/**
 * Checks if the data is empty and displays a warning if necessary
 * @param {string} data - The data to be checked.
 * @param {HTMLElement} container - The container element associated with the data.
 * @param {string} error - Custom error message (optional).
 * @returns {boolean} - Returns true if the data is not empty, otherwise false.
 */
export function emptyContainerCheck(data, container, error) {
    let allElements = Array.from(document.querySelectorAll(".data-to-copy"));
    for (let element of allElements) {
        element.classList.remove("is-invalid");
    }

    if(data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", error ? error : "There is no content in the container you are trying to encode", "warning");
        return false;
    }

    if(container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
    }
    return true;
}

/**
 * Selects all text within an element (works with textareas and divs)
 * https://stackoverflow.com/a/20079910/3172872
 * @param {HTMLElement} element - The element containing the text to be selected.
 * @returns {void}
 */
function selectAllText(element) {
    if (element.localName === "textarea") {
        element.focus();
        element.setSelectionRange(0, element.value.length);
    } else {
        window.getSelection()
            .selectAllChildren(
                element
        );
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

/**
 * Restores toggle states from local storage
 * @returns {void}
 */
const sectionToggles = document.getElementsByClassName("section-toggle");
if (sectionToggles.length > 0) {
    function restoreOptions() {
        if (localStorage.length !== 0) {
            for (const sectionToggle of sectionToggles) {
                const section = sectionToggle.closest(".section");
                if (!section) {
                    console.warn("No parent section found for:", sectionToggle);
                    continue; // Skip this iteration if no parent section exists
                }

                const sectionID = section.id;
                const x = getLocalStorageItem(sectionID);

                if (x !== null) {
                    sectionToggle.setAttribute("aria-expanded", x);
                }

                // Use the href attribute to locate the collapse element
                const collapseID = sectionToggle.getAttribute("href");
                const collapseElement = document.querySelector(collapseID);

                if (collapseElement) {
                    if (x === true) {
                        collapseElement.classList.add("show");
                    } else {
                        collapseElement.classList.remove("show");
                    }
                } else {
                    console.warn("No collapse element found for ID:", collapseID);
                }
            }
        }
    }

    document.addEventListener("DOMContentLoaded", restoreOptions);

    // Save toggle state
    Array.from(sectionToggles, c => c.addEventListener("click", function () {
        let section = c.closest(".section");
        saveLocalStorage(section.id, c.getAttribute("aria-expanded"));
    }));
}

// Enable tooltips
const tooltipTriggerList = document.querySelectorAll(`[data-bs-toggle="tooltip"]`);
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Enable dropdowns
const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

// Enable popovers
const popoverTriggerList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
const textareas = document.querySelectorAll(".form-control, .data-to-copy");

// Enable collapse
// const collapseElementList = document.querySelectorAll('.collapse');
// const collapseList = [...collapseElementList].map(collapseEl => new bootstrap.Collapse(collapseEl));

const resetData = document.getElementById("resetData");
resetData && resetData.addEventListener("click", function() {
    const tooltip = bootstrap.Tooltip.getInstance(resetData);
    let dtcLength = 0;

    [...textareas].map(ta => {
        if(inArray(ta.localName, ["div","tbody"])) {
            if(ta.innerHTML.length !== 0) {
                dtcLength += ta.innerHTML.length;
                ta.innerHTML = "";
            }
        } else {
            if(ta.value !== undefined  && ta.value.length !== 0) {
                dtcLength += ta.value.length;
                ta.value = "";
            }
        }
    });
    if(dtcLength === 0) {
        tooltip.hide();
        showToast("Information", "No data to clear", "info", 3000);
        return;
    }
    clearLocalStorage();

    resetData.querySelector(".bi").classList.add("convrtr-spin");
    setTimeout(() => {
        resetData.querySelector(".bi").classList.remove("convrtr-spin");
        tooltip.hide();
        showToast("Notice", "Data successfully cleared", "convrtr", 3000);
    }, 1000);
});

// Select and focus contents of an element
const selectButtons = document.getElementsByClassName("btn-select");
if(selectButtons.length > 0) {
    Array.from(selectButtons, c => c.addEventListener("click", function() {
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
            tooltip.setContent({ ".tooltip-inner": "No data to select" });
            setTimeout(() => {
                tooltip.setContent({ ".tooltip-inner": "Select All" });
            }, 3430);
            c.classList.replace("btn-light", "btn-danger");
            return;
        }

        if(textarea.classList.contains("is-invalid")) {
            textarea.classList.remove("is-invalid");
        }
        c.classList.replace("btn-light", "btn-convrtr");
        tooltip.setContent({ ".tooltip-inner": "Selected!" });
        setTimeout(() => {
            c.classList.replace("btn-convrtr", "btn-light");
            tooltip.setContent({ ".tooltip-inner": "Select All" });
        }, 3430);

        selectAllText(textarea);
    }));
}

// Copy current textarea contents to clipboard
const copyButtons = document.getElementsByClassName("btn-copy");
if(copyButtons.length > 0) {
    Array.from(copyButtons, c => c.addEventListener("click", function() {
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
            tooltip.setContent({ ".tooltip-inner": "No data to copy" });
            setTimeout(() => {
                tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
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
if(downloadButtons.length > 0) {
    Array.from(downloadButtons, c => c.addEventListener("click", function() {
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
            tooltip.setContent({ ".tooltip-inner": "No data to download" });
            setTimeout(() => {
                tooltip.setContent({ ".tooltip-inner": "Download" });
            }, 3430);
            c.classList.replace("btn-light", "btn-danger");
            return;
        }

        if(textarea.classList.contains("is-invalid")) {
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

const navToggle = document.querySelector("#navbar-toggler");
const navGrid = document.querySelector(".sidebar-grid");

if (navToggle && navGrid) {
    navToggle.addEventListener('click', () => {
        const isOpen = navGrid.classList.contains("open");
        navGrid.setAttribute('aria-expanded', isOpen ? "false" : "true");

        if (!isOpen) {
            navGrid.classList.add("open");
            setTimeout(() => {
                navGrid.querySelectorAll(".sidebar-item__label").forEach(label => {
                    label.classList.remove("visually-hidden");
                });
            }, 300);
        } else {
            // Close all open sidebar collapse sections
            const openCollapses = navGrid.querySelectorAll(".collapse.show");
            openCollapses.forEach(collapse => {
                const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            });

            navGrid.querySelectorAll(".sidebar-item__label").forEach(label => {
                label.classList.add("visually-hidden");
            });
            setTimeout(() => {
                navGrid.classList.remove("open");
            }, 100);
        }
    });
}

if (navGrid) {
    const sidebarLinks = document.querySelectorAll(".sidebar-item__link");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", function () {
            const collapseTarget = document.querySelector(link.getAttribute("data-href"));
            // Add the 'open' class immediately when the link is clicked
            if (!navGrid.classList.contains("open")) {
                navGrid.classList.add("open");
            }

            setTimeout(() => {
                navGrid.querySelectorAll(".sidebar-item__label").forEach(label => {
                    label.classList.remove("visually-hidden");
                });
            }, 300);

            if (collapseTarget) {
                collapseTarget.addEventListener("shown.bs.collapse", () => {
                    // Ensure the 'open' class is still present after the collapse is shown
                    if (!navGrid.classList.contains("open")) {
                        navGrid.classList.add("open");
                    }
                });
            }
        });
    });
}
