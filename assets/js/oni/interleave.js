import * as interleave from './interleave-fn.js';

Object.entries(interleave).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});