import * as unscramble from './unscramble-fn.js';

Object.entries(unscramble).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});