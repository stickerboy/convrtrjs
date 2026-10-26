import * as calendar from '../../lib/oni/calendar.js';

Object.entries(calendar).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});