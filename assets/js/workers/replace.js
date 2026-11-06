// Runs regex replaces away from the page, so the page can stop one that takes too long (see tools/text/replace.js).
// Some patterns, such as (a+)+$, can take minutes on a few dozen characters, and would otherwise freeze the page.
import { replaceRegex } from "../lib/text/replace.js";

/**
 * Replaces with a pattern, and sends back the result or the error's message.
 *
 * @param {MessageEvent<{id: number, text: string, pattern: string, replacement: string, caseSensitive: boolean}>} event
 *   - The replace to run, with an id to send back with its result.
 * @returns {void}
 */
self.onmessage = ({ data: { id, text, pattern, replacement, caseSensitive } }) => {
    try {
        self.postMessage({ id, result: replaceRegex(text, pattern, replacement, caseSensitive) });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};
