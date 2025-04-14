import * as lookahead from './lookahead-fn.mjs';

Object.entries(lookahead).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});