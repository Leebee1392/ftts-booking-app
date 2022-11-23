"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJourneyName = exports.isNonStandardJourney = exports.isSupportedStandardJourney = exports.isStandardJourney = void 0;
const isStandardJourney = (req) => {
    if (!req.session.journey) {
        throw Error("isStandardJourney:: No journey set");
    }
    const { support, standardAccommodation } = req.session.journey;
    if (support === undefined || standardAccommodation === undefined) {
        throw Error("isStandardJourney:: No params set");
    }
    return !support && standardAccommodation;
};
exports.isStandardJourney = isStandardJourney;
const isSupportedStandardJourney = (req) => {
    if (!req.session.journey) {
        throw Error("isSupportedStandardJourney:: No journey set");
    }
    const { support, standardAccommodation } = req.session.journey;
    if (support === undefined || standardAccommodation === undefined) {
        throw Error("isSupportedStandardJourney:: No params set");
    }
    return support && standardAccommodation;
};
exports.isSupportedStandardJourney = isSupportedStandardJourney;
const isNonStandardJourney = (req) => {
    if (!req.session.journey) {
        throw Error("isNonStandardJourney:: No journey set");
    }
    const { support, standardAccommodation } = req.session.journey;
    if (support === undefined || standardAccommodation === undefined) {
        throw Error("isNonStandardJourney:: No params set");
    }
    return support && !standardAccommodation;
};
exports.isNonStandardJourney = isNonStandardJourney;
const getJourneyName = (journey) => {
    if (journey.inManageBookingMode) {
        return "reschedule";
    }
    if (journey.isInstructor) {
        if (journey.standardAccommodation) {
            return "sa-instructor";
        }
        return "nsa-instructor";
    }
    if (journey.standardAccommodation) {
        return "sa";
    }
    return "nsa";
};
exports.getJourneyName = getJourneyName;
