"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dayjs config in one place
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const isoWeek_1 = __importDefault(require("dayjs/plugin/isoWeek"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const minMax_1 = __importDefault(require("dayjs/plugin/minMax"));
const config_1 = __importDefault(require("../config"));
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(isoWeek_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(minMax_1.default);
dayjs_1.default.tz.setDefault(config_1.default.defaultTimeZone);
