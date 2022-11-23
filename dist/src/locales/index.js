"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const translation_json_1 = __importDefault(require("./cy/translation.json"));
const translation_json_2 = __importDefault(require("./gb/translation.json"));
const translation_json_3 = __importDefault(require("./ni/translation.json"));
const resources = {
    cy: {
        translation: translation_json_1.default,
    },
    gb: {
        translation: translation_json_2.default,
    },
    ni: {
        translation: translation_json_3.default,
    },
};
exports.default = resources;
