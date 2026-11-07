// The element data is large (~260KB), so it's only fetched when first needed
const loadElements = () => import("../../data/elements.json", { with: { type: "json" } }).then((module) => module.default);

// What each property is called in messages
const PROPERTY_NAMES = {
    symbol: "symbol",
    name: "name",
    number: "atomic number",
    atomic_mass: "atomic mass",
    melt: "melting point",
    boil: "boiling point",
};

// Properties that are measured, so can be typed rounded: 1.01 for hydrogen's atomic mass of 1.008
const MEASURED = new Set(["atomic_mass", "melt", "boil"]);

/**
 * Whether an element has a value for a property: some have no melting or boiling point in the data.
 *
 * @param {object} element - The element.
 * @param {string} prop - The property, e.g. "melt".
 * @returns {boolean} True if the element has a value for it.
 */
const hasValue = (element, prop) => element[prop] !== null && element[prop] !== undefined;

/**
 * Finds every element with a value for a property. A value is first matched as text, ignoring case, so "se" finds
 * selenium. If nothing matches and the property is measured (atomic mass, melting or boiling point), elements whose
 * value rounds to the number typed are found instead, to as many decimal places as it has, so "1.01" finds hydrogen
 * (1.008).
 *
 * @param {object[]} elements - Every element.
 * @param {string} prop - The property the value is, e.g. "atomic_mass".
 * @param {string} value - The value typed.
 * @returns {object[]} The elements matched, in atomic number order; none if there are no matches.
 */
function findElements(elements, prop, value) {
    const typed = value.toLowerCase();
    const exact = elements.filter((el) => hasValue(el, prop) && String(el[prop]).toLowerCase() === typed);
    if (exact.length > 0 || !MEASURED.has(prop) || !/^\d+(?:\.\d+)?$/.test(value)) {
        return exact;
    }
    const decimals = value.split(".")[1]?.length ?? 0;
    const rounded = Number(value).toFixed(decimals);
    return elements.filter((el) => hasValue(el, prop) && el[prop].toFixed(decimals) === rounded);
}

/**
 * Converts periodic elements from one property to another, such as atomic numbers to symbols. Values are matched on the
 * property converted from only (see findElements), so "se", "Se" and "SE" all find selenium, and "1.008" or "1.01"
 * hydrogen's atomic mass. Where several elements share a value, such as curium and berkelium's atomic mass of 247, all
 * of them are given, separated by /.
 *
 * @param {string} string - The values, separated by spaces, commas, colons, semicolons or hyphens.
 * @param {string} sourceProp - The property the values are, e.g. "number".
 * @param {string} targetProp - The property to convert them to, e.g. "symbol".
 * @param {boolean} [removeDelimiters=false] - Join the results with nothing, rather than the first separator used.
 * @returns {Promise<string>} - The converted values.
 * @throws {Error} - If a value doesn't match any element, or no element it matches has a value for the property.
 *
 * @example
 * // Input: "247", "atomic_mass", "name"
 * // Output: "Curium/Berkelium"
 */
export async function convertElements(string, sourceProp, targetProp, removeDelimiters = false) {
    const ELEMENTS = await loadElements();
    const values = string.trim().split(/[ ,:;-]+/).filter(Boolean);
    const results = values.map((value) => {
        const found = findElements(ELEMENTS, sourceProp, value);
        if (found.length === 0) {
            throw new Error(`No element has the ${PROPERTY_NAMES[sourceProp] ?? sourceProp} "${value}"`);
        }
        const withValue = found.filter((el) => hasValue(el, targetProp));
        if (withValue.length === 0) {
            const names = found.map((el) => el.name).join(" and ");
            throw new Error(`${names} ${found.length > 1 ? "have" : "has"} no ${PROPERTY_NAMES[targetProp] ?? targetProp} in the data`);
        }
        // Elements sharing a value can share the one converted to as well, which is given once
        return [...new Set(withValue.map((el) => el[targetProp]))].join("/");
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
