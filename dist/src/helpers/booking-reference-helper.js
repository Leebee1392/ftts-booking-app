"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normaliseBookingRef = exports.isEqualBookingRefs = void 0;
const isEqualBookingRefs = (ref1, ref2) => {
    if (!ref1 || !ref2)
        return false;
    return exports.normaliseBookingRef(ref1) === exports.normaliseBookingRef(ref2);
};
exports.isEqualBookingRefs = isEqualBookingRefs;
const normaliseBookingRef = (ref) => {
    if (!ref)
        return ref;
    return ref.toLocaleLowerCase().replace(/\s/g, ""); // Strip all spaces
};
exports.normaliseBookingRef = normaliseBookingRef;
