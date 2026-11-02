import { bindToolFrame } from '../../ui/tool-frame.js';
import * as vigenere from '../../lib/ciphers/vigenere.js';

bindToolFrame({
    id: "vigenere",
    modes: [
        { button: "vigenereEncrypt", run: vigenere.vigenereEncrypt },
        { button: "vigenereDecrypt", run: vigenere.vigenereDecrypt },
    ],
    key: {
        id: "vigenereKey",
        flow: "with key",
        required: "A key is required for this cipher",
        pattern: /^[A-Za-z]+$/,
        invalid: "Vigenère key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
    },
    errorPrefix: "Couldn't run the Vigenère cipher",
});
