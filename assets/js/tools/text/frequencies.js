import { bindToolFrame, resultRow } from '../../ui/tool-frame.js';
import { renderFrequencies, characterCell, characterName } from '../../ui/frequencies.js';
import * as frequencies from '../../lib/text/frequencies.js';

// Stats to display
const stats = [
    { label: "Words", stat: "word-count" },
    { label: "Characters", stat: "char-count" },
    { label: "Characters without spaces", stat: "char-count-ns" },
    { label: "Letters", stat: "letter-count" },
    { label: "Capital letters", stat: "letter-count-caps" },
    { label: "Lowercase letters", stat: "letter-count-low" },
    { label: "Numbers", stat: "number-count" },
    { label: "Special characters", stat: "special-count" },
    { label: "Special characters without spaces", stat: "special-count-ns" }
];

const columns = [
    { key: "char", label: "Char", mono: true, text: (row) => characterName(row.char) ?? row.char, html: (row) => characterCell(row.char) },
    { key: "first", label: "First seen", numeric: true, startDescending: false, text: (row) => row.first.toLocaleString() },
];

bindToolFrame({
    id: "frequencies",
    modes: [{
        button: "frequenciesRun",
        run: (text) => {
            const rows = frequencies.characterFrequencies(text);
            return {
                stats: stats.map(({ label, stat }) => ({ label, value: frequencies.stringStats(text, stat).toLocaleString() })),
                // Every character once, in the order each first appears, to copy as text
                extra: resultRow({ label: `${rows.length.toLocaleString()} unique`, value: rows.map((row) => row.char).join("") }),
                tables: [{ id: "characters", name: "Character frequencies", columns, rows }],
            };
        },
    }],
    render: (results, output) => renderFrequencies(output, results),
    errorPrefix: "Couldn't count the text",
});
