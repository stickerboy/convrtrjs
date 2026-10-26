import * as unscramble from '../../lib/oni/unscramble.js';

Object.entries(unscramble).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});