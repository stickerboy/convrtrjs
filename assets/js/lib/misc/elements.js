// The element data is large (~260KB), so it's only fetched when first needed
const loadElements = () => import("../../data/elements.json", { with: { type: "json" } }).then((module) => module.default);

/**
 * Converts periodic elements from one property to another, such as atomic numbers to symbols. Values are matched on the
 * property converted from only, as text and ignoring case, so "se", "Se" and "SE" all find selenium, and "1.008" its
 * atomic mass.
 * @param {string} string - The values, separated by spaces, commas, colons, semicolons or hyphens.
 * @param {string} sourceProp - The property the values are, e.g. "number".
 * @param {string} targetProp - The property to convert them to, e.g. "symbol".
 * @param {boolean} [removeDelimiters=false] - Join the results with nothing, rather than the first separator used.
 * @returns {Promise<string>} - The converted values.
 * @throws {Error} - If a value doesn't match any element, or the element has no value for the property.
 */
export async function convertElements(string, sourceProp, targetProp, removeDelimiters = false) {
    const ELEMENTS = await loadElements();
    const values = string.trim().split(/[ ,:;-]+/).filter(Boolean);
    const results = values.map((value) => {
        const element = ELEMENTS.find((el) => el[sourceProp] !== null && el[sourceProp] !== undefined
            && String(el[sourceProp]).toLowerCase() === value.toLowerCase());
        if (!element) {
            throw new Error(`Element with ${sourceProp} "${value}" not found`);
        }
        if (element[targetProp] === null || element[targetProp] === undefined) {
            throw new Error(`${element.name} has no ${targetProp}`);
        }
        return element[targetProp];
    });
    return results.join(removeDelimiters ? "" : (string.match(/[ ,:;-]+/)?.[0] ?? " "));
}

// Element categories, grouped as the periodic table colours them: [key, name, test]. Unconfirmed elements ("unknown,
// probably transition metal") join the group they're predicted to be in.
export const CATEGORIES = [
    ["alkali", "Alkali metals", (c) => c.includes("alkali metal")],
    ["alkaline", "Alkaline earth metals", (c) => c.includes("alkaline earth")],
    ["transition", "Transition metals", (c) => c.includes("transition metal") && !c.includes("post-transition")],
    ["post-transition", "Post-transition metals", (c) => c.includes("post-transition")],
    ["metalloid", "Metalloids", (c) => c.includes("metalloid")],
    ["nonmetal", "Nonmetals", (c) => c.includes("nonmetal")],
    ["noble", "Noble gases", (c) => c.includes("noble gas")],
    ["lanthanide", "Lanthanides", (c) => c === "lanthanide"],
    ["actinide", "Actinides", (c) => c === "actinide"],
];

/**
 * Which of the periodic table's colour groups (CATEGORIES) an element's category belongs to.
 * @param {string} category - The element's category, e.g. "diatomic nonmetal".
 * @returns {string} The group's key, e.g. "nonmetal", or "unknown".
 */
export function categoryKey(category) {
    return CATEGORIES.find(([, , test]) => test(category))?.[0] ?? "unknown";
}
