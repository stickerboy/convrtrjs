import { hasUrlParameters, getURLParameter } from "./toolkit.js";
import "./search-summary.js";

const translations = {
    placeholder: "Search convrtrs, tools, and other resources...",
    clear_search: "Clear",
    search_label: "Search this site",
    filters_label: "Filters",
    zero_results: "There are no results for your search term: [SEARCH_TERM]",
    many_results: "There are [COUNT] results for your search term: [SEARCH_TERM]",
    one_result: "There is [COUNT] result for your search term: [SEARCH_TERM]",
    searching: "Searching for [SEARCH_TERM]..."
};

window.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("pagefind-input");
    const pagefind = window.PagefindComponents?.getInstanceManager().getInstance();
    let updateUrlFromUserInput = false;

    if (!searchInput || !pagefind) {
        return;
    }

    pagefind.setTranslations(translations);
    pagefind.on("search", (term) => {
        if (!updateUrlFromUserInput) {
            return;
        }

        const value = String(term).trim();
        const url = value.length >= 2
            ? `?t=${encodeURIComponent(value)}`
            : window.location.pathname + window.location.hash;

        history.replaceState({}, "", url);
        updateUrlFromUserInput = false;
    });
    pagefind.on("search", (term) => {
        const value = String(term).trim();

        requestAnimationFrame(() => {
            const input = searchInput.inputEl || searchInput.querySelector("input");

            if (input instanceof HTMLInputElement) {
                input.value = value;
            }
        });
    });

    searchInput.addEventListener("input", (event) => {
        const input = event.target;

        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        updateUrlFromUserInput = true;
        input.value = input.value.trim();
        if (input.value.length >= 2) {
            return;
        }

        event.stopPropagation();
        if (pagefind.searchTerm) {
            pagefind.triggerSearch("");
        }
    }, true);

    searchInput.addEventListener("click", (event) => {
        if (event.target instanceof HTMLButtonElement) {
            updateUrlFromUserInput = true;
        }
    }, true);

    const initialTerm = hasUrlParameters() ? getURLParameter("t") : "";
    if (typeof initialTerm === "string" && initialTerm.trim().length >= 2) {
        customElements.whenDefined("pagefind-input").then(() => {
            requestAnimationFrame(() => {
                const term = initialTerm.trim();
                const input = searchInput.inputEl || searchInput.querySelector("input");

                if (input instanceof HTMLInputElement) {
                    input.value = term;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                } else {
                    pagefind.triggerSearch(term);
                }
            });
        });
    }
});