import * as lookahead from '../../lib/oni/lookahead.js';

Object.entries(lookahead).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});