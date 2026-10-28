import { bindTool } from '../../ui/tool.js';
import * as atbash from '../../lib/ciphers/atbash.js';

bindTool({
    button: "atbashDecode",
    input: "atbashText",
    output: "atbashResults",
    chain: "chainAb",
    run: atbash.atbashCipher,
});
