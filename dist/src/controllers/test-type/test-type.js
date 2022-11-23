"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTypeController = void 0;
const language_1 = require("../../helpers/language");
const session_1 = require("../../services/session");
const enums_1 = require("../../domain/enums");
const journey_helper_1 = require("../../helpers/journey-helper");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const eligibility_1 = require("../../domain/eligibility");
const maps_1 = require("../../services/crm-gateway/maps");
class TestTypeController {
    constructor(crm) {
        this.crm = crm;
        this.get = async (req, res) => this.renderPage(req, res);
        this.post = async (req, res) => {
            var _a, _b;
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            if (!req.session.journey) {
                throw Error("TestTypeController::post: No journey set");
            }
            /* istanbul ignore next */
            if (!req.session.priceLists) {
                throw Error("TestTypeController::post: No price list set");
            }
            /* istanbul ignore next */
            if (!req.session.candidate) {
                throw Error("TestTypeController::post: No candidate set");
            }
            req.session.journey.receivedSupportRequestPageFlag = false;
            req.session.journey.shownStandardSupportPageFlag = false;
            req.session.journey.shownVoiceoverPageFlag = false;
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                if (journey_helper_1.isNonStandardJourney(req)) {
                    // These fields could be long strings of text, so we want to keep these in session to avoid the candidate retyping them.
                    session_1.store.resetBookingExceptSupportText(req);
                }
                else {
                    session_1.store.resetBooking(req);
                }
                req.session.journey = {
                    ...req.session.journey,
                    inEditMode: false,
                };
            }
            const { testType } = req.body;
            const eligibilities = (_a = req.session.candidate.eligibilities) !== null && _a !== void 0 ? _a : [];
            const eligibility = eligibilities.find((eligibilityObj) => eligibilityObj.testType === testType);
            const allPriceLists = req.session.priceLists;
            const selectedPriceList = allPriceLists.find((item) => item.testType === testType);
            const compensationBookings = (_b = req.session.compensationBookings) !== null && _b !== void 0 ? _b : [];
            const selectedCompensationBooking = compensationBookings.find((compensationBooking) => maps_1.fromCRMProductNumber(compensationBooking.productNumber) === testType);
            if (!selectedPriceList) {
                throw Error(`TestTypeController::post: priceList missing for test type: ${testType}`);
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                testType,
                priceList: selectedPriceList,
                compensationBooking: selectedCompensationBooking,
                eligibility,
            };
            if (!journey_helper_1.isNonStandardJourney(req)) {
                const userDraftNSABookings = await this.crm.getUserDraftNSABookingsIfExist(req.session.candidate.candidateId, testType);
                if (userDraftNSABookings) {
                    req.session.lastPage = "test-type";
                    return res.redirect("received-support-request");
                }
            }
            return res.redirect("test-language");
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            testType: {
                in: ["body"],
                errorMessage: () => language_1.translate("testType.validationError"),
                custom: {
                    options: (value, { req }) => {
                        if (!value || !enums_1.existsInEnum(enums_1.TestType)(value)) {
                            return false;
                        }
                        // Double check against eligibilities in case user 'hacks' radio input value to different test type
                        const { target } = req.session;
                        const { isInstructor } = req.session.journey;
                        const { eligibilities } = req.session.candidate;
                        let prn;
                        if (isInstructor) {
                            prn =
                                target === enums_1.Target.NI
                                    ? req.session.candidate.paymentReceiptNumber
                                    : req.session.candidate.personalReferenceNumber;
                        }
                        return this.getBookableTestTypes(eligibilities, target, isInstructor, prn).includes(value);
                    },
                },
            },
        };
    }
    async renderPage(req, res) {
        var _a, _b;
        if (!req.session.journey) {
            throw Error("TestTypeController::renderPage: No journey set");
        }
        if (!req.session.currentBooking) {
            throw Error("TestTypeController::renderPage: No currentBooking set");
        }
        if (!((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId)) {
            throw Error("TestTypeController::renderPage: No candidate set");
        }
        const { inEditMode, isInstructor } = req.session.journey;
        const chosenTestType = req.session.currentBooking.testType;
        const target = req.session.target;
        const eligibilities = (_b = req.session.candidate.eligibilities) !== null && _b !== void 0 ? _b : [];
        let prn;
        if (isInstructor) {
            prn =
                target === enums_1.Target.NI
                    ? req.session.candidate.paymentReceiptNumber
                    : req.session.candidate.personalReferenceNumber;
        }
        const bookableTestTypes = this.getBookableTestTypes(eligibilities, target, isInstructor, prn);
        const priceList = await this.crm.getPriceList(target, bookableTestTypes);
        req.session.priceLists = priceList;
        const compensationBookings = await this.crm.getCandidateCompensatedBookings(req.session.candidate.candidateId, target);
        req.session.compensationBookings = compensationBookings;
        const tests = new Map();
        bookableTestTypes.forEach((testType) => {
            var _a;
            tests.set(testType, {
                key: testType,
                price: (_a = priceList.find((item) => item.testType === testType)) === null || _a === void 0 ? void 0 : _a.price,
                isCompensationBooking: compensationBookings
                    ? compensationBookings.find((compensationTest) => maps_1.fromCRMProductNumber(compensationTest.productNumber) ===
                        testType) !== undefined
                    : false,
                isZeroCostBooking: eligibility_1.isZeroCostTest(testType),
            });
        });
        let backLink;
        if (inEditMode) {
            if (journey_helper_1.isStandardJourney(req) || journey_helper_1.isSupportedStandardJourney(req)) {
                backLink = "check-your-answers";
            }
            else {
                backLink = "check-your-details";
            }
        }
        else {
            backLink = journey_helper_1.isNonStandardJourney(req) ? undefined : "email-contact";
        }
        return res.render("common/test-type", {
            backLink,
            errors: req.errors,
            chosenTestType,
            tests,
        });
    }
    getBookableTestTypes(eligibilities, target, isInstructor, prn) {
        if (isInstructor) {
            if (!prn) {
                return [];
            }
            return eligibilities
                .filter((eligibility) => {
                const doesPRNMatchTestType = target === enums_1.Target.NI
                    ? eligibility.paymentReceiptNumber === prn
                    : eligibility.personalReferenceNumber === prn;
                return (eligibility_1.isInstructorBookable(eligibility, target) && doesPRNMatchTestType);
            })
                .map((eligibility) => eligibility.testType);
        }
        return eligibilities
            .filter((eligibility) => eligibility_1.isBookable(eligibility, target))
            .map((eligibility) => eligibility.testType);
    }
}
exports.TestTypeController = TestTypeController;
exports.default = new TestTypeController(crm_gateway_1.CRMGateway.getInstance());
