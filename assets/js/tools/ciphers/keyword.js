import { bindToolFrame } from '../../ui/tool-frame.js';
import * as keyword from '../../lib/ciphers/keyword.js';

bindToolFrame({
    id: "keyword",
    modes: [
        { button: "keywordEncrypt", run: keyword.keywordEncode },
        { button: "keywordDecrypt", run: keyword.keywordDecode },
    ],
    key: {
        id: "keywordKey",
        flow: "with key",
        required: "A key is required for this cipher",
        pattern: /^[A-Za-z]+$/,
        invalid: "Keyword key can only contain uppercase and lowercase letters. Numbers and special characters, including spaces, are not valid here",
    },
    errorPrefix: "Couldn't run the Keyword cipher",
});
