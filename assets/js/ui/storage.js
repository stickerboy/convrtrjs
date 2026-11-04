/**
 * Saves a value and its metadata to localStorage under a specified key.
 *
 * @param {string} id - The unique key to use for storing the item in localStorage.
 * @param {string} name - A human-readable name for the stored item.
 * @param {string} value - The value to be stored.
 * @param {string} description - A description of the stored item.
 * @returns {void}
 */
export function saveLocalStorage(id, name, value, description) {
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
export function getLocalStorageItem(id) {
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
export function clearLocalStorage() {
    localStorage.clear();
}

/**
 * Whether a tool starts open on its category page. Tools are saved by their folder and id, such as "hex/frequencies",
 * and start open unless they've been saved as closed.
 * @param {string} key - The tool's folder and id.
 * @returns {boolean}
 */
export function isToolOpen(key) {
    return getLocalStorageItem(key) !== "false";
}

/**
 * Saves whether a tool starts open on its category page, as its section's collapse button and Settings both do.
 * @param {string} key - The tool's folder and id, such as "hex/frequencies".
 * @param {string} name - The tool's name, such as "Hex frequencies".
 * @param {boolean} open
 * @returns {void}
 */
export function saveToolOpen(key, name, open) {
    saveLocalStorage(key, name, String(open), `Whether ${name} starts open on its category page`);
}

/**
 * Removes the open states saved before tools were keyed by folder, which were keyed by id alone (so Hex and Text
 * frequencies shared one) and described as "Toggle visibility of ... section".
 * @returns {void}
 */
export function removeOldToolStates() {
    for (const key of Object.keys(localStorage)) {
        try {
            if (JSON.parse(localStorage.getItem(key))?.description?.startsWith("Toggle visibility of ")) {
                localStorage.removeItem(key);
            }
        } catch {
            // Not one of ours
        }
    }
}
