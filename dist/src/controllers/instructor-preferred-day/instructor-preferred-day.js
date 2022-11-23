"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorPreferredDayController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
class InstructorPreferredDayController {
    constructor() {
        this.get = (req, res) => this.render(req, res);
        this.post = (req, res) => {
            if (!req.session.journey) {
                throw Error("InstructorPreferredDayController::post: No journey set");
            }
            const { dayInput, preferredDayOption } = req.body;
            const { inEditMode } = req.session.journey;
            if (req.hasErrors) {
                return this.render(req, res);
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                preferredDay: dayInput,
                preferredDayOption,
            };
            return inEditMode
                ? res.redirect("check-your-details")
                : res.redirect("preferred-location");
        };
        this.render = (req, res) => {
            var _a, _b;
            if (!req.session.journey) {
                throw Error("InstructorPreferredDayController::render: No journey set");
            }
            const { dayInput, preferredDayOption } = req.body;
            const { inEditMode } = req.session.journey;
            res.render("instructor/preferred-day", {
                errors: req.errors,
                savedPreferredDay: dayInput || ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.preferredDay),
                preferredDayOption: preferredDayOption || ((_b = req.session.currentBooking) === null || _b === void 0 ? void 0 : _b.preferredDayOption),
                backLink: inEditMode ? "check-your-details" : "staying-nsa",
            });
        };
        /* istanbul ignore next */
        this.postSchemaValidation = (req) => {
            const { preferredDayOption } = req.body;
            if (preferredDayOption === enums_1.PreferredDay.ParticularDay) {
                return {
                    dayInput: {
                        in: ["body"],
                        isLength: {
                            options: { max: 4000 },
                            errorMessage: () => language_1.translate("preferredDay.errorMessage"),
                        },
                    },
                };
            }
            return {
                preferredDayOption: {
                    in: ["body"],
                    errorMessage: () => language_1.translate("preferredDay.validationError"),
                    custom: {
                        options: enums_1.existsInEnum(enums_1.PreferredDay),
                    },
                },
            };
        };
    }
}
exports.InstructorPreferredDayController = InstructorPreferredDayController;
exports.default = new InstructorPreferredDayController();
