"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./src/config"));
// Start the server
const port = Number(config_1.default.localPort);
app_1.default.listen(port, "0.0.0.0");
console.log(`App running, hosted at http://localhost:${port}`);
