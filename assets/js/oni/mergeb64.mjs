import * as merge from './mergeb64-fn.mjs';

Object.entries(merge).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});