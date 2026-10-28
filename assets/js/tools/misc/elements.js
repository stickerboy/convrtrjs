import { bindTool } from '../../ui/tool.js';
import * as elements from '../../lib/misc/elements.js';

bindTool({
    button: "elementsChange",
    input: "elementsTextarea",
    output: "elementResults",
    errorPrefix: "An error occurred trying to map elements",
    run: (text) => elements.convertElements(
        text,
        document.getElementById("elementPropFrom").value,
        document.getElementById("elementPropTo").value,
        document.getElementById("removeDelimiters").checked
    ),
});
