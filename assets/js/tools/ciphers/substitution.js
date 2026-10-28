import { bindTool } from '../../ui/tool.js';
import * as substitution from '../../lib/ciphers/substitution.js';

bindTool({
    button: "substitutionEncrypt",
    input: "substitutionText",
    output: "substitutionResults",
    chain: "chainSubs",
    key: {
        id: "substitutionKey",
        required: "A key is required to encrypt this cipher",
        pattern: /^[A-Za-z]+$/,
        invalid: "Substitution key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
    },
    run: substitution.substituteChars,
});
