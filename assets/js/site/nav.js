// The sidebar (macros/sidebar.njk). Categories on the rail show their pages in the panel, and some pages have panel
// content of their own, such as the search page's filters. The header toggle shows or hides the panel from md up, and
// opens the whole sidebar as a drawer below md.
import { saveLocalStorage } from "../ui/storage.js";

const grid = document.querySelector(".sidebar-grid");
const sidebar = document.querySelector(".nav-bar .sidebar");
const toggle = document.querySelector("#navbar-toggler");
const desktop = window.matchMedia("(min-width: 768px)");

if (grid && sidebar && toggle) {
    const categories = [...sidebar.querySelectorAll("[data-category]")];
    const groups = [...sidebar.querySelectorAll(".sidebar-panel__group")];
    const pageGroup = sidebar.querySelector("[data-page-panel]");
    const groupOf = (category) => document.getElementById(category.getAttribute("aria-controls"));
    const current = categories.find((category) => category.classList.contains("active"));
    const expanded = () => categories.find((category) => category.getAttribute("aria-expanded") === "true");
    let shown = groups.find((group) => !group.hidden) || groupOf(current || categories[0]);

    const isPanelOpen = () => sidebar.dataset.panel === "open";
    const isDrawerOpen = () => grid.classList.contains("drawer-open");

    const syncToggle = () => toggle.setAttribute("aria-expanded", desktop.matches ? isPanelOpen() : isDrawerOpen());

    // Only a choice made from md up is remembered; the drawer opens the panel for itself. Pages that close the panel
    // themselves, such as the sitemap, don't change what other pages show.
    const remember = () => {
        if (desktop.matches && sidebar.dataset.remember !== "false") {
            saveLocalStorage("sidebarPanel", "Sidebar panel", isPanelOpen() ? "open" : "closed", "Whether the list of tools beside the sidebar is shown");
        }
    };

    // Shows a group in the panel (a category's pages, or the page's own content), or closes the panel when given null.
    // A closing panel keeps its group while it slides away.
    const showPanel = (group) => {
        for (const category of categories) {
            category.setAttribute("aria-expanded", Boolean(group) && groupOf(category) === group);
        }
        if (group) {
            for (const other of groups) {
                other.hidden = other !== group;
            }
            shown = group;
        }
        sidebar.dataset.panel = group ? "open" : "closed";
        syncToggle();
    };

    const setDrawer = (open) => {
        grid.classList.toggle("drawer-open", open);
        if (open) {
            if (!isPanelOpen()) {
                showPanel(current ? groupOf(current) : shown);
            }
            (expanded() || shown.querySelector("a, button:not(:disabled), input") || categories[0]).focus();
        } else if (sidebar.contains(document.activeElement)) {
            toggle.focus();
        }
        syncToggle();
    };

    // Long lists, such as the changelog's releases, start scrolled to the current page if it's out of view
    const panel = sidebar.querySelector(".sidebar-panel");
    const currentLink = shown?.querySelector(".sidebar-panel__link[aria-current='page']");
    if (currentLink) {
        const top = currentLink.getBoundingClientRect().top - panel.getBoundingClientRect().top;
        if (top + currentLink.offsetHeight > panel.clientHeight) {
            panel.scrollTop = top - panel.clientHeight / 2;
        }
    }

    // The panel was left closed: <head> has already hidden it, so close it here before handing back to the normal styles
    if (document.documentElement.dataset.sidebarPanel === "closed") {
        showPanel(null);
        delete document.documentElement.dataset.sidebarPanel;
    }
    syncToggle();

    // Closing a category goes back to the page's own content, if it has some
    for (const category of categories) {
        category.addEventListener("click", () => {
            showPanel(category === expanded() ? pageGroup : groupOf(category));
            remember();
        });
    }

    // Buttons on the page that show its panel content, such as the search page's Filters button below md
    for (const button of document.querySelectorAll("[data-sidebar-page-panel]")) {
        button.addEventListener("click", () => {
            showPanel(pageGroup);
            if (!desktop.matches) {
                setDrawer(true);
            }
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
        if (isDrawerOpen() && !sidebar.contains(event.target) && !toggle.contains(event.target) && !event.target.closest("[data-sidebar-page-panel]")) {
            setDrawer(false);
        }
    });
    desktop.addEventListener("change", () => {
        grid.classList.remove("drawer-open");
        syncToggle();
    });
}
