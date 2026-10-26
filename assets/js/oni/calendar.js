import * as calendar from './calendar-fn.js';

Object.entries(calendar).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});