import * as unmunge from './unmunge-fn.mjs';

Object.entries(unmunge).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});