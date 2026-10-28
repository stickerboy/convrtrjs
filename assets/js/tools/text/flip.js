import * as toolkit from '../../lib/toolkit.js';
import * as flip from '../../lib/text/flip.js';
import { bindTool } from '../../ui/tool.js';

bindTool({
    button: "flipDecode",
    input: "flipText",
    output: "flipResults",
    clear: true,
    run: (text) => document.getElementById("flipDirection").checked ? flip.flipText(text) : toolkit.reverseString(flip.flipText(text)),
});
