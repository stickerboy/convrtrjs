import * as lookahead from './lookahead-fn.js';

Object.entries(lookahead).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});