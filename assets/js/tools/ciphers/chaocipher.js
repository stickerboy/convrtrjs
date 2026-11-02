import { bindToolFrame } from '../../ui/tool-frame.js';
import * as chaocipher from '../../lib/ciphers/chaocipher.js';

bindToolFrame({
    id: "chaocipher",
    modes: [
        { button: "chaocipherEncrypt", run: chaocipher.chaocipherEncode },
        { button: "chaocipherDecrypt", run: chaocipher.chaocipherDecode },
    ],
    errorPrefix: "Couldn't run the Chaocipher",
});
