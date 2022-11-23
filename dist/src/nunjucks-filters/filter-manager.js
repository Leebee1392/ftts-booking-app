"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNunjucksFilters = void 0;
const asset_filter_1 = require("./asset-filter");
const currency_filter_1 = require("./currency-filter");
const distance_filter_1 = require("./distance-filter");
const error_filter_1 = require("./error-filter");
const dateFilters = __importStar(require("./local-date-time-filter"));
const maps_1 = require("../services/crm-gateway/maps");
// Add filters to Nunjucks environment
function addNunjucksFilters(env) {
    // add all the custom filters which will be visible in nunjucks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customFilters = {
        ...dateFilters,
        existsAsAnErrorIn: error_filter_1.ErrorFilter.existsAsAnErrorIn,
        fieldErrorMessage: error_filter_1.ErrorFilter.fieldErrorMessage,
        fieldErrorObject: error_filter_1.ErrorFilter.fieldErrorObject,
        formatPrice: currency_filter_1.CurrencyFilter.formatPrice,
        asset: asset_filter_1.AssetFilter.asset,
        formatDistance: distance_filter_1.DistanceFilter.formatDistance,
        milesToKilometres: distance_filter_1.DistanceFilter.milesToKilometres,
        fromProductNumber: maps_1.fromCRMProductNumber,
    };
    Object.keys(customFilters).forEach((filterName) => {
        env.addFilter(filterName, customFilters[`${filterName}`]);
    });
}
exports.addNunjucksFilters = addNunjucksFilters;
