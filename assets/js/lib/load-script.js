const loading = new Map();

/**
 * Loads a classic (non-module) script once, e.g. a UMD library that sets a global.
 * Repeat calls for the same URL share the first load.
 *
 * @param {string|URL} src - The script URL.
 * @returns {Promise<void>} - Resolves once the script has loaded.
 */
export function loadScript(src) {
    const url = String(src);
    if (!loading.has(url)) {
        loading.set(url, new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => {
                loading.delete(url);
                reject(new Error(`Failed to load ${url}`));
            };
            document.head.append(script);
        }));
    }
    return loading.get(url);
}
