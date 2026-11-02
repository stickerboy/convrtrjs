import { bindToolFrame } from '../../ui/tool-frame.js';
import * as smithy from '../../lib/ciphers/smithy.js';

bindToolFrame({
    id: "smithy",
    modes: [
        { button: "smithyEncrypt", run: smithy.smithyEncrypt },
        { button: "smithyDecrypt", run: smithy.smithyDecrypt },
    ],
    key: {
        id: "smithyKey",
        flow: "with key",
        required: "A key is required for this cipher",
    },
    errorPrefix: "Couldn't run the Smithy cipher",
});
