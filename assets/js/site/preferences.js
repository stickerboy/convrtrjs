// Display settings from the Settings page, applied on every page. Those that only change how the page looks are
// attributes on <html> (styled in base/_preferences.scss), which the <head> script in layouts/base.njk sets before the
// page is drawn; this keeps them up to date when Settings changes them. The rest set up the page's tools.
import { getLocalStorageItem } from "../ui/storage.js";

// Switch settings saved as "on", and the attribute each sets
const SWITCH_ATTRIBUTES = {
    reduceMotion: "data-reduce-motion",
    compactLayout: "data-compact",
    monoBoxes: "data-mono-boxes",
};
const BOX_SIZES = ["small", "large"];

/**
 * Sets the display attributes on <html> from what's saved, as the <head> script does, for Settings to call after a
 * change, a reset or an undo.
 * @returns {void}
 */
export function applyDisplayPreferences() {
    const root = document.documentElement;
    for (const [key, attribute] of Object.entries(SWITCH_ATTRIBUTES)) {
        root.toggleAttribute(attribute, getLocalStorageItem(key) === "on");
    }
    const size = getLocalStorageItem("boxTextSize");
    if (BOX_SIZES.includes(size)) {
        root.setAttribute("data-box-size", size);
    } else {
        root.removeAttribute("data-box-size");
    }
}

// "More about this tool" starts open on every tool
if (getLocalStorageItem("aboutOpen") === "on") {
    for (const fold of document.querySelectorAll(".tool-about")) {
        fold.open = true;
    }
}

// Every hex delimiter dropdown starts on the chosen delimiter (except Settings' own). Tool scripts have already run by
// now, so a change event lets them update, as choosing it would.
const delimiter = getLocalStorageItem("hexDelimiter");
if (delimiter !== false) {
    for (const select of document.querySelectorAll("select.hex-delimiter:not(#settingDelimiter)")) {
        if ([...select.options].some((option) => option.value === delimiter) && select.value !== delimiter) {
            select.value = delimiter;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
}
