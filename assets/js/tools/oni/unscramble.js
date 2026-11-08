import { unscramble } from '../../lib/oni/unscramble.js';
import { bindToolFrame } from '../../ui/tool-frame.js';

const drop = document.getElementById("unscrambleDrop");

// Swaps each pair of characters; the switch drops an unpaired last character, as the original ONI-Tools does
bindToolFrame({
    id: "unscramble",
    modes: [{ button: "unscrambleRun", run: (text) => unscramble(text, drop.checked) }],
    watch: ["unscrambleDrop"],
    flow: () => [drop.checked ? "Swap each pair, dropping an unpaired last character" : "Swap each pair"],
    errorPrefix: "Couldn't unscramble the text",
});
