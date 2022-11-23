"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toISODateString = exports.asWeekday = exports.asLocalTimeWithoutAmPm = exports.asLocalTime = exports.asFullDateWithoutYear = exports.asFullDateWithWeekday = exports.asFullDateTimeWithoutWeekday = exports.asFullDateWithoutWeekday = exports.asShortDateNoDelimiters = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const config_1 = __importDefault(require("../config"));
const DateHelper = __importStar(require("../domain/utc-date"));
exports.asShortDateNoDelimiters = localDateFormat("DD MM YYYY"); // "15 02 1995"
exports.asFullDateWithoutWeekday = localDateFormat("D MMMM YYYY"); // "3 September 2020"
exports.asFullDateTimeWithoutWeekday = localDateFormat("h:mma, D MMMM YYYY"); // "3:30pm, 3 September 2020"
exports.asFullDateWithWeekday = localDateFormat("dddd D MMMM YYYY"); // "Tuesday 3 September 2020"
exports.asFullDateWithoutYear = localDateFormat("D MMMM"); // "3 September"
exports.asLocalTime = localDateFormat("h:mma"); // "3:30pm" (GDS recommended format)
exports.asLocalTimeWithoutAmPm = localDateFormat("h:mm"); // "3:30"
exports.asWeekday = localDateFormat("dddd"); // "Tuesday"
function localDateFormat(mask) {
    return (isoDate) => dayjs_1.default(isoDate).tz(config_1.default.defaultTimeZone).format(mask);
}
function toISODateString(date) {
    return DateHelper.toISODateString(date);
}
exports.toISODateString = toISODateString;
