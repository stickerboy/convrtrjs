import * as unmunge from '../../lib/oni/unmunge.js';

Object.entries(unmunge).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});