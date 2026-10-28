import { bindTool } from '../../ui/tool.js';
import { stringToHex } from '../../lib/toolkit.js';
import * as colors from '../../lib/misc/colors.js';

bindTool({
    button: "colorsDecode",
    input: "colorsText",
    output: "colorsResults",
    clear: true,
    run: (text) => colors.hexToChunks(stringToHex(text, ""), 6, document.getElementById("colorsPadding").value),
    render: (html, output) => (output.innerHTML = html),
});
