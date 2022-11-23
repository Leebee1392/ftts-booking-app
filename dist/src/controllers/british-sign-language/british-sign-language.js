"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BritishSignLanagugeController = void 0;
const yes_or_no_1 = require("../../value-objects/yes-or-no");
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
class BritishSignLanagugeController {
    constructor() {
        this.get = (req, res) => {
            if (!req.session.journey) {
                throw Error("BritishSignLanagugeController::get: No journey set");
            }
            if (req.session.journey.inManagedBookingEditMode) {
                req.session.manageBookingEdits = undefined;
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
                throw Error("BritishSignLanagugeController::post: No journey set");
            }
            const isEditMode = req.session.journey.inEditMode;
            const { bsl } = req.body;
            if (isEditMode) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    bsl: bsl === enums_1.YesNo.YES,
                };
                return res.redirect("check-your-answers");
            }
            req.session.manageBookingEdits = {
                ...req.session.manageBookingEdits,
                bsl: bsl === enums_1.YesNo.YES,
            };
            return res.redirect("check-change");
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
            throw Error("BritishSignLanagugeController::renderPage: No currentBooking set");
        }
        if (!req.session.journey) {
            throw Error("BritishSignLanagugeController::renderPage: No journey set");
        }
        const { bsl, bookingRef } = req.session.currentBooking;
        const isEditMode = req.session.journey.inEditMode;
        const chosenBSL = bsl ? enums_1.YesNo.YES : enums_1.YesNo.NO;
        return res.render("manage-booking/british-sign-language", {
            chosenBSL: isEditMode ? chosenBSL : undefined,
            bookingRef,
            errors: req.errors,
        });
    }
}
exports.BritishSignLanagugeController = BritishSignLanagugeController;
exports.default = new BritishSignLanagugeController();
