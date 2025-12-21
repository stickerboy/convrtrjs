import { hasUrlParameters, getURLParameter } from "./toolkit.mjs";

window.addEventListener('DOMContentLoaded', () => {
    const advancedSearchLink = document.querySelector(".advanced-search");
    
    let convrtrSearch = new PagefindUI({ 
        element: "#page-search", 
        showSubResults: true, 
        showImages: false, 
        showEmptyFilters: false,
        resetStyles: false,
        pageSize: 10,
        excerptLength: 42,
        debounceTimeoutMs: 500,
        termFrequency: 0.4,
        termSimilarity: 10,
        termSaturation: 1.6,
        translations: {
            placeholder: "Search convrtrs, tools, and other resources...",
            clear_search: "Clear",
            load_more: "Show more results",
            search_label: "Search this site",
            filters_label: "Filters",
            zero_results: "There are no result for your search term: [SEARCH_TERM]",
            many_results: "There are [COUNT] results for your search term: [SEARCH_TERM]",
            one_result: "There is [COUNT] result for your search term: [SEARCH_TERM]",
            alt_search: "There are no result for your search term: [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead",
            search_suggestion: "There are No results for your search term: [SEARCH_TERM]. Try one of the following searches:",
            searching: "Searching for [SEARCH_TERM]..."
        },
        processTerm: function (term) {
            term = String(term).trim();

            // Prefer to read the actual input value (keeps in sync with Pagefind)
            const input = document.querySelector(".pagefind-ui__search-input");
            const value = String(input?.value || term).trim();
            
            if (advancedSearchLink) {
                const base = new URL(advancedSearchLink.getAttribute("href"), window.location.origin);
                const basePath = base.pathname.endsWith("/") ? base.pathname : base.pathname + "/";
                if (value.length >= 2) {
                    advancedSearchLink.href = `${basePath}?t=${encodeURIComponent(value)}`;
                } else {
                    advancedSearchLink.href = basePath;
                }
            }

            if (term.length < 2) {
                return "";
            }
            return term;
        }
    });

    // Build the advanced search link dynamically from the current search value
    if (advancedSearchLink) {
        advancedSearchLink.addEventListener("click", function (event) {
            event.preventDefault();
            const input = document.querySelector(".pagefind-ui__search-input");
            const term = String(input?.value || "").trim();
            const base = new URL(this.getAttribute("href"), window.location.origin);
            const basePath = base.pathname.endsWith("/") ? base.pathname : base.pathname + "/";
            const dest = term.length >= 2
                ? `${basePath}?t=${encodeURIComponent(term)}`
                : basePath;
            window.location.assign(dest);
        });
    }
    
    if (hasUrlParameters()) {
        convrtrSearch.triggerSearch(getURLParameter("t"));
    }
});