import * as interleave from './interleave-fn.mjs';

Object.entries(interleave).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});