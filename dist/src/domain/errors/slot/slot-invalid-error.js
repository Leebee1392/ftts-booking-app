"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SlotInvalidError extends Error {
    constructor() {
        super("Slot is invalid");
    }
}
exports.default = SlotInvalidError;
