import { bindToolFrame } from '../../ui/tool-frame.js';
import * as rail from '../../lib/ciphers/rail.js';

bindToolFrame({
    id: "rail",
    modes: [
        { button: "railEncrypt", run: rail.railFenceEncode },
        { button: "railDecrypt", run: rail.railFenceDecode },
    ],
    key: {
        id: "railAmount",
        flow: ["on", "rails"],
        required: "A number of rails is required for this cipher",
        pattern: /^[0-9]+$/,
        invalid: "Rail amount can only contain numbers. Letters and special characters, including spaces, are not valid here",
    },
    errorPrefix: "Couldn't run the Rail fence cipher",
});
