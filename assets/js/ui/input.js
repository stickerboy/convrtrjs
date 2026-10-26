import { showToast } from "./toast.js";

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
    // Remove invalid class from any visible data containers
    let allElements = Array.from(document.querySelectorAll(".data-to-copy"));
    allElements.forEach(el => el.classList.remove("is-invalid"));

    // Resolve container if a selector string was passed
    let el = null;
    if (typeof container === "string") {
        el = document.querySelector(container);
    } else if (container instanceof HTMLElement) {
        el = container;
    }

    // Consider empty if falsy or a trimmed-empty string
    const isEmpty = !data || (typeof data === "string" && data.trim() === "");

    if (isEmpty) {
        if (el && el.classList) {
            el.classList.add("is-invalid");
        }
        showToast("Warning", error ? error : "There is no content in the container you are trying to encode", "warning");
        return false;
    }

    if (el && el.classList && el.classList.contains("is-invalid")) {
        el.classList.remove("is-invalid");
    }
    return true;
}
