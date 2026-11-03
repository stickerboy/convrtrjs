import { bindToolFrame } from '../../ui/tool-frame.js';
import * as elements from '../../lib/misc/elements.js';

const from = document.getElementById("elementPropFrom");
const to = document.getElementById("elementPropTo");
const removeDelimiters = document.getElementById("removeDelimiters");
const label = (select) => select.selectedOptions[0].textContent.replace(/^Element /, "").toLowerCase();

bindToolFrame({
    id: "elements",
    modes: [{
        button: "elementsRun",
        run: (text) => elements.convertElements(text, from.value, to.value, removeDelimiters.checked),
    }],
    watch: ["elementPropFrom", "elementPropTo", "removeDelimiters"],
    flow: () => ["Convert ", { value: label(from) }, " to ", { value: label(to) }],
    errorPrefix: "Couldn't convert the elements",
});

// Turns the conversion round; the change runs the tool again, as choosing either would
document.getElementById("elementPropSwap").addEventListener("click", () => {
    [from.value, to.value] = [to.value, from.value];
    from.dispatchEvent(new Event("change"));
});
