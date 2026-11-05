import * as toolkit from "../../lib/toolkit.js";
import { bindToolFrame } from "../../ui/tool-frame.js";
import { renderFrequencies, characterCell, characterName } from "../../ui/frequencies.js";
import * as frequencies from "../../lib/hex/frequencies.js";

const delimiter = document.getElementById("frequenciesDelimiter");

// Single bytes, then runs of the same byte repeated
const tables = [
    { id: "bytes", name: "Bytes", runLength: 1 },
    { id: "runs2", name: "Runs of 2", runLength: 2 },
    { id: "runs3", name: "Runs of 3", runLength: 3 },
    { id: "runs4", name: "Runs of 4", runLength: 4 },
    { id: "runs5", name: "Runs of 5", runLength: 5 },
];

// The byte as text, as hex editors show it, with names for bytes that can't be seen
const charOf = (row) => String.fromCharCode(row.code);
const columns = [
    { key: "value", label: "Value", mono: true, text: (row) => row.value },
    { key: "code", label: "Char", mono: true, text: (row) => characterName(charOf(row)) ?? charOf(row), html: (row) => characterCell(charOf(row)) },
];

bindToolFrame({
    id: "frequencies",
    modes: [{
        button: "frequenciesRun",
        // The hex is read once, into runs of the same byte, and every table and figure is worked out from those
        run: (text) => {
            const bytes = toolkit.hexToPairs(text);
            if (bytes.length === 0) {
                throw new Error("there's no hex to count");
            }
            const runs = frequencies.hexRuns(bytes);
            const counted = tables.map(({ id, name, runLength }) => ({
                id, name, columns,
                rows: Object.entries(frequencies.countHexRuns(runs, delimiter.value, runLength)).map(([value, count]) => ({
                    value, count, code: parseInt(value.match(/[0-9a-f]{2}/i)[0], 16),
                })),
            }));
            const [mostCommon] = [...counted[0].rows].sort((a, b) => b.count - a.count);
            const longest = frequencies.longestHexRun(runs);
            return {
                stats: [
                    { label: "Bytes", value: bytes.length.toLocaleString() },
                    { label: "Unique bytes", value: counted[0].rows.length.toLocaleString() },
                    { label: "Most common", value: `${mostCommon.value} × ${mostCommon.count.toLocaleString()}` },
                    { label: "Longest run", value: longest.length > 1 ? `${longest.byte} × ${longest.length.toLocaleString()}` : "None" },
                ],
                tables: counted,
            };
        },
    }],
    watch: ["frequenciesDelimiter"],
    render: (results, output) => renderFrequencies(output, results),
    errorPrefix: "Couldn't count the hex",
});
