"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingRouter = void 0;
/* istanbul ignore file */
const express_1 = __importDefault(require("express"));
const start_1 = __importDefault(require("../controllers/start/start"));
const manage_booking_start_check_1 = __importDefault(require("../controllers/manage-booking-start-check/manage-booking-start-check"));
const manage_booking_start_change_1 = __importDefault(require("../controllers/manage-booking-start-change/manage-booking-start-change"));
const manage_booking_start_cancel_1 = __importDefault(require("../controllers/manage-booking-start-cancel/manage-booking-start-cancel"));
const config_1 = __importDefault(require("../config"));
const set_context_1 = require("../middleware/set-context");
const set_target_1 = require("../middleware/set-target");
const setup_session_1 = require("../middleware/setup-session");
const internationalisation_1 = require("../middleware/internationalisation");
exports.landingRouter = express_1.default.Router();
if (config_1.default.landing.enableInternalEntrypoints) {
    exports.landingRouter.get(["/landing/create"], start_1.default.get);
    exports.landingRouter.get(["/landing/check"], manage_booking_start_check_1.default.get);
    exports.landingRouter.get(["/landing/change"], manage_booking_start_change_1.default.get);
    exports.landingRouter.get(["/landing/cancel"], manage_booking_start_cancel_1.default.get);
}
exports.landingRouter.get([
    "/check",
    "/change",
    "/cancel",
    "/instructor-manage-test",
    "/manage-instructor-booking",
], setup_session_1.setupSession, set_target_1.setTarget, internationalisation_1.internationalisation, set_context_1.setContext, (req, res) => res.redirect("/manage-booking"));
