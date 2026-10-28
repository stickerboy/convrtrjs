import { bindTool } from '../../ui/tool.js';
import * as rail from '../../lib/ciphers/rail.js';

const key = (action) => ({
    id: "railAmount",
    required: `A key is required to ${action} this cipher text`,
    pattern: /^[0-9]+$/,
    invalid: "Rail amount can only contain numbers. Letters and special characters, including spaces, are not valid here",
});
const tool = { input: "railText", output: "railResults" };

bindTool({ ...tool, button: "railEncrypt", key: key("encrypt"), run: rail.railFenceEncode, errorPrefix: "An error occurred trying to encrypt the string" });
bindTool({ ...tool, button: "railDecrypt", key: key("decrypt"), run: rail.railFenceDecode, errorPrefix: "An error occurred trying to decrypt the string" });
