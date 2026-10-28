import * as toolkit from '../../lib/toolkit.js';
import * as frequencies from '../../lib/text/frequencies.js';
import { bindTool } from '../../ui/tool.js';

// Stats to display
const stats = [
    { label: "Word count", stat: "word-count" },
    { label: "Character count", stat: "char-count" },
    { label: "Character count (no spaces)", stat: "char-count-ns" },
    { label: "Letter count", stat: "letter-count" },
    { label: "Letter count (only capitals)", stat: "letter-count-caps" },
    { label: "Letter count (only lowercase)", stat: "letter-count-low" },
    { label: "Number count", stat: "number-count" },
    { label: "Special character count", stat: "special-count" },
    { label: "Special character count (no spaces)", stat: "special-count-ns" }
];

bindTool({
    button: "frequenciesDecode",
    input: "frequenciesText",
    output: "frequenciesResults",
    clear: true,
    run: (text) => text,
    render: (text, output) => {
        output.innerHTML = stats.map(({ label, stat }) =>
            `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3">
                <span class="display-6 fs-5">${label}</span>&nbsp;<br />
                <code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2" role="note">
                    ${frequencies.stringStats(text, stat)}
                </code>&nbsp;<br />
            </div>`
        ).join("");
        output.insertAdjacentHTML("beforeend", toolkit.styledUniqueArrayItems(toolkit.uniqueArray(text)));
        output.insertAdjacentHTML("beforeend", toolkit.styledArrayFrequencies(toolkit.countArrayFreq(text), "Unique character frequencies"));
    },
});
