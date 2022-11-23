"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorBritishSignLanagugeController = void 0;
const yes_or_no_1 = require("../../value-objects/yes-or-no");
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
class InstructorBritishSignLanagugeController {
    constructor() {
        this.get = (req, res) => {
            if (!req.session.journey) {
                throw Error("InstructorBritishSignLanagugeController::get: No journey set");
            }
            this.renderPage(req, res);
        };
        this.post = (req, res) => {
            if (req.hasErrors) {
                req.errors.forEach((error) => {
                    error.msg = language_1.translate("manageBookingChangeBSL.errorBannerNotification");
                });
                return this.renderPage(req, res);
            }
            if (!req.session.journey) {
                throw Error("InstructorBritishSignLanagugeController::post: No journey set");
            }
            const { bsl } = req.body;
            req.session.currentBooking = {
                ...req.session.currentBooking,
                bsl: bsl === enums_1.YesNo.YES,
            };
            return res.redirect("check-your-answers");
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            bsl: {
                in: ["body"],
                custom: {
                    options: yes_or_no_1.YesOrNo.isValid,
                },
            },
        };
    }
    renderPage(req, res) {
        if (!req.session.currentBooking) {
            throw Error("InstructorBritishSignLanagugeController::renderPage: No currentBooking set");
        }
        if (!req.session.journey) {
            throw Error("InstructorBritishSignLanagugeController::renderPage: No journey set");
        }
        const { bsl, bookingRef } = req.session.currentBooking;
        const isEditMode = req.session.journey.inEditMode;
        const chosenBSL = bsl ? enums_1.YesNo.YES : enums_1.YesNo.NO;
        return res.render("instructor/british-sign-language", {
            chosenBSL: isEditMode ? chosenBSL : undefined,
            bookingRef,
            errors: req.errors,
        });
    }
}
exports.InstructorBritishSignLanagugeController = InstructorBritishSignLanagugeController;
exports.default = new InstructorBritishSignLanagugeController();
