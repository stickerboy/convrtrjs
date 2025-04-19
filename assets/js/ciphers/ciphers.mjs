import * as tools from '../tools.mjs';
import * as toolkit from '../toolkit.mjs';
import * as ciphers from './ciphers-fn.mjs';

Object.entries(tools).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});
Object.entries(toolkit).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});
Object.entries(ciphers).forEach(([functionName, functionRef]) => {
    window[functionName] = functionRef;
});