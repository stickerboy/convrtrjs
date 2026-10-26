import * as merge from './mergeb64-fn.js';

Object.entries(merge).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});