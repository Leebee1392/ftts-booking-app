"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorPreferredLocationController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
class InstructorPreferredLocationController {
    constructor() {
        this.get = (req, res) => this.render(req, res);
        this.post = (req, res) => {
            if (!req.session.journey) {
                throw Error("InstructorPreferredLocationController::post: No journey set");
            }
            const { locationInput, preferredLocationOption } = req.body;
            const { inEditMode } = req.session.journey;
            if (req.hasErrors) {
                return this.render(req, res);
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                preferredLocation: locationInput,
                preferredLocationOption,
            };
            return inEditMode
                ? res.redirect("check-your-details")
                : res.redirect("email-contact");
        };
        this.render = (req, res) => {
            var _a, _b;
            if (!req.session.journey) {
                throw Error("PreferredLocationBody::render: No journey set");
            }
            const { locationInput, preferredLocationOption } = req.body;
            const { inEditMode } = req.session.journey;
            res.render("instructor/preferred-location", {
                errors: req.errors,
                savedPreferredLocation: locationInput || ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.preferredLocation),
                preferredLocationOption: preferredLocationOption ||
                    ((_b = req.session.currentBooking) === null || _b === void 0 ? void 0 : _b.preferredLocationOption),
                backLink: inEditMode ? "check-your-details" : "preferred-day",
            });
        };
        /* istanbul ignore next */
        this.postSchemaValidation = (req) => {
            const { preferredLocationOption } = req.body;
            if (preferredLocationOption === enums_1.PreferredLocation.ParticularLocation) {
                return {
                    locationInput: {
                        in: ["body"],
                        isLength: {
                            options: { max: 4000 },
                            errorMessage: () => language_1.translate("preferredLocation.errorMessage"),
                        },
                    },
                };
            }
            return {
                preferredLocationOption: {
                    in: ["body"],
                    errorMessage: () => language_1.translate("preferredLocation.validationError"),
                    custom: {
                        options: enums_1.existsInEnum(enums_1.PreferredLocation),
                    },
                },
            };
        };
    }
}
exports.InstructorPreferredLocationController = InstructorPreferredLocationController;
exports.default = new InstructorPreferredLocationController();
