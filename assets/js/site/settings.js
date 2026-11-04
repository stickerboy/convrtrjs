// The Settings page (settings.njk). Each setting saves as soon as it changes, with the same key and value as the control
// elsewhere on the site that sets it, so they always agree. Your data lists what's saved, and Reset all settings clears
// it, with an Undo.
import { getLocalStorageItem, isToolOpen, saveLocalStorage, saveToolOpen } from "../ui/storage.js";
import { applyTheme } from "./theme.js";

const page = document.querySelector("[data-settings]");

if (page) {
    const status = document.getElementById("settingsStatus");
    const sidebar = document.querySelector(".nav-bar .sidebar");
    const desktop = window.matchMedia("(min-width: 768px)");

    // "Saved" beside what changed for a moment, and said once to screen readers
    const saved = (id, what) => {
        const note = page.querySelector(`[data-saved="${id}"]`);
        if (note) {
            note.classList.add("is-shown");
            clearTimeout(note.hideTimer);
            note.hideTimer = setTimeout(() => note.classList.remove("is-shown"), 1500);
        }
        status.textContent = `${what} saved`;
        renderData();
    };

    // ---------- Appearance ----------
    const theme = document.getElementById("settingTheme");
    const showTheme = (value) => {
        for (const button of theme.querySelectorAll("button")) {
            button.setAttribute("aria-pressed", String(button.dataset.value === value));
        }
    };
    theme.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (button) {
            applyTheme(button.dataset.value);
            saved("settingTheme", "Theme");
        }
    });
    // The navbar's theme menu changes it too
    document.addEventListener("convrtr:themechange", (event) => {
        showTheme(event.detail.theme);
        renderData();
    });

    const panel = document.getElementById("settingPanel");
    panel.addEventListener("change", () => {
        document.dispatchEvent(new CustomEvent("convrtr:sidebarpanel", { detail: { open: panel.checked } }));
        saved("settingPanel", "Tool list setting");
    });
    // The toggle at the top left changes it too, from md up
    if (sidebar) {
        new MutationObserver(() => {
            if (desktop.matches) {
                panel.checked = sidebar.dataset.panel !== "closed";
                renderData();
            }
        }).observe(sidebar, { attributes: true, attributeFilter: ["data-panel"] });
    }

    // ---------- Tools ----------
    // The same keys, names and values as the switches on the tools (ui/tool-frame.js, tools/text/convrtrs.js)
    const LIVE = [
        { id: "settingLive", key: "toolsLive", name: "Live typing", description: "Whether tools convert as you type" },
        { id: "settingConvrtrsLive", key: "convrtrsLive", name: "Convrtrs live typing", description: "Whether Convrtrs converts as you type" },
    ];
    for (const live of LIVE) {
        const input = document.getElementById(live.id);
        input.addEventListener("change", () => {
            saveLocalStorage(live.key, live.name, input.checked ? "on" : "off", live.description);
            saved(live.id, live.name);
        });
    }

    // ---------- Category pages ----------
    const categories = [...page.querySelectorAll("[data-settings-category]")];
    const toolSwitches = (category) => [...category.querySelectorAll("[data-tool-key]")];
    const countCategory = (category) => {
        const switches = toolSwitches(category);
        const open = switches.filter((input) => input.checked).length;
        category.querySelector("[data-category-count]").textContent =
            open === switches.length ? "All open" : open === 0 ? "All collapsed" : `${open} of ${switches.length} open`;
    };
    const saveTool = (input) => saveToolOpen(input.dataset.toolKey, input.dataset.toolName, input.checked);
    for (const category of categories) {
        const name = category.dataset.categoryName;
        category.addEventListener("change", (event) => {
            const input = event.target.closest("[data-tool-key]");
            if (input) {
                saveTool(input);
                countCategory(category);
                saved(`category-${category.dataset.settingsCategory}`, input.dataset.toolName);
            }
        });
        for (const [selector, open] of [["[data-open-all]", true], ["[data-close-all]", false]]) {
            category.querySelector(selector).addEventListener("click", () => {
                for (const input of toolSwitches(category)) {
                    input.checked = open;
                    saveTool(input);
                }
                countCategory(category);
                saved(`category-${category.dataset.settingsCategory}`, `${name}: ${open ? "all open" : "all collapsed"}`);
            });
        }
    }

    // ---------- Your data ----------
    const data = document.getElementById("settingsData");
    const toolNames = new Map([...page.querySelectorAll("[data-tool-key]")].map((input) => [input.dataset.toolKey, input.dataset.toolName]));
    const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);
    const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    // Saved values in plain words; anything else saved is listed by its own name
    const LABELS = {
        theme: ["Theme", capitalise],
        sidebarPanel: ["Tool list beside the sidebar", (value) => (value === "closed" ? "Hidden" : "Shown")],
        toolsLive: ["Live typing", capitalise],
        convrtrsLive: ["Live typing in Convrtrs", capitalise],
    };

    function renderData() {
        const rows = [];
        const collapsed = [];
        // Known settings first, in the order the page shows them, then anything else by key
        const order = Object.keys(LABELS);
        const keys = Object.keys(localStorage).sort((a, b) => ((order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99)) || a.localeCompare(b));
        for (const key of keys) {
            if (toolNames.has(key)) {
                if (!isToolOpen(key)) {
                    collapsed.push(toolNames.get(key));
                }
                continue;
            }
            const value = getLocalStorageItem(key);
            if (LABELS[key]) {
                rows.push([LABELS[key][0], LABELS[key][1](String(value))]);
            } else {
                let name = key;
                try {
                    name = JSON.parse(localStorage.getItem(key))?.name || key;
                } catch {
                    // Saved by something else, as plain text
                }
                rows.push([name, value === false ? localStorage.getItem(key) : value]);
            }
        }
        if (collapsed.length) {
            rows.push(["Tools that start collapsed", collapsed.length <= 4 ? collapsed.join(", ") : `${collapsed.length} tools`]);
        }
        data.innerHTML = rows.length
            ? `<dl class="settings-data__list">${rows.map(([name, value]) => `<div><dt>${escapeHtml(name)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`
            : `<p class="settings-data__empty">Nothing saved yet. Everything is as it starts.</p>`;
        reset.disabled = rows.length === 0;
    }

    // Reset, with an Undo in place of a confirm dialog. Undo puts back exactly what was saved.
    const reset = document.getElementById("settingsReset");
    const undo = document.getElementById("settingsUndo");
    let before = null;
    const applySaved = () => {
        applyTheme(getLocalStorageItem("theme") || "auto", { save: false });
        document.dispatchEvent(new CustomEvent("convrtr:sidebarpanel", { detail: { open: getLocalStorageItem("sidebarPanel") !== "closed", save: false } }));
        showAll();
    };
    reset.addEventListener("click", () => {
        before = Object.entries(localStorage);
        localStorage.clear();
        applySaved();
        undo.hidden = false;
        document.getElementById("settingsUndoButton").focus();
        status.textContent = "All settings reset";
    });
    document.getElementById("settingsUndoButton").addEventListener("click", () => {
        for (const [key, value] of before ?? []) {
            localStorage.setItem(key, value);
        }
        before = null;
        applySaved();
        undo.hidden = true;
        reset.focus();
        status.textContent = "Settings restored";
    });

    // ---------- Show what's saved ----------
    function showAll() {
        showTheme(getLocalStorageItem("theme") || "auto");
        panel.checked = getLocalStorageItem("sidebarPanel") !== "closed";
        for (const live of LIVE) {
            document.getElementById(live.id).checked = getLocalStorageItem(live.key) === "on";
        }
        for (const category of categories) {
            for (const input of toolSwitches(category)) {
                input.checked = isToolOpen(input.dataset.toolKey);
            }
            countCategory(category);
        }
        renderData();
    }
    showAll();

    // ---------- Group links ----------
    // The panel and the chips mark the group being read, as you scroll or when you pick one
    const links = [...document.querySelectorAll("[data-settings-link]")];
    const mark = (id) => {
        for (const link of links) {
            if (link.dataset.settingsLink === id) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        }
    };
    const groups = [...page.querySelectorAll(".settings-group")];
    const scroller = document.getElementById("content");
    const onScroll = () => {
        // The last group whose top has passed a third of the way down, or the first
        const line = scroller.getBoundingClientRect().top + scroller.clientHeight / 3;
        const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
        const current = atEnd ? groups.at(-1) : groups.filter((group) => group.getBoundingClientRect().top <= line).at(-1) || groups[0];
        mark(current.id);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}
