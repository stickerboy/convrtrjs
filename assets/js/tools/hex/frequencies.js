import * as toolkit from "../../lib/toolkit.js";
import { bindTool } from "../../ui/tool.js";
import * as frequencies from "../../lib/hex/frequencies.js";

const delimiter = () => document.getElementById("frequenciesDelimiter").value;

const hexFrequencies = [
    { delimiterLength: 2, label: "Hex frequencies", minSize: 6 },
    { delimiterLength: 4, label: "Hex frequencies [double]", minSize: 8 },
    { delimiterLength: 6, label: "Hex frequencies [triple]", minSize: 9 },
    { delimiterLength: 7, label: "Hex frequencies [quad]", minSize: 10 },
    { delimiterLength: 10, label: "Hex frequencies [quint]", minSize: 12 }
];

function renderStat(label, value) {
    return `<div class="g-col-12 g-col-md-6 g-col-lg-4 g-col-xxl-3">
                <span class="display-6 fs-5">${label}</span>&nbsp;<br />
                <code tabindex="0" class="d-inline-flex px-2 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                    ${value}
                </code>&nbsp;<br />
            </div>`;
}

bindTool({
    button: "frequenciesDecode",
    input: "frequenciesText",
    output: "frequenciesResults",
    clear: true,
    errorPrefix: "An error occurred trying to generate frequencies",
    run: (text) => ({
        characterCount: text.replaceAll(delimiter(), "").length,
        tables: hexFrequencies.map(({ delimiterLength, label, minSize }) =>
            ({ label, minSize, freqs: frequencies.generateHexFrequencies(text, delimiter(), delimiterLength) })),
    }),
    render: ({ characterCount, tables }, output) => {
        output.innerHTML = renderStat("Character count", characterCount);
        for (const { label, minSize, freqs } of tables) {
            if (toolkit.objectSize(freqs) > 0) {
                output.insertAdjacentHTML("beforeend", toolkit.styledArrayFrequencies(freqs, label, minSize));
            }
        }
    },
});
