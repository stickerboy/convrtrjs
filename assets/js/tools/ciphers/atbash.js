import { bindToolFrame } from '../../ui/tool-frame.js';
import * as atbash from '../../lib/ciphers/atbash.js';

bindToolFrame({
    id: "atbash",
    modes: [
        { button: "atbashEncrypt", run: atbash.atbashCipher },
    ],
    errorPrefix: "Couldn't run the Atbash cipher",
});
