"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StayingNSAController = void 0;
const enums_1 = require("../../domain/enums");
const evidence_helper_1 = require("../../helpers/evidence-helper");
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const crm_helper_1 = require("../../services/crm-gateway/crm-helper");
class StayingNSAController {
    constructor(crm) {
        this.crm = crm;
        this.get = async (req, res) => {
            var _a, _b;
            if (!req.session.currentBooking) {
                throw Error("StayingNSAController::get: No currentBooking set");
            }
            const booking = req.session.currentBooking;
            const userDraftNsaBookings = await this.crm.getUserDraftNSABookingsIfExist((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId, booking === null || booking === void 0 ? void 0 : booking.testType);
            if (userDraftNsaBookings) {
                req.session.lastPage = "select-support-type";
                return res.redirect("duplicate-support-request");
            }
            const selectedSupportOptions = this.getSelectedSupportOptions(req);
            const hasSupportNeedsInCRM = crm_helper_1.hasCRMSupportNeeds(req.session.candidate);
            req.session.currentBooking.hasSupportNeedsInCRM = hasSupportNeedsInCRM;
            const evidenceRoute = evidence_helper_1.determineEvidenceRoute(selectedSupportOptions, hasSupportNeedsInCRM);
            return res.render(`supported/${evidenceRoute}`, {
                showExtraContent: evidence_helper_1.isDeafCandidate(selectedSupportOptions) &&
                    selectedSupportOptions.includes(enums_1.SupportType.EXTRA_TIME),
                backLink: ((_b = req.session.journey) === null || _b === void 0 ? void 0 : _b.confirmingSupport)
                    ? "confirm-support"
                    : nsa_navigator_1.default.getPreviousPage(req),
            });
        };
    }
    getSelectedSupportOptions(req) {
        var _a;
        try {
            const supportTypes = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectSupportType;
            if (Array.isArray(supportTypes) && supportTypes.length > 0) {
                return supportTypes;
            }
            throw Error();
        }
        catch (error) {
            throw new Error("StayingNSAController::getSelectedSupportOptions: No support options provided");
        }
    }
}
exports.StayingNSAController = StayingNSAController;
exports.default = new StayingNSAController(crm_gateway_1.CRMGateway.getInstance());
