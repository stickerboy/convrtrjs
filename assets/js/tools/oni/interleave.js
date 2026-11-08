import { interleave } from '../../lib/oni/interleave.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

// The frame's two boxes, First and Second, then the delimiter: interleave's own arguments, in order
bindToolFrame({
    id: "interleave",
    modes: [{ button: "interleaveRun", run: interleave }],
    key: { id: "interleaveDelimiter", flow: ["with", "between"] },
    errorPrefix: "Couldn't interleave the strings",
});
