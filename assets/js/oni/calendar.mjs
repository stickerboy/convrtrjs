import * as calendar from './calendar-fn.mjs';

Object.entries(calendar).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});