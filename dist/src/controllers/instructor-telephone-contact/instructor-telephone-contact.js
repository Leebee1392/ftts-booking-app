"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorTelephoneContactController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
class InstructorTelephoneContactController {
    constructor() {
        this.get = (req, res) => {
            if (!req.session.candidate) {
                throw Error("InstructorTelephoneContactController::get: No candidate set");
            }
            this.renderPage(req, res);
        };
        this.post = (req, res) => {
            var _a;
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            const { contactByTelephone, telephoneNumber } = req.body;
            req.session.candidate = {
                ...req.session.candidate,
                // Store as false if user says 'no' to being contacted by phone
                telephone: contactByTelephone === enums_1.YesNo.NO ? false : telephoneNumber,
            };
            if (contactByTelephone === enums_1.YesNo.YES) {
                req.session.journey = {
                    ...req.session.journey,
                    inEditMode: false,
                };
                return res.redirect("voicemail");
            }
            // reset voicemail to undefined if the user selects no to telephone
            if (((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.voicemail) !== undefined) {
                req.session.currentBooking.voicemail = undefined;
            }
            return res.redirect("check-your-details");
        };
        this.renderPage = (req, res) => {
            var _a, _b;
            if (!req.session.candidate) {
                throw Error("InstructorTelephoneContactController::renderPage: No candidate set");
            }
            if (!req.session.journey) {
                throw Error("InstructorTelephoneContactController::renderPage: No journey set");
            }
            const { telephone } = req.session.candidate;
            const { inEditMode } = req.session.journey;
            let contactByTelephone;
            if (telephone !== undefined) {
                if (telephone) {
                    contactByTelephone = enums_1.YesNo.YES;
                }
                else {
                    contactByTelephone = enums_1.YesNo.NO;
                }
            }
            const backLink = inEditMode ? "check-your-details" : "email-contact";
            return res.render("instructor/telephone-contact", {
                telephoneNumber: (_a = req.body.telephoneNumber) !== null && _a !== void 0 ? _a : telephone,
                contactByTelephone: (_b = req.body.contactByTelephone) !== null && _b !== void 0 ? _b : contactByTelephone,
                backLink,
                errors: req.errors,
            });
        };
        /* istanbul ignore next */
        this.postSchemaValidation = (req) => {
            const { contactByTelephone } = req.body;
            if (contactByTelephone === enums_1.YesNo.YES) {
                return {
                    telephoneNumber: {
                        in: ["body"],
                        notEmpty: {
                            errorMessage: () => language_1.translate("telephoneContact.noTelephoneError"),
                        },
                        isLength: {
                            options: { max: 50 },
                            errorMessage: () => language_1.translate("telephoneContact.telephoneTooLongError"),
                        },
                    },
                };
            }
            return {
                contactByTelephone: {
                    in: ["body"],
                    equals: {
                        options: enums_1.YesNo.NO,
                        errorMessage: () => language_1.translate("telephoneContact.noSelectionError"),
                    },
                },
            };
        };
    }
}
exports.InstructorTelephoneContactController = InstructorTelephoneContactController;
exports.default = new InstructorTelephoneContactController();
