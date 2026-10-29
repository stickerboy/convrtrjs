// Make every tool available in the browser console as convrtr.*, e.g. convrtr.atbashCipher("Hello")
// lib/ holds the pure functions; the image and URL helpers from ui/ are included too, e.g. convrtr.getURLParameter("t")
import * as lib from "../lib/index.js";
import * as image from "../ui/image.js";
import * as url from "../ui/url.js";

window.convrtr = Object.freeze({ ...lib, ...image, ...url });
