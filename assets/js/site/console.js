// Make every tool available in the browser console as convrtr.*, e.g. convrtr.atbashCipher("Hello")
import * as lib from "../lib/index.js";

window.convrtr = Object.freeze({ ...lib });
