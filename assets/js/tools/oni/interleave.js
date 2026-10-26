import * as interleave from '../../lib/oni/interleave.js';

Object.entries(interleave).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});