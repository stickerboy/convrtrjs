// The sidebar (macros/sidebar.njk). Categories on the rail show their pages in the panel; the header toggle shows or
// hides the panel from md up, and opens the whole sidebar as a drawer below md.
import { saveLocalStorage } from "../ui/storage.js";

const grid = document.querySelector(".sidebar-grid");
const sidebar = document.querySelector(".nav-bar .sidebar");
const toggle = document.querySelector("#navbar-toggler");
const desktop = window.matchMedia("(min-width: 768px)");

if (grid && sidebar && toggle) {
    const categories = [...sidebar.querySelectorAll("[data-category]")];
    const current = categories.find((category) => category.classList.contains("active"));
    const expanded = () => categories.find((category) => category.getAttribute("aria-expanded") === "true");
    let shown = expanded() || current || categories[0];

    const isPanelOpen = () => sidebar.dataset.panel === "open";
    const isDrawerOpen = () => grid.classList.contains("drawer-open");

    const syncToggle = () => toggle.setAttribute("aria-expanded", desktop.matches ? isPanelOpen() : isDrawerOpen());

    // Only a choice made from md up is remembered; the drawer opens the panel for itself
    const remember = () => {
        if (desktop.matches) {
            saveLocalStorage("sidebarPanel", "Sidebar panel", isPanelOpen() ? "open" : "closed", "Whether the list of tools beside the sidebar is shown");
        }
    };

    // Shows a category's pages in the panel, or closes the panel. A closing panel keeps its pages while it slides away.
    const showPanel = (category) => {
        for (const button of categories) {
            button.setAttribute("aria-expanded", button === category);
            if (category) {
                document.getElementById(button.getAttribute("aria-controls")).hidden = button !== category;
            }
        }
        if (category) {
            shown = category;
        }
        sidebar.dataset.panel = category ? "open" : "closed";
        syncToggle();
    };

    const setDrawer = (open) => {
        grid.classList.toggle("drawer-open", open);
        if (open) {
            if (!isPanelOpen()) {
                showPanel(current || shown);
            }
            (expanded() || categories[0]).focus();
        } else if (sidebar.contains(document.activeElement)) {
            toggle.focus();
        }
        syncToggle();
    };

    // The panel was left closed: <head> has already hidden it, so close it here before handing back to the normal styles
    if (document.documentElement.dataset.sidebarPanel === "closed") {
        showPanel(null);
        delete document.documentElement.dataset.sidebarPanel;
    }
    syncToggle();

    for (const category of categories) {
        category.addEventListener("click", () => {
            showPanel(category === expanded() ? null : category);
            remember();
        });
    }

    toggle.addEventListener("click", () => {
        if (desktop.matches) {
            showPanel(isPanelOpen() ? null : shown);
            remember();
        } else {
            setDrawer(!isDrawerOpen());
        }
    });

    // The drawer closes with Escape, a click outside it, or when the window widens past it
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isDrawerOpen()) {
            setDrawer(false);
        }
    });
    document.addEventListener("click", (event) => {
        if (isDrawerOpen() && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
            setDrawer(false);
        }
    });
    desktop.addEventListener("change", () => {
        grid.classList.remove("drawer-open");
        syncToggle();
    });
}
