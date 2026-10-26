import * as merge from '../../lib/oni/mergeb64.js';

Object.entries(merge).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});