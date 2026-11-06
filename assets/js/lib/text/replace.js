/**
 * Replacing text, as plain text or with a regex pattern. Plain text is matched exactly as typed. Patterns use
 * JavaScript's regex with the g, m and u flags (as regex101's defaults, plus Unicode), and the replacement can use
 * $1, $<name>, $& and the rest as String.prototype.replace does. Either way, a result that would grow past
 * MAX_RESULT_LENGTH is stopped before it's built, so a pattern that matches empty text can't run the page out of memory.
 */

/** The longest result a replace can build, in UTF-16 code units: 10 times the tools' 1 million character input cap. */
export const MAX_RESULT_LENGTH = 10_000_000;

/**
 * Escapes every character that has a meaning in a regex, so the text matches only itself.
 *
 * @param {string} string - The text to escape.
 * @returns {string} The text, safe to use as a pattern.
 *
 * @example
 * // Input: "f(x)?"
 * // Output: "f\\(x\\)\\?"
 */
export function escapeRegExp(string) {
    // Only the characters with a meaning: with the u flag, a \ before any other character isn't allowed
    return string.replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&");
}

/**
 * The flags a pattern runs with: every match (g), ^ and $ at each line (m), whole Unicode characters (u), and ignoring
 * case (i) unless asked to match it.
 *
 * @param {boolean} caseSensitive - Whether capitals and lowercase letters must match exactly.
 * @returns {string} The flags.
 */
export function regexFlags(caseSensitive) {
    return caseSensitive ? "gmu" : "gimu";
}

// The browser's reasons a pattern isn't valid, in plain words. Firefox and Safari word theirs differently, so anything
// not listed here is shown as the browser gives it.
const PATTERN_PROBLEMS = [
    [/unterminated group|missing \)|unterminated parenthetical/i, "a ( isn't closed with a )"],
    [/unmatched '\)'|unmatched parentheses|unbalanced parenthes/i, "there's a ) without a ( before it"],
    [/unterminated character class|missing \]|unterminated character class/i, "a [ isn't closed with a ]"],
    [/nothing to repeat/i, "a *, +, ? or { has nothing before it to repeat. To match one of these itself, put a \\ before it"],
    [/lone quantifier brackets/i, "a { or } needs a \\ before it to match itself"],
    [/\\ at end of pattern|trailing backslash/i, "the pattern ends with a \\. To match a \\ itself, use \\\\"],
    [/invalid escape|invalid identity escape|invalid unicode escape/i, "a \\ is followed by a character it has no meaning with. Only characters with a meaning, such as ( or ., need a \\"],
    [/invalid group|invalid capture group name|duplicate capture group name/i, "a group's name isn't valid, or two groups have the same name"],
    [/invalid property name/i, "a \\p{…} names a character type that doesn't exist, such as \\p{L} for letters"],
    [/range out of order/i, "a range in [ ] goes backwards, such as [z-a]"],
];

/**
 * Builds a regex from a pattern, with the flags from regexFlags, explaining any problem with it in plain words.
 *
 * @param {string} pattern - The pattern, without slashes or flags.
 * @param {boolean} caseSensitive - Whether capitals and lowercase letters must match exactly.
 * @returns {RegExp} The regex.
 * @throws {Error} - If the pattern isn't valid.
 */
export function compilePattern(pattern, caseSensitive) {
    try {
        return new RegExp(pattern, regexFlags(caseSensitive));
    } catch (error) {
        // "Invalid regular expression: /(/gmu: Unterminated group" keeps only the reason
        const reason = error.message.split(": ").pop();
        const plain = PATTERN_PROBLEMS.find(([test]) => test.test(error.message))?.[1] ?? reason;
        throw new Error(`This pattern isn't valid: ${plain}`, { cause: error });
    }
}

/**
 * Splits a replacement into its plain text and its references to the match, following the rules of
 * String.prototype.replace: $$ is a $, $& the match, $` the text before it, $' the text after it, $1 to $99 a group,
 * and $<name> a named group. Anything else, such as $0 or $9 with fewer groups, stays as typed.
 *
 * @param {string} template - The replacement, as typed.
 * @param {number} groupCount - How many groups the pattern has.
 * @param {boolean} hasNamedGroups - Whether the pattern has any named groups; without them, $<name> stays as typed.
 * @returns {Array<string|{group: number}|{name: string}|{match: true}|{before: true}|{after: true}>} The parts, in order.
 */
export function parseReplacement(template, groupCount, hasNamedGroups) {
    const parts = [];
    let text = "";
    let i = 0;
    /**
     * Ends the plain text so far, and adds a reference after it.
     *
     * @param {object} part - The reference.
     * @param {number} length - How many characters of the template the reference took.
     * @returns {void}
     */
    const reference = (part, length) => {
        if (text) {
            parts.push(text);
            text = "";
        }
        parts.push(part);
        i += length;
    };
    while (i < template.length) {
        const next = template[i + 1];
        if (template[i] !== "$" || next === undefined) {
            text += template[i++];
        } else if (next === "$") {
            text += "$";
            i += 2;
        } else if (next === "&") {
            reference({ match: true }, 2);
        } else if (next === "`") {
            reference({ before: true }, 2);
        } else if (next === "'") {
            reference({ after: true }, 2);
        } else if (next >= "0" && next <= "9") {
            // Two digits if they name a group, otherwise one, otherwise it's plain text
            const two = Number(template.slice(i + 1, i + 3));
            const one = Number(next);
            if (/^\d\d$/.test(template.slice(i + 1, i + 3)) && two >= 1 && two <= groupCount) {
                reference({ group: two }, 3);
            } else if (one >= 1 && one <= groupCount) {
                reference({ group: one }, 2);
            } else {
                text += template[i++];
            }
        } else if (next === "<" && hasNamedGroups && template.indexOf(">", i + 2) > -1) {
            const end = template.indexOf(">", i + 2);
            reference({ name: template.slice(i + 2, end) }, end - i + 1);
        } else {
            text += template[i++];
        }
    }
    if (text) {
        parts.push(text);
    }
    return parts;
}

/**
 * The length one part of a replacement adds for a match, worked out without building it.
 *
 * @param {string|object} part - A part from parseReplacement.
 * @param {RegExpMatchArray} match - The match.
 * @param {string} string - The whole text being replaced in.
 * @returns {number} The part's length.
 */
function partLength(part, match, string) {
    if (typeof part === "string") {
        return part.length;
    }
    if (part.before) {
        return match.index;
    }
    if (part.after) {
        return string.length - match.index - match[0].length;
    }
    return partValue(part, match, string).length;
}

/**
 * The text one part of a replacement gives for a match. A group that didn't match gives nothing.
 *
 * @param {string|object} part - A part from parseReplacement.
 * @param {RegExpMatchArray} match - The match.
 * @param {string} string - The whole text being replaced in.
 * @returns {string} The part's text.
 */
function partValue(part, match, string) {
    if (typeof part === "string") {
        return part;
    }
    if (part.match) {
        return match[0];
    }
    if (part.before) {
        return string.slice(0, match.index);
    }
    if (part.after) {
        return string.slice(match.index + match[0].length);
    }
    return (part.name === undefined ? match[part.group] : match.groups?.[part.name]) ?? "";
}

/**
 * Replaces every match of a regex, stopping before the result grows past maxLength.
 *
 * @param {string} string - The text to replace in.
 * @param {RegExp} regex - What to replace, with the g flag.
 * @param {Array<string|object>} parts - The replacement, from parseReplacement.
 * @param {number} maxLength - The longest the result can be.
 * @param {string} notFound - The message for when nothing matches.
 * @returns {string} The text with every match replaced.
 * @throws {Error} - If nothing matches, or the result would be longer than maxLength.
 */
function replaceMatches(string, regex, parts, maxLength, notFound) {
    const pieces = [];
    let length = 0;
    let last = 0;
    let found = false;
    let emptyMatch = false;
    /**
     * Adds to the result's length, stopping if it's now too long.
     *
     * @param {number} added - The length to add.
     * @returns {void}
     * @throws {Error} - If the result is now longer than maxLength.
     */
    const grow = (added) => {
        length += added;
        if (length > maxLength) {
            const why = emptyMatch ? ". The pattern matches empty text, so it matches between every character: check for a * or ? that lets it match nothing, such as a*" : "";
            throw new Error(`The result would be over ${maxLength.toLocaleString("en-GB")} characters, so it was stopped${why}`);
        }
    };
    for (const match of string.matchAll(regex)) {
        found = true;
        emptyMatch ||= match[0] === "";
        grow(match.index - last);
        pieces.push(string.slice(last, match.index));
        for (const part of parts) {
            // Measured first, so a long $` or $' is never built only to be too long
            grow(partLength(part, match, string));
            pieces.push(partValue(part, match, string));
        }
        last = match.index + match[0].length;
    }
    if (!found) {
        throw new Error(notFound);
    }
    grow(string.length - last);
    pieces.push(string.slice(last));
    return pieces.join("");
}

/**
 * Replaces every place some text appears with other text, both exactly as typed: no character in either has a special
 * meaning.
 *
 * @param {string} string - The text to replace in.
 * @param {string} find - The text to replace.
 * @param {string} replacement - The text to put in its place.
 * @param {boolean} caseSensitive - Whether capitals and lowercase letters must match exactly.
 * @param {number} [maxLength=MAX_RESULT_LENGTH] - The longest the result can be.
 * @returns {string} The text with every match replaced.
 * @throws {Error} - If find is empty or isn't in the text, or the result would be longer than maxLength.
 *
 * @example
 * // Input: "Hi. Bye.", ".", "!", false
 * // Output: "Hi! Bye!"
 */
export function replaceText(string, find, replacement, caseSensitive, maxLength = MAX_RESULT_LENGTH) {
    if (find === "") {
        throw new Error("There's nothing to replace");
    }
    const regex = new RegExp(escapeRegExp(find), caseSensitive ? "gu" : "giu");
    return replaceMatches(string, regex, [replacement], maxLength, `"${find}" wasn't found in the text`);
}

/**
 * Replaces every match of a regex pattern. The replacement can use $1 for the first group, $<name> for a named group,
 * $& for the whole match and $$ for a $.
 *
 * @param {string} string - The text to replace in.
 * @param {string} pattern - The pattern, without slashes or flags. ^ and $ match at the start and end of each line.
 * @param {string} replacement - What to put in place of each match.
 * @param {boolean} caseSensitive - Whether capitals and lowercase letters must match exactly.
 * @param {number} [maxLength=MAX_RESULT_LENGTH] - The longest the result can be.
 * @returns {string} The text with every match replaced.
 * @throws {Error} - If the pattern is empty, isn't valid or matches nothing, or the result would be longer than maxLength.
 *
 * @example
 * // Input: "ann@example", "(\\w+)@(\\w+)", "$2: $1", false
 * // Output: "example: ann"
 */
export function replaceRegex(string, pattern, replacement, caseSensitive, maxLength = MAX_RESULT_LENGTH) {
    if (pattern === "") {
        throw new Error("There's no pattern to match");
    }
    const regex = compilePattern(pattern, caseSensitive);
    // Matching the pattern or nothing finds how many groups it has, and whether any are named
    const empty = new RegExp(`${pattern}|`, regex.flags.replace("g", "")).exec("");
    const parts = parseReplacement(replacement, empty.length - 1, empty.groups !== undefined);
    return replaceMatches(string, regex, parts, maxLength, `Nothing matched the pattern "${pattern}"`);
}

/**
 * A link that opens a pattern and its replacement in regex101, set to JavaScript's regex and the flags replaceRegex
 * uses. Only the pattern and replacement go in the link, never the text.
 *
 * @param {string} pattern - The pattern.
 * @param {string} replacement - The replacement.
 * @param {boolean} caseSensitive - Whether capitals and lowercase letters must match exactly.
 * @returns {string} The link.
 */
export function regex101Link(pattern, replacement, caseSensitive) {
    const query = new URLSearchParams({ regex: pattern, flags: regexFlags(caseSensitive), flavor: "javascript", subst: replacement });
    return `https://regex101.com/?${query}`;
}
