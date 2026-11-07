import * as flip from '../../lib/text/flip.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

const direction = document.getElementById("flipDirection");

// By default each character is turned over in reading order; Reverse also reverses it, as if the page were turned round
bindToolFrame({
    id: "flip",
    modes: [{ button: "flipRun", run: (text) => (direction.checked ? flip.flipText(text) : flip.flipCharacters(text)) }],
    watch: ["flipDirection"],
    flow: () => [direction.checked ? "Flip and reverse" : "Flip"],
    errorPrefix: "Couldn't flip the text",
});
