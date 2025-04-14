// import { emptyContainerCheck, largeDataWarning, showToast } from '../scripts.mjs';
import * as ciphers from './ciphers-fn.mjs';

Object.entries(ciphers).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});