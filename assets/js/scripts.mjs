import copyToClipboard from '../js/clip.mjs';
import * as tools from './tools.mjs';
import * as toolkit from './toolkit.mjs';

Object.entries(tools).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});
Object.entries(toolkit).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});

// Enable tooltips
const tooltipTriggerList = document.querySelectorAll(`[data-bs-toggle="tooltip"]`);
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Enable dropdowns
const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

// Enable popovers
const popoverTriggerList = document.querySelectorAll(`[data-bs-toggle="popover"]`);
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));


/**
 * Saves a value to local storage
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to be stored.
 * @returns {void}
 */
function saveLocalStorage(id, name, value, description) {
    const sectionObj = {
        id,
        name,
        value,
        description
    };
    localStorage.setItem(id, JSON.stringify(sectionObj));
}

/**
 * Retrieves an item from local storage
 * @param {string} string - The key of the item to retrieve.
 * @returns {any} - The parsed value retrieved from local storage.
 */
function getLocalStorageItem(id) {
    const raw = localStorage.getItem(id);
    if (!raw) { return false };

    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
            return parsed.value;
        }
        return false;
    } catch {
        return false;
    }
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
export function showToast(heading, content, color, delay = 5000, autohide = true) {
    let toastEL = document.getElementById("toast");
    const toast = bootstrap.Toast.getOrCreateInstance(toastEL, { delay: delay, autohide: autohide });

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
    if (container) {
        container.classList.remove("is-invalid", "ld-warning");
    }
    if (data.length > 200000 && data.length < 1000000) {
        showToast("Large data warning", "You are attempting to process a large amount of data, performance may degrade or halt/crash.", "warning");
    }
    if (data.length > 1000000) {
        showToast("Large data warning", "For performance reasons, operations above 1 million characters have been prevented.", "danger");

        if (container) {
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

    if (data.trim() === "") {
        container.classList.add("is-invalid");
        showToast("Warning", error ? error : "There is no content in the container you are trying to encode", "warning");
        return false;
    }

    if (container.classList.contains("is-invalid")) {
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

function isTooltipVisible(instance) {
    const tip = instance?.tip;
    return tip && tip.classList.contains("show");
}

const sectionToggles = Array.from(document.getElementsByClassName("section-toggle"))
    .filter(sectionToggle => !sectionToggle.classList.contains("d-none"));
if (sectionToggles.length > 0) {
    function restoreOptions() {
        if (localStorage.length !== 0) {
            for (const sectionToggle of sectionToggles) {
                const section = sectionToggle.closest(".section");
                if (!section) {
                    console.warn("No parent section found for: ", sectionToggle);
                    continue; // Skip this iteration if no parent section exists
                }

                const sectionID = section.id;
                const isExpanded = getLocalStorageItem(sectionID) === "true";

                sectionToggle.setAttribute("aria-expanded", isExpanded);

                const collapseID = sectionToggle.getAttribute("href");
                const collapseElement = document.querySelector(collapseID);
                const collapseToggle = sectionToggle.querySelector(".toggle-button");
                const tooltipInstance = bootstrap.Tooltip.getInstance(collapseToggle);

                if (collapseElement) {
                    if (isExpanded === true) {
                        collapseElement.classList.add("show");

                        if (tooltipInstance) {
                            collapseToggle.setAttribute("data-bs-original-title", "Collapse section");
                            tooltipInstance.setContent({ '.tooltip-inner': "Collapse section" });
                        }
                    } else {
                        collapseElement.classList.remove("show");

                        if (tooltipInstance) {
                            collapseToggle.setAttribute("data-bs-original-title", "Expand section");
                            tooltipInstance.setContent({ '.tooltip-inner': "Expand section" });
                        }
                    }
                } else {
                    console.warn("No collapse element found for ID: ", collapseID);
                }
            }
        }
    }

    document.addEventListener("DOMContentLoaded", restoreOptions);

    // Save toggle state
    Array.from(sectionToggles, c => c.addEventListener("click", function () {
        const section = c.closest(".section");
        const sectionID = section.id;
        const isExpanded = c.getAttribute("aria-expanded");
        const name = c.getAttribute("data-section-name").charAt(0).toUpperCase() + c.getAttribute("data-section-name").slice(1) || `${sectionID.charAt(0).toUpperCase() + sectionID.slice(1)}`;
        const description = c.getAttribute("data-section-description") || "Stores expanded/collapsed state of a section";

        const collapseToggle = c.querySelector(".toggle-button");
        const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(collapseToggle);
        if (isExpanded === "true") {
            if (tooltipInstance) {
                collapseToggle.setAttribute("data-bs-original-title", "Collapse section");
                tooltipInstance.setContent({ '.tooltip-inner': "Collapse section" });
            }
        } else {
            if (tooltipInstance) {
                collapseToggle.setAttribute("data-bs-original-title", "Expand section");
                tooltipInstance.setContent({ '.tooltip-inner': "Expand section" });
            }
        }

        saveLocalStorage(sectionID, name, isExpanded, description);
    }));
}

sectionToggles.forEach(c => {
    const collapseToggle = c.querySelector(".toggle-button");
    const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(collapseToggle);

    let suppressTooltip = false;

    // Suppress tooltip briefly on click
    c.addEventListener("click", () => {
        suppressTooltip = true;
        setTimeout(() => suppressTooltip = false, 1000); // adjust delay as needed
    });

    c.addEventListener("mouseenter", () => {
        if (!suppressTooltip && !isTooltipVisible(tooltipInstance)) {
            tooltipInstance.show();
        }
    });

    c.addEventListener("mouseleave", () => {
        tooltipInstance.hide();
    });

    c.addEventListener("focus", () => {
        if (!suppressTooltip && !isTooltipVisible(tooltipInstance)) {
            tooltipInstance.show();
        }
    });

    c.addEventListener("blur", () => {
        tooltipInstance.hide();
    });
});

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

const navToggle = document.querySelector("#navbar-toggler");
const navGrid = document.querySelector(".sidebar-grid");
const navGridtooltips = document.querySelectorAll(`.sidebar-grid [data-bs-toggle="tooltip"]`);
const navGridtooltipInstances = [...navGridtooltips].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

if (navToggle && navGrid) {
    navToggle.addEventListener("click", () => {
        const isOpen = navGrid.classList.contains("open");

        if (!isOpen) {
            navGrid.classList.add("open");

            navGridtooltipInstances.forEach(tooltip => {
                tooltip.disable(); // Enable tooltips
            });

            // Find the active page and its associated dropdown
            const activeItem = navGrid.querySelector(".sidebar-item.active");
            if (activeItem) {
                const dropdown = activeItem.querySelector(".collapse");
                if (dropdown) {
                    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(dropdown);
                    setTimeout(() => {
                        bsCollapse.show(); // Show the dropdown
                    }, 500);
                }
            }
            navGrid.querySelectorAll(".dropdown-toggle").forEach(dropdownToggle => {
                dropdownToggle.setAttribute("tabindex", 0);
            });
        } else {
            // Disable tooltips when sidebar is closed
            navGridtooltipInstances.forEach(tooltip => {
                tooltip.enable(); // Disable tooltips
            });

            // Close all open sidebar collapse sections
            const openCollapses = navGrid.querySelectorAll(".sidebar-dropdown .collapse.show");
            openCollapses.forEach(collapse => {
                const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            });
            navGrid.querySelectorAll(".dropdown-toggle").forEach(dropdownToggle => {
                dropdownToggle.setAttribute("tabindex", -1);
            });
            setTimeout(() => {
                navGrid.classList.remove("open");
            }, 500);
        }
    });
}