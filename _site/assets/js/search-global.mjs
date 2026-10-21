import { hasUrlParameters, getURLParameter } from "./toolkit.mjs";
import "./search-summary.mjs";

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
    const advancedSearchLink = document.querySelector(".advanced-search");
    const searchInput = document.querySelector("pagefind-input");
    const pagefind = window.PagefindComponents?.getInstanceManager().getInstance();

    if (!searchInput || !pagefind) {
        return;
    }

    pagefind.setTranslations(translations);

    const updateAdvancedSearchLink = (term) => {
        if (!advancedSearchLink) {
            return;
        }

        const base = new URL(advancedSearchLink.href, window.location.origin);
        const basePath = base.pathname.endsWith("/") ? base.pathname : `${base.pathname}/`;
        const value = String(term).trim();

        advancedSearchLink.href = value.length >= 2
            ? `${basePath}?t=${encodeURIComponent(value)}`
            : basePath;
    };

    pagefind.on("search", updateAdvancedSearchLink);
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

        input.value = input.value.trim();
        if (input.value.length >= 2) {
            return;
        }

        event.stopPropagation();
        updateAdvancedSearchLink("");
        if (pagefind.searchTerm) {
            pagefind.triggerSearch("");
        }
    }, true);

    if (advancedSearchLink) {
        advancedSearchLink.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.assign(advancedSearchLink.href);
        });
    }

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