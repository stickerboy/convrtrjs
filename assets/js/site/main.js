// Site-wide behaviour, loaded on every page.
// Order matters: components.js creates the Bootstrap instances the other modules reuse.
import "./components.js";
import "./theme.js";
import "./sections.js";
import "./controls.js";
import "./nav.js";
import * as tools from "../lib/strings.js";
import * as toolkit from "../lib/toolkit.js";

// Expose helpers for use in the browser console (to be replaced by window.convrtr)
Object.entries(tools).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});
Object.entries(toolkit).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});
