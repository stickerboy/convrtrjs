/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
* Refactored to support complex theme objects in localStorage
*/
import { getLocalStorageItem, saveLocalStorage } from "../ui/storage.js";

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

// Get preferred theme value (from stored object or system preference)
const getPreferredTheme = () => {
    const storedTheme = getLocalStorageItem("theme");
    if (storedTheme) {
        return storedTheme;
    }

    return systemDark() ? "dark" : "light";
};

// Apply theme to document
const setTheme = theme => {
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', systemDark() ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute("data-bs-theme", theme);
    }
};

// Show active theme in UI
const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");

    if (!themeSwitcher) return;

    const themeSwitcherText = document.querySelector("#bd-theme-text");
    const activeThemeIcon = document.querySelector("[data-current-icon]");
    const btnToActive = document.querySelectorAll(`[data-bs-theme-value="${theme}"]`);
    const svgOfActiveBtn = btnToActive[1]?.getAttribute("data-theme-icon");

    document.querySelectorAll("[data-bs-theme-value]").forEach(element => {
        element.classList.remove("active");
        element.setAttribute("aria-pressed", "false");
    });

    btnToActive.forEach(btn => {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", true);
    });

    if (activeThemeIcon && svgOfActiveBtn) {
        const icon = activeThemeIcon.querySelector("i");
        icon.classList.remove(activeThemeIcon.getAttribute("data-current-icon"));
        icon.classList.add(svgOfActiveBtn);
        activeThemeIcon.setAttribute("data-current-icon", svgOfActiveBtn);
    }

    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive[1]?.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

    if (focus) themeSwitcher.focus();

    const cookieTheme = document.querySelector("#termsfeed-com---nb");
    if (cookieTheme) {
        cookieTheme.classList.remove("termsfeed-com---palette-dark", "termsfeed-com---palette-light");
        cookieTheme.classList.add(`termsfeed-com---palette-${theme === "auto" ? (systemDark() ? "dark" : "light") : theme}`);
    }
};

/**
 * Switches the theme ("auto", "light" or "dark"): applies it, marks it in the navbar's theme menu and tells the page
 * (a "convrtr:themechange" event, which Settings listens for). Saved unless save is false, as after Reset all settings.
 * @param {string} theme
 * @param {{ save?: boolean, focus?: boolean }} [options] - focus moves focus to the navbar's theme menu
 */
export function applyTheme(theme, { save = true, focus = false } = {}) {
    if (save) {
        const toggle = document.querySelector(`[data-bs-theme-value="${theme}"]`);
        saveLocalStorage("theme", toggle?.getAttribute("data-theme-name") || "Theme", theme, toggle?.getAttribute("data-theme-description") || "");
    }
    setTheme(theme);
    showActiveTheme(theme, focus);
    document.dispatchEvent(new CustomEvent("convrtr:themechange", { detail: { theme } }));
}

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const storedTheme = getLocalStorageItem("theme");
    if (!storedTheme || (storedTheme !== "light" && storedTheme !== "dark")) {
        setTheme(getPreferredTheme());
    }
});

// Initialize on DOM ready
window.addEventListener("DOMContentLoaded", () => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    showActiveTheme(preferredTheme);

    document.querySelectorAll("[data-bs-theme-value]").forEach(toggle => {
        toggle.addEventListener("click", () => applyTheme(toggle.getAttribute("data-bs-theme-value"), { focus: true }));
    });
});
