import { hasUrlParameters, getURLParameter } from "./toolkit.mjs";

window.addEventListener('DOMContentLoaded', () => {
    let convrtrSearch = new PagefindUI({ 
        element: "#page-search", 
        showSubResults: true, 
        showImages: false, 
        showEmptyFilters: false,
        resetStyles: false,
        pageSize: 10,
        excerptLength: 42,
        openFilters: ['Filters'],
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
            
            if (term.length < 2) {
                history.replaceState({}, "", window.location.pathname + window.location.hash);
                return "";
            }
            history.replaceState({}, "", `?t=${encodeURIComponent(term)}`);
            return term;
        },
    });
    
    if (hasUrlParameters()) {
        convrtrSearch.triggerSearch(getURLParameter("t"));
    }
});