import * as unscramble from './unscramble-fn.mjs';

Object.entries(unscramble).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});