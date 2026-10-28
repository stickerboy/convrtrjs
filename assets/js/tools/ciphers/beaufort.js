import { bindTool } from '../../ui/tool.js';
import * as beaufort from '../../lib/ciphers/beaufort.js';

// Beaufort is reciprocal: the same operation encrypts and decrypts
const key = (action) => ({
    id: "beaufortKey",
    required: `A key is required to ${action} this cipher`,
    pattern: /^[A-Za-z]+$/,
    invalid: "Beaufort key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
});
const tool = { input: "beaufortText", output: "beaufortResults", run: beaufort.beaufortCipher };

bindTool({ ...tool, button: "beaufortEncrypt", key: key("encrypt") });
bindTool({ ...tool, button: "beaufortDecrypt", key: key("decrypt") });
