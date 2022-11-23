"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstructorBackLinkToStartPage = exports.getManageBookingLinkToStartPage = exports.getBackLinkToStartPage = void 0;
const config_1 = __importDefault(require("../config"));
const enums_1 = require("../domain/enums");
const getBackLinkToStartPage = (req) => {
    if (req.session.target === enums_1.Target.NI) {
        return config_1.default.landing.ni.citizen.book;
    }
    if (req.session.locale === enums_1.Locale.CY) {
        return config_1.default.landing.cy.citizen.book;
    }
    return config_1.default.landing.gb.citizen.book;
};
exports.getBackLinkToStartPage = getBackLinkToStartPage;
const getManageBookingLinkToStartPage = (req) => {
    if (req.session.context === enums_1.Context.INSTRUCTOR) {
        if (req.session.target === enums_1.Target.NI) {
            return config_1.default.landing.ni.instructor.manageBooking;
        }
        return config_1.default.landing.gb.instructor.manageBooking;
    }
    if (req.session.target === enums_1.Target.NI) {
        return config_1.default.landing.ni.citizen.manageBooking;
    }
    return config_1.default.landing.gb.citizen.change;
};
exports.getManageBookingLinkToStartPage = getManageBookingLinkToStartPage;
const getInstructorBackLinkToStartPage = (req) => {
    if (req.session.target === enums_1.Target.NI) {
        return config_1.default.landing.ni.instructor.book;
    }
    return config_1.default.landing.gb.instructor.book;
};
exports.getInstructorBackLinkToStartPage = getInstructorBackLinkToStartPage;
