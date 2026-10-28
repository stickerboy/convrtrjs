import { bindTool } from '../../ui/tool.js';
import * as vigenere from '../../lib/ciphers/vigenere.js';

const tool = { input: "vigenereText", output: "vigenereResults", chain: "chainVig" };
const key = (action) => ({
    id: "vigenereKey",
    required: `A key is required to ${action} this cipher`,
    pattern: /^[A-Za-z]+$/,
    invalid: "Vigenère key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
});

bindTool({ ...tool, button: "vigenereEncrypt", key: key("encrypt"), run: vigenere.vignereEncrypt });
bindTool({ ...tool, button: "vigenereDecrypt", key: key("decrypt"), run: vigenere.vignereDecrypt });
