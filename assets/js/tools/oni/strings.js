import { bindTool } from '../../ui/tool.js';
import * as strings from '../../lib/oni/strings.js';

// Extract strings (the UI for this is currently disabled on the page; available as convrtr.strings)
bindTool({
    button: "stringsDecode",
    input: "stringsText",
    output: "stringsResults",
    run: strings.strings,
});
