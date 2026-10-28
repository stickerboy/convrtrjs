import { bindTool } from '../../ui/tool.js';
import * as chaocipher from '../../lib/ciphers/chaocipher.js';

const tool = { input: "chaocipherText", output: "chaocipherResults", chain: "chainChaocipher" };

bindTool({ ...tool, button: "chaocipherEncrypt", run: chaocipher.chaocipherEncode });
bindTool({ ...tool, button: "chaocipherDecrypt", run: chaocipher.chaocipherDecode });
