// Bootstrap components. Imported first by main.js, so other modules reuse these instances
// (getInstance / getOrCreateInstance) instead of creating duplicates.

// Enable tooltips
const tooltipTriggerList = document.querySelectorAll(`[data-bs-toggle="tooltip"]`);
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Enable dropdowns
const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

// Enable popovers
const popoverTriggerList = document.querySelectorAll(`[data-bs-toggle="popover"]`);
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
