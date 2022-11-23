"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoicemailController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
const yes_or_no_1 = require("../../value-objects/yes-or-no");
class VoicemailController {
    constructor() {
        this.get = (req, res) => {
            if (!req.session.currentBooking) {
                throw Error("VoicemailController::get: No currentBooking set");
            }
            if (!req.session.journey) {
                throw Error("VoicemailController::get: No journey set");
            }
            const { inEditMode } = req.session.journey;
            const { voicemail } = req.session.currentBooking;
            const backLink = inEditMode ? "check-your-details" : "telephone-contact";
            res.render("supported/voicemail", {
                backLink,
                voicemailYes: voicemail === true,
                voicemailNo: voicemail === false,
            });
        };
        this.post = (req, res) => {
            if (req.hasErrors) {
                req.errors.forEach((error) => {
                    error.msg = language_1.translate("voicemail.errorBannerNotification");
                });
                return res.render("supported/voicemail", {
                    errors: req.errors,
                });
            }
            const { voicemail } = req.body;
            req.session.currentBooking = {
                ...req.session.currentBooking,
                voicemail: voicemail === enums_1.YesNo.YES,
            };
            return res.redirect("check-your-details");
        };
        /* istanbul ignore next */
        this.postSchemaValidation = () => ({
            voicemail: {
                in: ["body"],
                custom: {
                    options: yes_or_no_1.YesOrNo.isValid,
                },
            },
        });
    }
}
exports.VoicemailController = VoicemailController;
exports.default = new VoicemailController();
