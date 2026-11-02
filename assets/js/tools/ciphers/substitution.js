import { bindToolFrame } from '../../ui/tool-frame.js';
import * as substitution from '../../lib/ciphers/substitution.js';

bindToolFrame({
    id: "substitution",
    modes: [
        { button: "substitutionEncrypt", run: substitution.substituteChars },
    ],
    key: {
        id: "substitutionKey",
        flow: "with key",
        required: "A key is required for this cipher",
        pattern: /^[A-Za-z]+$/,
        invalid: "Substitution key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
    },
    errorPrefix: "Couldn't run the Substitution cipher",
});
