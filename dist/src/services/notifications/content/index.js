"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const enums_1 = require("../../../domain/enums");
const gb_1 = __importDefault(require("./email/booking-confirmation/gb"));
const cy_1 = __importDefault(require("./email/booking-confirmation/cy"));
const ni_1 = __importDefault(require("./email/booking-confirmation/ni"));
const gb_2 = __importDefault(require("./email/booking-cancellation/gb"));
const cy_2 = __importDefault(require("./email/booking-cancellation/cy"));
const ni_2 = __importDefault(require("./email/booking-cancellation/ni"));
const gb_3 = __importDefault(require("./email/booking-rescheduled/gb"));
const cy_3 = __importDefault(require("./email/booking-rescheduled/cy"));
const ni_3 = __importDefault(require("./email/booking-rescheduled/ni"));
const gb_4 = __importDefault(require("./email/evidence-required/gb"));
const cy_4 = __importDefault(require("./email/evidence-required/cy"));
const ni_4 = __importDefault(require("./email/evidence-required/ni"));
const gb_5 = __importDefault(require("./email/evidence-not-required/gb"));
const cy_5 = __importDefault(require("./email/evidence-not-required/cy"));
const ni_5 = __importDefault(require("./email/evidence-not-required/ni"));
const gb_6 = __importDefault(require("./email/evidence-may-be-required/gb"));
const cy_6 = __importDefault(require("./email/evidence-may-be-required/cy"));
const ni_6 = __importDefault(require("./email/evidence-may-be-required/ni"));
const gb_7 = __importDefault(require("./email/returning-candidate/gb"));
const cy_7 = __importDefault(require("./email/returning-candidate/cy"));
const ni_7 = __importDefault(require("./email/returning-candidate/ni"));
const gb_8 = __importDefault(require("./email/refund-request/gb"));
const cy_8 = __importDefault(require("./email/refund-request/cy"));
const ni_8 = __importDefault(require("./email/refund-request/ni"));
exports.default = {
    email: {
        [types_1.EmailType.BOOKING_CONFIRMATION]: {
            [enums_1.Locale.GB]: gb_1.default,
            [enums_1.Locale.CY]: cy_1.default,
            [enums_1.Locale.NI]: ni_1.default,
        },
        [types_1.EmailType.BOOKING_CANCELLATION]: {
            [enums_1.Locale.GB]: gb_2.default,
            [enums_1.Locale.CY]: cy_2.default,
            [enums_1.Locale.NI]: ni_2.default,
        },
        [types_1.EmailType.BOOKING_RESCHEDULED]: {
            [enums_1.Locale.GB]: gb_3.default,
            [enums_1.Locale.CY]: cy_3.default,
            [enums_1.Locale.NI]: ni_3.default,
        },
        [types_1.EmailType.EVIDENCE_REQUIRED]: {
            [enums_1.Locale.GB]: gb_4.default,
            [enums_1.Locale.CY]: cy_4.default,
            [enums_1.Locale.NI]: ni_4.default,
        },
        [types_1.EmailType.EVIDENCE_NOT_REQUIRED]: {
            [enums_1.Locale.GB]: gb_5.default,
            [enums_1.Locale.CY]: cy_5.default,
            [enums_1.Locale.NI]: ni_5.default,
        },
        [types_1.EmailType.EVIDENCE_MAY_BE_REQUIRED]: {
            [enums_1.Locale.GB]: gb_6.default,
            [enums_1.Locale.CY]: cy_6.default,
            [enums_1.Locale.NI]: ni_6.default,
        },
        [types_1.EmailType.RETURNING_CANDIDATE]: {
            [enums_1.Locale.GB]: gb_7.default,
            [enums_1.Locale.CY]: cy_7.default,
            [enums_1.Locale.NI]: ni_7.default,
        },
        [types_1.EmailType.REFUND_REQUEST]: {
            [enums_1.Locale.GB]: gb_8.default,
            [enums_1.Locale.CY]: cy_8.default,
            [enums_1.Locale.NI]: ni_8.default,
        },
    },
};
