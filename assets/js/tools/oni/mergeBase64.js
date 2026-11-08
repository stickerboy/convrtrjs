import { compareBase64 } from '../../lib/oni/mergeBase64.js';
import { bindToolFrame, withNote } from '../../ui/tool-frame.js';

let merging = 0;

/**
 * Merges the strings in the boxes, skipping empty ones, and says how many positions they disagreed at. Spaces and new
 * lines around a string are taken off, as they come with pasting.
 *
 * @param {...string} texts - Each box's text.
 * @returns {NotedResult} The merged string, with how many positions had more than one character.
 */
function merge(...texts) {
    const strings = texts.map((text) => text.trim()).filter(Boolean);
    const { merged, disagreements } = compareBase64(...strings);
    merging = strings.length;
    return withNote(merged, disagreements === 0 ? "They all agreed"
        : `They disagreed at ${disagreements.toLocaleString()} position${disagreements === 1 ? "" : "s"}`);
}

bindToolFrame({
    id: "mergeBase64",
    modes: [{ button: "mergeBase64Run", run: merge }],
    flow: () => ["Merged ", { value: String(merging) }, " strings"],
    errorPrefix: "Couldn't merge the strings",
});
