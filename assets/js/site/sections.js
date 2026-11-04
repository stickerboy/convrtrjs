import { isToolOpen, removeOldToolStates, saveToolOpen } from "../ui/storage.js";

removeOldToolStates();

function isTooltipVisible(instance) {
    const tip = instance?.tip;
    return tip && tip.classList.contains("show");
}

// Toggles are only shown (and active) on category landing pages
const sectionToggles = Array.from(document.querySelectorAll(".landing-page .section-toggle"));
if (sectionToggles.length > 0) {
    // Tools start open unless they were saved as closed, here or in Settings
    function restoreOptions() {
        for (const sectionToggle of sectionToggles) {
            const section = sectionToggle.closest(".section");
            if (!section) {
                console.warn("No parent section found for: ", sectionToggle);
                continue; // Skip this iteration if no parent section exists
            }

            const isExpanded = isToolOpen(section.dataset.sectionKey);

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

    document.addEventListener("DOMContentLoaded", restoreOptions);

    // Save toggle state
    Array.from(sectionToggles, c => c.addEventListener("click", function () {
        const section = c.closest(".section");
        const isExpanded = c.getAttribute("aria-expanded");

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

        saveToolOpen(section.dataset.sectionKey, c.dataset.sectionName, isExpanded === "true");
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
