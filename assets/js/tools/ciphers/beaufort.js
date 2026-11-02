import { bindToolFrame } from '../../ui/tool-frame.js';
import * as beaufort from '../../lib/ciphers/beaufort.js';

// Beaufort is reciprocal: the same operation encrypts and decrypts
bindToolFrame({
    id: "beaufort",
    modes: [
        { button: "beaufortEncrypt", run: beaufort.beaufortCipher },
        { button: "beaufortDecrypt", run: beaufort.beaufortCipher },
    ],
    key: {
        id: "beaufortKey",
        flow: "with key",
        required: "A key is required for this cipher",
        pattern: /^[A-Za-z]+$/,
        invalid: "Beaufort key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
    },
    errorPrefix: "Couldn't run the Beaufort cipher",
});
