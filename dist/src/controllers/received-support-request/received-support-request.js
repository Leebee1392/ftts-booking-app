"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivedSupportRequestController = void 0;
const journey_helper_1 = require("../../helpers/journey-helper");
class ReceivedSupportRequestController {
    constructor() {
        this.get = (req, res) => {
            if (!req.session.journey) {
                throw Error("ReceivedSupportRequestController::get: No journey set");
            }
            if (!journey_helper_1.isNonStandardJourney(req)) {
                req.session.journey.receivedSupportRequestPageFlag = true;
            }
            res.render("common/received-support-request", {
                backLink: this.getBackLink(req),
                continueLink: this.getContinueLink(req),
            });
        };
        this.getBackLink = (req) => {
            if (journey_helper_1.isSupportedStandardJourney(req)) {
                return "/nsa/leaving-nsa";
            }
            return "test-type";
        };
        this.getContinueLink = (req) => req.session.lastPage === "test-type" ? "test-language" : "email-contact";
    }
}
exports.ReceivedSupportRequestController = ReceivedSupportRequestController;
exports.default = new ReceivedSupportRequestController();
