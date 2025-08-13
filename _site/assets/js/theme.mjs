/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
* Refactored to support complex theme objects in localStorage
*/
import { showToast } from "./scripts.mjs";

(() => {
    "use strict";

    const migrateLegacyOptions = () => {
        const legacyFlag = localStorage.getItem("legacy");
        const theme = localStorage.getItem("theme");
        if (!legacyFlag && !theme && localStorage.length > 0) {
            localStorage.clear();
            localStorage.setItem("legacy", JSON.stringify({"id": "legacy", "name": "Legacy flag", "value": "", "description": "A flag to assist in a migration from legacy theme settings."}));
            showToast("Legacy migration", "Legacy settings stored in local storage have been cleared, migrating to new functionality. Theme preferences and tool states will need to be reset.", "convrtr", 7500, false);
        } else {
            return;
        }
    };

    // Retrieve theme object from localStorage
    const getStoredTheme = () => {
        const raw = localStorage.getItem("theme");
        return raw ? JSON.parse(raw) : null;
    };

    // Store theme object in localStorage
    const setStoredTheme = themeObj => {
        localStorage.setItem("theme", JSON.stringify(themeObj));
    };

    // Get preferred theme value (from stored object or system preference)
    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme && storedTheme.value) {
            return storedTheme.value;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    // Apply theme to document
    const setTheme = theme => {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme',
                window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
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
            if (theme === 'auto') {
                cookieTheme.classList.remove("termsfeed-com---palette-dark", "termsfeed-com---palette-light");
                cookieTheme.classList.add(`termsfeed-com---palette-${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}`);
            } else {
                cookieTheme.classList.remove("termsfeed-com---palette-dark", "termsfeed-com---palette-light");
                cookieTheme.classList.add(`termsfeed-com---palette-${theme}`);
            }
        }
    };

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        const storedTheme = getStoredTheme();
        if (!storedTheme || (storedTheme.value !== "light" && storedTheme.value !== "dark")) {
            setTheme(getPreferredTheme());
        }
    });

    // Initialize on DOM ready
    window.addEventListener("DOMContentLoaded", () => {
        migrateLegacyOptions();

        const preferredTheme = getPreferredTheme();
        setTheme(preferredTheme);
        showActiveTheme(preferredTheme);

        document.querySelectorAll("[data-bs-theme-value]").forEach(toggle => {
            toggle.addEventListener("click", () => {
                const themeValue = toggle.getAttribute("data-bs-theme-value");
                const themeObj = {
                    id: "theme",
                    name: toggle.getAttribute("data-theme-name") || "Theme",
                    value: themeValue,
                    description: toggle.getAttribute("data-theme-description") || ""
                };

                setStoredTheme(themeObj);
                setTheme(themeValue);
                showActiveTheme(themeValue, true);
            });
        });
    });
})();
