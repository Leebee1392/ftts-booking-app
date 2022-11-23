"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorChooseSupportController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
const start_page_navigator_1 = require("../../helpers/start-page-navigator");
const session_1 = require("../../services/session");
const yes_or_no_1 = require("../../value-objects/yes-or-no");
class InstructorChooseSupportController {
    constructor() {
        this.get = (req, res) => {
            if (req.session.target === enums_1.Target.NI) {
                return res.redirect("/instructor/candidate-details");
            }
            if (!req.session.journey) {
                throw Error("InstructorChooseSupportController::get: No journey set");
            }
            return this.renderPage(req, res);
        };
        this.post = (req, res) => {
            if (req.session.target === enums_1.Target.NI) {
                return res.redirect("/instructor/candidate-details");
            }
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            if (!req.session.journey) {
                throw Error("InstructorChooseSupportController::post: No journey set");
            }
            const { chooseSupport } = req.body;
            const { inEditMode } = req.session.journey;
            const supportRequested = chooseSupport === enums_1.YesNo.YES;
            if (inEditMode) {
                req.session.journey = {
                    ...req.session.journey,
                    support: supportRequested,
                    standardAccommodation: !supportRequested,
                    inEditMode: false,
                };
                session_1.store.resetBooking(req);
                req.session.currentBooking = {}; // We want current booking to still be defined here.
                return !supportRequested
                    ? res.redirect("email-contact")
                    : res.redirect("nsa/test-type");
            }
            req.session.journey = {
                ...req.session.journey,
                support: false,
                standardAccommodation: true,
            };
            return !supportRequested
                ? res.redirect("candidate-details")
                : res.redirect("support-alert");
        };
    }
    renderPage(req, res) {
        var _a;
        if (!req.session.journey) {
            throw Error("InstructorChooseSupportController::renderPage: No journey set");
        }
        const { inEditMode, standardAccommodation } = req.session.journey;
        let backLink;
        if (inEditMode) {
            backLink = standardAccommodation
                ? "check-your-answers"
                : "nsa/check-your-details";
        }
        else {
            backLink = this.getBackLink(req);
        }
        if ((_a = req.errors) === null || _a === void 0 ? void 0 : _a.length) {
            req.errors[0].msg = language_1.translate("chooseSupport.errorMessage");
        }
        return res.render("instructor/choose-support", {
            errors: req.errors,
            backLink,
            booking: req.session.currentBooking,
        });
    }
    getBackLink(req) {
        return start_page_navigator_1.getInstructorBackLinkToStartPage(req);
    }
    /* istanbul ignore next */
    postSchemaValidation() {
        return {
            chooseSupport: {
                in: ["body"],
                custom: {
                    options: yes_or_no_1.YesOrNo.isValid,
                },
            },
        };
    }
}
exports.InstructorChooseSupportController = InstructorChooseSupportController;
exports.default = new InstructorChooseSupportController();
