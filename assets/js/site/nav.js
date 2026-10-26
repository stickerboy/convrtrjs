const navToggle = document.querySelector("#navbar-toggler");
const navGrid = document.querySelector(".sidebar-grid");
const navGridtooltips = document.querySelectorAll(`.sidebar-grid [data-bs-toggle="tooltip"]`);
const navGridtooltipInstances = [...navGridtooltips].map(tooltipTriggerEl => bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl));

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
