"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeavingNSAController = void 0;
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
class LeavingNSAController {
    constructor(crm) {
        this.crm = crm;
        this.get = (req, res) => {
            // When the user clicks back to leaving nsa page, change standardAccommodation back to false
            req.session.journey = {
                ...req.session.journey,
                standardAccommodation: false,
            };
            return res.render("supported/leaving-nsa", {
                backLink: req.session.journey.confirmingSupport
                    ? "confirm-support"
                    : nsa_navigator_1.default.getPreviousPage(req),
            });
        };
        this.post = async (req, res) => {
            var _a, _b;
            const standardAccommodation = req.body.accommodation === "standard";
            req.session.journey = {
                ...req.session.journey,
                standardAccommodation,
            };
            const booking = req.session.currentBooking;
            const nsaBookings = await this.crm.getUserDraftNSABookingsIfExist((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId, booking === null || booking === void 0 ? void 0 : booking.testType);
            req.session.lastPage = "nsa/leaving-nsa";
            if (standardAccommodation) {
                if (nsaBookings) {
                    if ((_b = req.session.journey) === null || _b === void 0 ? void 0 : _b.isInstructor) {
                        return res.redirect("/instructor/received-support-request");
                    }
                    return res.redirect("/received-support-request");
                }
                return res.redirect("email-contact");
            }
            if (nsaBookings) {
                return res.redirect("duplicate-support-request");
            }
            return res.redirect("staying-nsa");
        };
    }
}
exports.LeavingNSAController = LeavingNSAController;
exports.default = new LeavingNSAController(crm_gateway_1.CRMGateway.getInstance());
