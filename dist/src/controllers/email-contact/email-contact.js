"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailContactController = void 0;
const config_1 = __importDefault(require("../../config"));
const language_1 = require("../../helpers/language");
const journey_helper_1 = require("../../helpers/journey-helper");
class EmailContactController {
    constructor() {
        this.EMAIL_MAX_LENGTH = 100;
        this.get = (req, res) => {
            if (!req.session.candidate) {
                throw Error("EmailContactController::get: No candidate set");
            }
            const { email } = req.session.candidate;
            const { locale } = req.session;
            const viewData = {
                backLink: this.getBackLink(req),
                emailValue: email,
                confirmEmailValue: email,
                digitalResultsEmailInfo: config_1.default.featureToggles.digitalResultsEmailInfo,
                locale,
            };
            return res.render("common/email-contact", viewData);
        };
        this.post = (req, res) => {
            var _a;
            const { locale } = req.session;
            if (req.hasErrors) {
                const viewData = {
                    backLink: this.getBackLink(req),
                    errors: req.errors,
                    confirmEmailValue: req.body.confirmEmail,
                    emailValue: req.body.email,
                    digitalResultsEmailInfo: config_1.default.featureToggles.digitalResultsEmailInfo,
                    locale,
                };
                return res.render("common/email-contact", viewData);
            }
            if (!req.session.journey) {
                throw Error("EmailContactController::post: No journey set");
            }
            req.session.candidate = {
                ...req.session.candidate,
                email: req.body.email,
            };
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                if (journey_helper_1.isStandardJourney(req) || journey_helper_1.isSupportedStandardJourney(req)) {
                    return res.redirect("check-your-answers");
                }
                return res.redirect("check-your-details");
            }
            if (journey_helper_1.isStandardJourney(req)) {
                return res.redirect("test-type");
            }
            if (journey_helper_1.isSupportedStandardJourney(req)) {
                if ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.isInstructor) {
                    return res.redirect("/instructor/find-test-centre");
                }
                return res.redirect("/find-test-centre");
            }
            if (journey_helper_1.isNonStandardJourney(req)) {
                return res.redirect("telephone-contact");
            }
            return res.redirect("test-type");
        };
        /* istanbul ignore next */
        this.postSchemaValidation = () => ({
            email: {
                in: ["body"],
                trim: true,
                toLowerCase: true,
                isEmail: {
                    errorMessage: () => language_1.translate("emailContact.emailValidationError"),
                    options: {
                        ignore_max_length: true,
                    },
                },
                isLength: {
                    errorMessage: () => language_1.translate("emailContact.emailTooLong"),
                    options: {
                        max: this.EMAIL_MAX_LENGTH,
                    },
                },
            },
            confirmEmail: {
                in: ["body"],
                trim: true,
                toLowerCase: true,
                isEmail: {
                    errorMessage: () => language_1.translate("emailContact.confirmEmailValidationError"),
                    options: {
                        ignore_max_length: true,
                    },
                },
                isLength: {
                    errorMessage: () => language_1.translate("emailContact.emailTooLong"),
                    options: {
                        max: this.EMAIL_MAX_LENGTH,
                    },
                },
                custom: {
                    options: this.matchingEmailValidator,
                },
            },
        });
        this.matchingEmailValidator = (value, { req }) => {
            if (!value) {
                throw new Error(language_1.translate("emailContact.unmatchingError"));
            }
            if (value !== req.body.email) {
                throw new Error(language_1.translate("emailContact.unmatchingError"));
            }
            return value;
        };
        this.getBackLink = (req) => {
            var _a;
            if (!req.session.journey) {
                throw Error("EmailContactController::getBackLink: No journey set");
            }
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                if (journey_helper_1.isStandardJourney(req) || journey_helper_1.isSupportedStandardJourney(req)) {
                    return "check-your-answers";
                }
                return "check-your-details";
            }
            if (journey_helper_1.isStandardJourney(req)) {
                return undefined;
            }
            if (journey_helper_1.isNonStandardJourney(req)) {
                return "preferred-location";
            }
            if (journey_helper_1.isSupportedStandardJourney(req)) {
                if ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.isInstructor) {
                    return "/instructor/nsa/leaving-nsa";
                }
                return "/nsa/leaving-nsa";
            }
            return undefined;
        };
    }
}
exports.EmailContactController = EmailContactController;
exports.default = new EmailContactController();
