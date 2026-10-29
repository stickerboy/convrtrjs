/**
 * Get the value of a specific URL parameter
 * @param {string} paramName - The name of the parameter to retrieve
 * @param {string} [url] - Optional: URL to parse (defaults to current page URL)
 * @returns {string|null} - The parameter value or null if not found
 */
export function getURLParameter(paramName, url) {
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
