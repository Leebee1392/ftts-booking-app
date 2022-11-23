"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SlotUnavailableError extends Error {
    constructor() {
        super("Slot is unavailable");
    }
}
exports.default = SlotUnavailableError;
