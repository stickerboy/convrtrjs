import { bindTool } from '../../ui/tool.js';
import * as keyword from '../../lib/ciphers/keyword.js';

const tool = {
    input: "keywordText",
    output: "keywordResults",
    chain: "chainKw",
};
const key = (action) => ({
    id: "keywordKey",
    required: `A key is required to ${action} this cipher`,
    pattern: /^[A-Za-z]+$/,
    invalid: "Keyword key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
});

bindTool({ ...tool, button: "keywordEncrypt", key: key("encrypt"), run: keyword.keywordEncode });
bindTool({ ...tool, button: "keywordDecrypt", key: key("decrypt"), run: keyword.keywordDecode });
