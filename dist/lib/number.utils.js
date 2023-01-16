"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padNumber = void 0;
function padNumber(input, padSize = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumIntegerDigits: padSize
    }).format(input);
}
exports.padNumber = padNumber;
