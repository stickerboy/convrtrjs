import { findStrings } from '../../lib/oni/strings.js';
import { bindToolFrame, withNote } from '../../ui/tool-frame.js';

const min = document.getElementById("stringsMin");

/**
 * The runs found, one per line in each tab: alone in Strings, and after where each starts in Positions, with a tab
 * between, so the runs line up in one column and paste into a spreadsheet as two.
 *
 * @param {string} text - The input.
 * @param {string} length - The minimum length, as typed.
 * @returns {NotedResult} The two tabs' text, with how many runs were found.
 */
function extract(text, length) {
    const runs = findStrings(text, length);
    const note = runs.length === 0 ? "No runs that long"
        : `Found ${runs.length.toLocaleString()} run${runs.length === 1 ? "" : "s"}`;
    return withNote({
        Strings: runs.map((run) => run.text).join("\n"),
        Positions: runs.map((run) => `${run.position}\t${run.text}`).join("\n"),
    }, note);
}

bindToolFrame({
    id: "strings",
    modes: [{ button: "stringsRun", run: extract }],
    key: {
        id: "stringsMin",
        required: "Give a minimum length, such as 4",
        pattern: /^\d+$/,
        invalid: "The minimum length is a whole number, such as 4",
    },
    flow: () => ["At least ", { value: min.value }, " characters"],
    // Move to input takes the runs alone, without their positions
    moveTab: "Strings",
    errorPrefix: "Couldn't extract the strings",
});
