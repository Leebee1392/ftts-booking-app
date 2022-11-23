"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warmupRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.warmupRouter = express_1.default.Router();
exports.warmupRouter.get(["/"], (_req, res) => {
    res.status(200).end();
});
