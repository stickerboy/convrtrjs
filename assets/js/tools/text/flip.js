import * as toolkit from '../../lib/toolkit.js';
import * as flip from '../../lib/text/flip.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

const direction = document.getElementById("flipDirection");

// flipText turns the text upside down, which also reverses it; by default it's put back in reading order
bindToolFrame({
    id: "flip",
    modes: [{ button: "flipRun", run: (text) => (direction.checked ? flip.flipText(text) : toolkit.reverseString(flip.flipText(text))) }],
    watch: ["flipDirection"],
    flow: () => [direction.checked ? "Flip and reverse" : "Flip"],
    errorPrefix: "Couldn't flip the text",
});
