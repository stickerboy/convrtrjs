import { bindTool } from '../../ui/tool.js';
import * as smithy from '../../lib/ciphers/smithy.js';

const tool = { input: "smithyText", output: "smithyResults", chain: "chainSm" };
const key = (action) => ({ id: "smithyKey", required: `A key is required to ${action} this cipher` });

bindTool({ ...tool, button: "smithyEncrypt", key: key("encrypt"), run: smithy.smithyEncrypt });
bindTool({ ...tool, button: "smithyDecrypt", key: key("decrypt"), run: smithy.smithyDecrypt });
