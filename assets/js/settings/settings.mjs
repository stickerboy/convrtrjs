import { getLocalStorageItem, saveLocalStorage } from "../scripts.mjs";

const sectionToggles = Array.from(document.getElementsByClassName("settings-check"));

if (sectionToggles.length > 0) {
    function restoreOptions() {
        if (localStorage.length !== 0) {
            for (const sectionToggle of sectionToggles) {
                const section = sectionToggle.closest(".settings-button");
                if (!section) {
                    console.warn("No parent section found for: ", sectionToggle);
                    continue; // Skip this iteration if no parent section exists
                }

                const sectionID = section.id;
                const isExpanded = getLocalStorageItem(sectionID) === "true";

                sectionToggle.checked = isExpanded;
            }
        }
    }
    document.addEventListener("DOMContentLoaded", restoreOptions);

    // Save state
    Array.from(sectionToggles, c => c.addEventListener("click", function () {
        const section = c.closest(".settings-button");
        const sectionID = section.id;
        const isExpanded = c.checked ? "true" : "false";
        const name = c.getAttribute("data-section-name").charAt(0).toUpperCase() + c.getAttribute("data-section-name").slice(1) || `${sectionID.charAt(0).toUpperCase() + sectionID.slice(1)}`;
        const description = c.getAttribute("data-section-description") || "Stores expanded/collapsed state of a section";

        saveLocalStorage(sectionID, name, isExpanded, description);
    }));
}