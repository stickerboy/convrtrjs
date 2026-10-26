import { getLocalStorageItem, saveLocalStorage } from "../ui/storage.js";

function isTooltipVisible(instance) {
    const tip = instance?.tip;
    return tip && tip.classList.contains("show");
}

// Toggles are only shown (and active) on category landing pages
const sectionToggles = Array.from(document.querySelectorAll(".landing-page .section-toggle"));
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
