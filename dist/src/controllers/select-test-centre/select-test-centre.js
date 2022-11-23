"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectTestCentreController = void 0;
const escape_html_1 = __importDefault(require("escape-html"));
const config_1 = __importDefault(require("../../config"));
const enums_1 = require("../../domain/enums");
const math_helper_1 = require("../../helpers/math-helper");
const request_sanitizer_1 = require("../../libraries/request-sanitizer");
const locations_gateway_1 = __importDefault(require("../../services/locations/locations-gateway"));
const distance_uom_1 = require("../../helpers/distance-uom");
class SelectTestCentreController {
    constructor() {
        this.get = async (req, res) => {
            this.updateNumberofResults(req);
            this.loadSavedSearchQuery(req);
            await this.render(req, res);
        };
        this.post = async (req, res) => {
            var _a;
            if (req.hasErrors) {
                return this.render(req, res);
            }
            if (!req.session.journey) {
                throw Error("SelectTestCentreController::post: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("SelectTestCentreController::post: No currentBooking set");
            }
            const { testCentreId } = req.body;
            const centre = (_a = req.session.testCentres) === null || _a === void 0 ? void 0 : _a.find((item) => item.testCentreId === testCentreId);
            if (this.isManagedBookingSession(req)) {
                req.session.manageBookingEdits = {
                    ...req.session.manageBookingEdits,
                    centre,
                };
                return res.redirect("/manage-booking/select-date");
            }
            const { inEditMode } = req.session.journey;
            const { firstSelectedCentre } = req.session.currentBooking;
            if (!inEditMode) {
                const updatedCurrentBooking = {
                    centre,
                };
                if (!firstSelectedCentre) {
                    updatedCurrentBooking.firstSelectedCentre = centre;
                }
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    ...updatedCurrentBooking,
                };
            }
            else {
                req.session.editedLocationTime = {
                    ...req.session.editedLocationTime,
                    centre,
                };
            }
            return res.redirect("select-date");
        };
        this.render = async (req, res) => {
            const { searchQuery } = req.query;
            const { target } = req.session;
            const numberOfResults = Number(req.query.numberOfResults) || config_1.default.testCentreIncrementValue;
            let centres;
            let showMore = false;
            try {
                centres = searchQuery
                    ? await locations_gateway_1.default.fetchCentres(searchQuery, target || enums_1.Target.GB, math_helper_1.clamp(numberOfResults + 1, 5, 50))
                    : [];
                showMore = centres.length > numberOfResults;
                centres = centres.slice(0, numberOfResults);
            }
            catch (error) {
                return res.render("select-test-centre-error", { errors: true });
            }
            const foundSomeResults = Boolean(centres === null || centres === void 0 ? void 0 : centres.length);
            req.session.testCentreSearch = {
                ...req.session.testCentreSearch,
                zeroCentreResults: !foundSomeResults,
            };
            // Content rendered in the frontend js map needs escaping before passing to view
            // Nunjucks auto-escapes on render but client-side js script does not!
            centres.forEach((centre) => {
                centre.escapedAddress = {
                    name: escape_html_1.default(centre.name),
                    line1: centre.addressLine1 ? escape_html_1.default(centre.addressLine1) : "",
                    line2: centre.addressLine2 ? escape_html_1.default(centre.addressLine2) : "",
                    city: centre.addressCity ? escape_html_1.default(centre.addressCity) : "",
                    postalCode: centre.addressPostalCode
                        ? escape_html_1.default(centre.addressPostalCode)
                        : "",
                };
            });
            if (foundSomeResults) {
                req.session.testCentres = centres;
                return res.render("select-test-centre", {
                    searchQuery,
                    centres,
                    selectedCentres: req.query.centre,
                    distanceUom: distance_uom_1.distanceUomFrom(req.query),
                    errors: req.errors,
                    numberOfResults,
                    nextNumberOfResults: math_helper_1.clamp(numberOfResults + config_1.default.testCentreIncrementValue, 5, 50),
                    testCentreIncrementValue: config_1.default.testCentreIncrementValue,
                    mapsApiKey: config_1.default.mapsApiKey,
                    showMore,
                });
            }
            return res.redirect(!this.isManagedBookingSession(req)
                ? "/find-test-centre"
                : "/manage-booking/find-test-centre");
        };
        this.loadSavedSearchQuery = (req) => {
            const { testCentreSearch } = req.session;
            if (this.searchQueryIsInSession(req)) {
                req.query.searchQuery = testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.searchQuery;
            }
            if (!req.query.numberOfResults &&
                (testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.numberOfResults) !== undefined) {
                req.query.numberOfResults = testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.numberOfResults.toString();
            }
        };
        this.updateNumberofResults = (req) => {
            if (req.query.numberOfResults) {
                req.session.testCentreSearch = {
                    ...req.session.testCentreSearch,
                    numberOfResults: parseInt(String(req.query.numberOfResults), 10),
                };
            }
        };
        this.searchQueryIsInSession = (req) => { var _a; return !!((_a = req.session.testCentreSearch) === null || _a === void 0 ? void 0 : _a.searchQuery); };
        this.isManagedBookingSession = (req) => { var _a; return ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManagedBookingEditMode) || false; };
        /* istanbul ignore next */
        this.postSchemaValidation = () => ({
            testCentreId: {
                in: ["body"],
                isEmpty: {
                    errorMessage: "Please choose a centre",
                    negated: true,
                },
            },
        });
        /* istanbul ignore next */
        this.getSchemaValidation = () => ({
            centre: {
                in: ["query"],
                optional: true,
                customSanitizer: {
                    options: request_sanitizer_1.stringToArray,
                },
            },
        });
    }
}
exports.SelectTestCentreController = SelectTestCentreController;
exports.default = new SelectTestCentreController();
