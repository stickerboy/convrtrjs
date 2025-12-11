/**
 * Checks if the current URL contains query string parameters.
 * @returns {boolean} True if the URL has query parameters, false otherwise.
 * @throws {Error} Logs an error to console if the URL is invalid, but returns false instead of throwing.
 * @example
 * // Returns true if URL is 'https://example.com?key=value'
 * hasUrlParameters(); // true
 * 
 * // Returns false if URL is 'https://example.com'
 * hasUrlParameters(); // false
 */
function hasUrlParameters() {
    try {
        const url = new URL(window.location.href);
        return url.search.length > 1; // search includes '?' so length > 1 means parameters exist
    } catch (error) {
        console.error("Invalid URL:", error);
        return false;
    }
}

/**
 * Get the value of a specific URL parameter
 * @param {string} paramName - The name of the parameter to retrieve
 * @param {string} [url] - Optional: URL to parse (defaults to current page URL)
 * @returns {string|null} - The parameter value or null if not found
 */
function getURLParameter(paramName, url) {
    try {
        const targetURL = url || window.location.href;
        const parsedURL = new URL(targetURL);
        const value = parsedURL.searchParams.get(paramName);

        return value;
    } catch (error) {
        console.error("Invalid URL provided:", error);
        return null;
    }
}

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