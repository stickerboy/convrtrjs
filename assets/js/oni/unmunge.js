import * as unmunge from './unmunge-fn.js';

Object.entries(unmunge).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});