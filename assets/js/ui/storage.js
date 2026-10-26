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
