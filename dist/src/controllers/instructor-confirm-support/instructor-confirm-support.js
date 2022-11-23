"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorConfirmSupportController = exports.ConfirmSupportOption = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
var ConfirmSupportOption;
(function (ConfirmSupportOption) {
    ConfirmSupportOption["TELL_US_WHAT_SUPPORT"] = "1";
    ConfirmSupportOption["BOOK_WITHOUT_SUPPORT"] = "2";
    ConfirmSupportOption["CONTINUE_WITHOUT_TELLING_US"] = "3";
})(ConfirmSupportOption = exports.ConfirmSupportOption || (exports.ConfirmSupportOption = {}));
class InstructorConfirmSupportController {
    constructor() {
        this.get = (req, res) => {
            // When the user clicks back to confirm support page, change standardAccommodation back to false
            req.session.journey = {
                ...req.session.journey,
                standardAccommodation: false,
            };
            this.render(req, res);
        };
        this.post = (req, res) => {
            if (!req.session.journey) {
                throw Error("InstructorConfirmSupportController::post: Missing journey session data");
            }
            if (req.hasErrors) {
                this.render(req, res);
            }
            const { confirmSupport } = req.body;
            req.session.journey = {
                ...req.session.journey,
                confirmingSupport: true,
            };
            if (confirmSupport === ConfirmSupportOption.TELL_US_WHAT_SUPPORT) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    selectSupportType: undefined,
                };
                res.redirect("select-support-type");
            }
            else if (confirmSupport === ConfirmSupportOption.BOOK_WITHOUT_SUPPORT) {
                res.redirect("leaving-nsa");
            }
            else if (confirmSupport === ConfirmSupportOption.CONTINUE_WITHOUT_TELLING_US) {
                res.redirect("staying-nsa");
            }
        };
        this.render = (req, res) => res.render("instructor/confirm-support", {
            errors: req.errors,
            backLink: "select-support-type",
        });
        /* istanbul ignore next */
        this.postSchemaValidation = () => ({
            confirmSupport: {
                in: ["body"],
                errorMessage: () => language_1.translate("confirmSupport.error"),
                custom: {
                    options: enums_1.existsInEnum(ConfirmSupportOption),
                },
            },
        });
    }
}
exports.InstructorConfirmSupportController = InstructorConfirmSupportController;
exports.default = new InstructorConfirmSupportController();
