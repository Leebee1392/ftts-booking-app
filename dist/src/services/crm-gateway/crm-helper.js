"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCRMSupportNeeds = exports.mapCRMGenderCodeToGenderEnum = exports.mapGenderEnumToCRMGenderCode = exports.mapCRMPeopleTitleToString = exports.mapToSupportType = exports.mapPeopleTitleStringToCRMPeopleTitle = exports.mapVoiceoverToCRMVoiceover = exports.mapCRMRemitToCRMCalendarName = exports.mapToCandidateResponse = exports.mapToCandidate = exports.mapPaymentInformationToBookingDetails = exports.mapCRMRegionToTCNRegion = exports.getMissingFields = exports.mapToBookingDetails = exports.mapCRMBookingResponseToBookingResponse = exports.mapCRMProductToProductResponse = exports.mapToCRMBookingProduct = exports.mapFromCrmXmlBookingDetailsToCRMBookingDetails = exports.mapToCRMBooking = exports.mapToCRMLicence = exports.transformOtherTitle = exports.mapToCRMContact = void 0;
/* eslint-disable no-underscore-dangle */
const ftts_eligibility_api_model_1 = require("@dvsa/ftts-eligibility-api-model");
const dayjs_1 = __importDefault(require("dayjs"));
const helpers_1 = require("../../helpers");
const config_1 = __importDefault(require("../../config"));
const enums_1 = require("../../domain/enums");
const enums_2 = require("./enums");
const crm_support_helper_1 = require("./crm-support-helper");
const crm_address_mapper_1 = require("./crm-address-mapper");
const evidence_helper_1 = require("../../helpers/evidence-helper");
function mapToCRMContact(candidate) {
    return {
        ftts_persontype: enums_2.CRMPersonType.Candidate,
        ftts_firstandmiddlenames: candidate.firstnames,
        lastname: candidate.surname,
        birthdate: candidate.dateOfBirth,
        emailaddress1: candidate.email,
        telephone2: candidate.telephone || undefined,
        ftts_title: mapPeopleTitleStringToCRMPeopleTitle(candidate.title),
        ftts_othertitle: mapPeopleTitleStringToCRMPeopleTitle(candidate.title)
            ? undefined
            : transformOtherTitle(candidate.title),
        ftts_personreference: candidate.personReference,
        gendercode: mapGenderEnumToCRMGenderCode(candidate.gender),
        "ownerid@odata.bind": candidate.ownerId
            ? `teams(${candidate.ownerId})`
            : undefined,
        ...crm_address_mapper_1.mapToCrmContactAddress(candidate.address),
    };
}
exports.mapToCRMContact = mapToCRMContact;
function transformOtherTitle(title) {
    return title === "OTHER" ? "Other" : title;
}
exports.transformOtherTitle = transformOtherTitle;
function mapToCRMLicence(candidateId, licenceNumber, candidateDetails) {
    // Use the mapped CRM contact address which already handles edge cases such as empty lines and no city
    const mappedAddress = crm_address_mapper_1.mapToCrmContactAddress(candidateDetails === null || candidateDetails === void 0 ? void 0 : candidateDetails.address);
    const contactToLicenceAddress = {
        ftts_address1_street1: mappedAddress === null || mappedAddress === void 0 ? void 0 : mappedAddress.address1_line1,
        ftts_address1_street2: mappedAddress === null || mappedAddress === void 0 ? void 0 : mappedAddress.address1_line2,
        ftts_address1street3: mappedAddress === null || mappedAddress === void 0 ? void 0 : mappedAddress.address1_line3,
        ftts_address1street4: mappedAddress === null || mappedAddress === void 0 ? void 0 : mappedAddress.ftts_address1_line4,
        ftts_address1_city: mappedAddress === null || mappedAddress === void 0 ? void 0 : mappedAddress.address1_city,
        ftts_address1_postalcode: mappedAddress === null || mappedAddress === void 0 ? void 0 : mappedAddress.address1_postalcode,
        "ftts_Person@odata.bind": `contacts(${candidateId})`,
        "ownerid@odata.bind": (candidateDetails === null || candidateDetails === void 0 ? void 0 : candidateDetails.ownerId)
            ? `teams(${candidateDetails === null || candidateDetails === void 0 ? void 0 : candidateDetails.ownerId})`
            : undefined,
    };
    if (licenceNumber) {
        return {
            ...contactToLicenceAddress,
            ftts_licence: licenceNumber,
        };
    }
    return {
        ...contactToLicenceAddress,
    };
}
exports.mapToCRMLicence = mapToCRMLicence;
function mapToCRMBooking(candidate, booking, candidateId, licenceId, additionalSupport, isStandardAccommodation, priceListId) {
    var _a, _b, _c, _d, _e, _f;
    if (!candidate.firstnames ||
        !candidate.surname ||
        !candidate.licenceNumber ||
        !candidate.dateOfBirth ||
        (!isStandardAccommodation && !candidate.ownerId)) {
        throw new Error("CRMHelper::mapToCRMBooking: Missing required candidate data");
    }
    if (!booking.dateTime || !((_a = booking.centre) === null || _a === void 0 ? void 0 : _a.accountId) || !booking.testType) {
        if (isStandardAccommodation) {
            throw new Error("CRMHelper::mapToCRMBooking: Missing required booking data");
        }
    }
    return {
        "ftts_candidateid@odata.bind": `contacts(${candidateId})`,
        ftts_name: `${candidate.firstnames} ${candidate.surname}`,
        ftts_firstname: candidate.firstnames,
        ftts_lastname: candidate.surname,
        ftts_drivinglicence: candidate.licenceNumber,
        ftts_dob: candidate.dateOfBirth,
        ftts_origin: enums_2.CRMOrigin.CitizenPortal,
        ftts_pricepaid: booking.compensationBooking
            ? booking.compensationBooking.pricePaid
            : (_b = booking.priceList) === null || _b === void 0 ? void 0 : _b.price,
        "ftts_pricelist@odata.bind": booking.compensationBooking
            ? `pricelevels(${booking.compensationBooking.priceListId})`
            : `pricelevels(${priceListId})`,
        "ftts_LicenceId@odata.bind": `ftts_licences(${licenceId})`,
        "ftts_testcentre@odata.bind": isStandardAccommodation
            ? `accounts(${(_c = booking.centre) === null || _c === void 0 ? void 0 : _c.accountId})`
            : undefined,
        ftts_testdate: booking.dateTime,
        ftts_bookingstatus: isStandardAccommodation
            ? enums_2.CRMBookingStatus.Reserved
            : enums_2.CRMBookingStatus.Draft,
        ftts_language: ((_d = booking.language) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === enums_1.Language.WELSH.toLowerCase()
            ? enums_2.CRMTestLanguage.Welsh
            : enums_2.CRMTestLanguage.English,
        ftts_licencevalidstatus: enums_2.CRMLicenceValidStatus.Valid,
        ftts_additionalsupportoptions: additionalSupport,
        ftts_nivoiceoveroptions: mapVoiceoverToCRMVoiceover(booking.voiceover),
        ftts_selecteddate: booking.firstSelectedDate || booking.dateTime,
        "ftts_selectedtestcentrelocation@odata.bind": isStandardAccommodation
            ? `accounts(${((_e = booking.firstSelectedCentre) === null || _e === void 0 ? void 0 : _e.accountId) || ((_f = booking.centre) === null || _f === void 0 ? void 0 : _f.accountId)})`
            : undefined,
        ftts_governmentagency: booking.governmentAgency === enums_1.Target.GB
            ? enums_2.CRMGovernmentAgency.Dvsa
            : enums_2.CRMGovernmentAgency.Dva,
        ...mapNsaAttributesToBooking(candidate, booking, isStandardAccommodation),
        ftts_tcnpreferreddate: booking.firstSelectedDate,
        ftts_dateavailableonoraftertoday: booking.dateAvailableOnOrAfterToday,
        ftts_dateavailableonorbeforepreferreddate: booking.dateAvailableOnOrBeforePreferredDate,
        ftts_dateavailableonorafterpreferreddate: booking.dateAvailableOnOrAfterPreferredDate,
        ftts_testsselected: true,
        "ownerid@odata.bind": `teams(${config_1.default.crm.ownerId.dvsa})`,
    };
}
exports.mapToCRMBooking = mapToCRMBooking;
function mapNsaAttributesToBooking(candidate, booking, isStandardAccommodation) {
    return {
        ftts_nonstandardaccommodation: !isStandardAccommodation,
        ftts_nsastatus: isStandardAccommodation ? undefined : setNsaStatus(booking),
        ftts_supportrequirements: isStandardAccommodation
            ? undefined
            : new crm_support_helper_1.CRMSupportHelper(booking.selectSupportType, booking.customSupport).toString(booking.translator),
        ftts_preferreddateandtime: isStandardAccommodation
            ? undefined
            : crm_support_helper_1.CRMSupportHelper.getPreferredDayOrLocation(booking.preferredDayOption, booking.preferredDay),
        ftts_preferreddateselected: true,
        ftts_preferredtestcentrelocation: isStandardAccommodation
            ? undefined
            : crm_support_helper_1.CRMSupportHelper.getPreferredDayOrLocation(booking.preferredLocationOption, booking.preferredLocation),
        ftts_preferredcommunicationmethod: isStandardAccommodation
            ? enums_2.CRMPreferredCommunicationMethod.Email
            : crm_support_helper_1.CRMSupportHelper.preferredCommunicationMethod(candidate.telephone),
        ftts_proxypermitted: false,
        ftts_voicemailmessagespermitted: isStandardAccommodation
            ? undefined
            : crm_support_helper_1.CRMSupportHelper.isVoicemail(candidate.telephone, booking.voicemail),
        "ownerid@odata.bind": `teams(${config_1.default.crm.ownerId.dvsa})`,
    };
}
function mapFromCrmXmlBookingDetailsToCRMBookingDetails(crmXmlBookingDetails) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const mappedCRMBookingDetail = {
        ftts_bookingproductid: crmXmlBookingDetails.ftts_bookingproductid,
        ftts_reference: crmXmlBookingDetails.ftts_reference,
        _ftts_bookingid_value: crmXmlBookingDetails._ftts_bookingid_value,
        ftts_price: crmXmlBookingDetails.ftts_price,
        ftts_bookingstatus: (_a = crmXmlBookingDetails.ftts_bookingstatus) !== null && _a !== void 0 ? _a : null,
        ftts_testdate: (_b = crmXmlBookingDetails.ftts_testdate) !== null && _b !== void 0 ? _b : null,
        ftts_testlanguage: (_c = crmXmlBookingDetails.ftts_testlanguage) !== null && _c !== void 0 ? _c : null,
        ftts_voiceoverlanguage: (_d = crmXmlBookingDetails.ftts_voiceoverlanguage) !== null && _d !== void 0 ? _d : null,
        ftts_paymentstatus: (_e = crmXmlBookingDetails.ftts_paymentstatus) !== null && _e !== void 0 ? _e : null,
        ftts_salesreference: (_f = crmXmlBookingDetails.ftts_salesreference) !== null && _f !== void 0 ? _f : null,
        ftts_additionalsupportoptions: (_g = crmXmlBookingDetails.ftts_additionalsupportoptions) !== null && _g !== void 0 ? _g : null,
        ftts_bookingid: {
            ftts_governmentagency: (_h = crmXmlBookingDetails["booking.ftts_governmentagency"]) !== null && _h !== void 0 ? _h : null,
            ftts_reference: (_j = crmXmlBookingDetails.bookingReference) !== null && _j !== void 0 ? _j : null,
            ftts_origin: (_k = crmXmlBookingDetails["booking.ftts_origin"]) !== null && _k !== void 0 ? _k : null,
            ftts_testcentre: {},
            ftts_enableeligibilitybypass: (_l = crmXmlBookingDetails["booking.ftts_enableeligibilitybypass"]) !== null && _l !== void 0 ? _l : null,
            ftts_nonstandardaccommodation: (_m = crmXmlBookingDetails["booking.ftts_nonstandardaccommodation"]) !== null && _m !== void 0 ? _m : null,
            ftts_nsastatus: (_o = crmXmlBookingDetails["booking.ftts_nsastatus"]) !== null && _o !== void 0 ? _o : null,
            ftts_owedcompbookingassigned: (_p = crmXmlBookingDetails["booking.ftts_owedcompbookingassigned"]) !== null && _p !== void 0 ? _p : null,
            ftts_owedcompbookingrecognised: (_q = crmXmlBookingDetails["booking.ftts_owedcompbookingrecognised"]) !== null && _q !== void 0 ? _q : null,
            ftts_zerocostbooking: (_r = crmXmlBookingDetails["booking.ftts_zerocostbooking"]) !== null && _r !== void 0 ? _r : null,
            ftts_testsupportneed: (_s = crmXmlBookingDetails["booking.ftts_testsupportneed"]) !== null && _s !== void 0 ? _s : null,
            ftts_foreignlanguageselected: (_t = crmXmlBookingDetails["booking.ftts_foreignlanguageselected"]) !== null && _t !== void 0 ? _t : null,
            ftts_voicemailmessagespermitted: (_u = crmXmlBookingDetails["booking.ftts_voicemailmessagespermitted"]) !== null && _u !== void 0 ? _u : null,
            ftts_nivoiceoveroptions: (_v = crmXmlBookingDetails["booking.ftts_nivoiceoveroptions"]) !== null && _v !== void 0 ? _v : null,
        },
        ftts_nsabookingslots: (_w = crmXmlBookingDetails.ftts_nsabookingslots) !== null && _w !== void 0 ? _w : null,
        ftts_productid: {
            name: crmXmlBookingDetails["product.name"],
            productid: crmXmlBookingDetails["product.productid"],
            productnumber: crmXmlBookingDetails["product.productnumber"],
            _parentproductid_value: crmXmlBookingDetails["product.parentproductid"],
        },
        createdon: crmXmlBookingDetails.createdon,
    };
    if (!crmXmlBookingDetails["account.ftts_tcntestcentreid"]) {
        mappedCRMBookingDetail.ftts_bookingid.ftts_testcentre = null;
    }
    else {
        mappedCRMBookingDetail.ftts_bookingid.ftts_testcentre = {
            name: crmXmlBookingDetails["account.name"],
            address1_line1: crmXmlBookingDetails["account.address1_line1"],
            address1_line2: crmXmlBookingDetails["account.address1_line2"],
            address1_city: crmXmlBookingDetails["account.address1_city"],
            address1_county: crmXmlBookingDetails["account.address1_county"],
            address1_postalcode: crmXmlBookingDetails["account.address1_postalcode"],
            ftts_remit: crmXmlBookingDetails["account.ftts_remit"],
            ftts_siteid: crmXmlBookingDetails["account.ftts_siteid"],
            accountid: crmXmlBookingDetails["account.accountid"],
            ftts_tcntestcentreid: crmXmlBookingDetails["account.ftts_tcntestcentreid"],
            parentaccountid: {
                ftts_regiona: crmXmlBookingDetails["parentaccountid.ftts_regiona"],
                ftts_regionb: crmXmlBookingDetails["parentaccountid.ftts_regionb"],
                ftts_regionc: crmXmlBookingDetails["parentaccountid.ftts_regionc"],
            },
        };
    }
    return mappedCRMBookingDetail;
}
exports.mapFromCrmXmlBookingDetailsToCRMBookingDetails = mapFromCrmXmlBookingDetailsToCRMBookingDetails;
function mapToCRMBookingProduct(candidate, booking, bookingResponse, isStandardAccommodation, additionalSupport) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        "ftts_bookingid@odata.bind": `ftts_bookings(${bookingResponse.id})`,
        "ftts_CandidateId@odata.bind": `contacts(${candidate.candidateId})`,
        "ftts_productid@odata.bind": `products(${(_a = booking.priceList) === null || _a === void 0 ? void 0 : _a.product.productId})`,
        "ftts_ihttcid@odata.bind": isStandardAccommodation
            ? `accounts(${(_b = booking.centre) === null || _b === void 0 ? void 0 : _b.accountId})`
            : undefined,
        "ftts_drivinglicencenumber@odata.bind": `ftts_licences(${candidate.licenceId})`,
        "ftts_testcategoryId@odata.bind": `products(${(_d = (_c = booking.priceList) === null || _c === void 0 ? void 0 : _c.product) === null || _d === void 0 ? void 0 : _d.parentId})`,
        ftts_reference: `${bookingResponse.reference}-01`,
        ftts_drivinglicenceentered: candidate.licenceNumber,
        ftts_price: booking.compensationBooking
            ? booking.compensationBooking.price
            : (_e = booking.priceList) === null || _e === void 0 ? void 0 : _e.price,
        ftts_bookingstatus: isStandardAccommodation
            ? enums_2.CRMBookingStatus.Reserved
            : enums_2.CRMBookingStatus.Draft,
        ftts_additionalsupportoptions: additionalSupport,
        ftts_testdate: booking.dateTime,
        ftts_testlanguage: ((_f = booking.language) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === enums_1.Language.WELSH.toLowerCase()
            ? enums_2.CRMTestLanguage.Welsh
            : enums_2.CRMTestLanguage.English,
        ftts_selected: true,
        ftts_tcn_update_date: dayjs_1.default().toISOString(),
        ftts_salesreference: booking.salesReference,
        ftts_personalreferencenumber: candidate.personalReferenceNumber,
        ftts_paymentreferencenumber: candidate.paymentReceiptNumber,
        ftts_eligible: true,
        ftts_eligiblefrom: (_g = booking.eligibility) === null || _g === void 0 ? void 0 : _g.eligibleFrom,
        ftts_eligibleto: (_h = booking.eligibility) === null || _h === void 0 ? void 0 : _h.eligibleTo,
        "ownerid@odata.bind": `teams(${config_1.default.crm.ownerId.dvsa})`,
    };
}
exports.mapToCRMBookingProduct = mapToCRMBookingProduct;
function mapCRMProductToProductResponse(crmProduct) {
    if (crmProduct.length === 0) {
        throw new Error("No Product Found in CRM");
    }
    return {
        id: crmProduct[0].productid,
        // eslint-disable-next-line no-underscore-dangle
        parentId: crmProduct[0]._parentproductid_value,
    };
}
exports.mapCRMProductToProductResponse = mapCRMProductToProductResponse;
function mapCRMBookingResponseToBookingResponse(crmBookingResponse) {
    if (!crmBookingResponse.ftts_reference) {
        throw new Error("CRMHelper::mapCRMBookingResponseToBookingResponse: Missing ftts_reference in crm response");
    }
    return {
        id: crmBookingResponse.ftts_bookingid,
        reference: crmBookingResponse.ftts_reference,
        firstName: crmBookingResponse.ftts_firstname,
        lastName: crmBookingResponse.ftts_lastname,
        candidateId: crmBookingResponse._ftts_candidateid_value,
        licenceId: crmBookingResponse._ftts_licenceid_value,
    };
}
exports.mapCRMBookingResponseToBookingResponse = mapCRMBookingResponseToBookingResponse;
function mapToBookingDetails(crmBookingDetails) {
    const isAnNsaDraftBooking = helpers_1.isNsaDraftBooking(crmBookingDetails);
    const missingFields = getMissingFields(crmBookingDetails, isAnNsaDraftBooking);
    if (missingFields.length > 0) {
        helpers_1.logger.warn("CRMHelper::mapToBookingDetails: Missing fields to map", {
            missingFields,
            bookingid: crmBookingDetails._ftts_bookingid_value,
        });
        throw new Error("CRMHelper::mapToBookingDetails: Missing expected fields in crm response");
    }
    const owedCompensationBooking = crmBookingDetails.ftts_bookingid.ftts_owedcompbookingassigned !== null &&
        crmBookingDetails.ftts_bookingid.ftts_owedcompbookingrecognised === null;
    const booking = {
        bookingId: crmBookingDetails._ftts_bookingid_value,
        reference: crmBookingDetails.ftts_bookingid.ftts_reference,
        bookingProductId: crmBookingDetails.ftts_bookingproductid,
        bookingProductRef: crmBookingDetails.ftts_reference,
        bookingStatus: crmBookingDetails.ftts_bookingstatus,
        testDate: crmBookingDetails.ftts_testdate,
        testLanguage: crmBookingDetails.ftts_testlanguage,
        voiceoverLanguage: (isAnNsaDraftBooking
            ? crmBookingDetails.ftts_bookingid.ftts_nivoiceoveroptions
            : crmBookingDetails.ftts_voiceoverlanguage),
        additionalSupport: crmBookingDetails.ftts_additionalsupportoptions,
        nonStandardAccommodation: crmBookingDetails.ftts_bookingid.ftts_nonstandardaccommodation,
        nsaStatus: crmBookingDetails.ftts_bookingid.ftts_nsastatus,
        paymentStatus: crmBookingDetails.ftts_paymentstatus,
        price: crmBookingDetails.ftts_price,
        salesReference: crmBookingDetails.ftts_salesreference,
        origin: crmBookingDetails.ftts_bookingid.ftts_origin,
        governmentAgency: crmBookingDetails.ftts_bookingid
            .ftts_governmentagency,
        testCentre: {},
        product: crmBookingDetails.ftts_productid,
        createdOn: crmBookingDetails.createdon,
        enableEligibilityBypass: crmBookingDetails.ftts_bookingid.ftts_enableeligibilitybypass,
        compensationAssigned: crmBookingDetails.ftts_bookingid.ftts_owedcompbookingassigned,
        compensationRecognised: crmBookingDetails.ftts_bookingid.ftts_owedcompbookingrecognised,
        isZeroCostBooking: crmBookingDetails.ftts_bookingid.ftts_zerocostbooking,
        owedCompensationBooking,
        testSupportNeed: JSON.parse(`[ ${crmBookingDetails.ftts_bookingid.ftts_testsupportneed} ]`),
        foreignlanguageselected: crmBookingDetails.ftts_bookingid.ftts_foreignlanguageselected,
        nsaBookingSlots: crmBookingDetails.ftts_nsabookingslots,
        voicemailmessagespermitted: crmBookingDetails.ftts_bookingid.ftts_voicemailmessagespermitted,
    };
    // Safety check to allow for NSA Bookings that don't have a test centre assigned.
    if (crmBookingDetails.ftts_bookingid.ftts_testcentre) {
        booking.testCentre = {
            testCentreId: crmBookingDetails.ftts_bookingid.ftts_testcentre.ftts_tcntestcentreid,
            name: crmBookingDetails.ftts_bookingid.ftts_testcentre.name,
            addressLine1: crmBookingDetails.ftts_bookingid.ftts_testcentre.address1_line1,
            addressLine2: crmBookingDetails.ftts_bookingid.ftts_testcentre.address1_line2,
            addressCity: crmBookingDetails.ftts_bookingid.ftts_testcentre.address1_city,
            addressCounty: crmBookingDetails.ftts_bookingid.ftts_testcentre.address1_county,
            addressPostalCode: crmBookingDetails.ftts_bookingid.ftts_testcentre.address1_postalcode,
            remit: crmBookingDetails.ftts_bookingid.ftts_testcentre
                .ftts_remit,
            accountId: crmBookingDetails.ftts_bookingid.ftts_testcentre.accountid,
            region: mapCRMRegionToTCNRegion(crmBookingDetails.ftts_bookingid.ftts_testcentre),
            siteId: crmBookingDetails.ftts_bookingid.ftts_testcentre
                .ftts_siteid,
            ftts_tcntestcentreid: crmBookingDetails.ftts_bookingid.ftts_testcentre
                .ftts_tcntestcentreid,
        };
    }
    return booking;
}
exports.mapToBookingDetails = mapToBookingDetails;
function getMissingFields(crmBookingDetails, isAnNsaDraftBooking) {
    const possibleMissingSharedFields = [
        "ftts_bookingstatus",
        "ftts_productid",
        "ftts_testlanguage",
        "ftts_additionalsupportoptions",
    ];
    const possibleMissingBookingIdSharedFields = [
        "ftts_reference",
        "ftts_origin",
        "ftts_governmentagency",
    ];
    const possibleMissingTestCentreFields = ["ftts_remit", "ftts_siteid"];
    const possibleMissingStandardFields = [
        ...possibleMissingSharedFields,
        "ftts_salesreference",
        "ftts_testdate",
        "ftts_voiceoverlanguage",
    ];
    const possibleMissingBookingIdFieldsNsa = [
        ...possibleMissingBookingIdSharedFields,
        "ftts_nivoiceoveroptions",
    ];
    const actualMissingFields = [];
    if (isAnNsaDraftBooking) {
        possibleMissingSharedFields.forEach((missingField) => {
            const field = crmBookingDetails[missingField];
            if (missingField === "ftts_additionalsupportoptions") {
                if (field === undefined) {
                    actualMissingFields.push(missingField);
                }
            }
            else if (!field) {
                actualMissingFields.push(missingField);
            }
        });
        possibleMissingBookingIdFieldsNsa.forEach((missingField) => {
            const field = crmBookingDetails.ftts_bookingid[missingField];
            if (missingField === "ftts_governmentagency") {
                if (field === null) {
                    actualMissingFields.push(missingField);
                }
            }
            else if (!field) {
                actualMissingFields.push(missingField);
            }
        });
    }
    else {
        possibleMissingStandardFields.forEach((missingField) => {
            const field = crmBookingDetails[missingField];
            if (missingField === "ftts_additionalsupportoptions") {
                if (field === undefined) {
                    actualMissingFields.push(missingField);
                }
            }
            else if (!field) {
                actualMissingFields.push(missingField);
            }
        });
        possibleMissingBookingIdSharedFields.forEach((missingField) => {
            const field = crmBookingDetails.ftts_bookingid[missingField];
            if (missingField === "ftts_governmentagency") {
                if (field === null) {
                    actualMissingFields.push(missingField);
                }
            }
            else if (!field) {
                actualMissingFields.push(missingField);
            }
        });
    }
    if (crmBookingDetails.ftts_bookingid.ftts_testcentre) {
        possibleMissingTestCentreFields.forEach((missingField) => {
            const field = crmBookingDetails.ftts_bookingid.ftts_testcentre[missingField];
            if (!field) {
                actualMissingFields.push(missingField);
            }
        });
    }
    return actualMissingFields;
}
exports.getMissingFields = getMissingFields;
function mapCRMRegionToTCNRegion(centre) {
    var _a, _b, _c;
    // Every test centre should have one of the 3 region fields set to true
    if ((_a = centre.parentaccountid) === null || _a === void 0 ? void 0 : _a.ftts_regiona) {
        return enums_1.TCNRegion.A;
    }
    if ((_b = centre.parentaccountid) === null || _b === void 0 ? void 0 : _b.ftts_regionb) {
        return enums_1.TCNRegion.B;
    }
    if ((_c = centre.parentaccountid) === null || _c === void 0 ? void 0 : _c.ftts_regionc) {
        return enums_1.TCNRegion.C;
    }
    throw new Error("Unable to map the test centre to a region, all region values are false/missing");
}
exports.mapCRMRegionToTCNRegion = mapCRMRegionToTCNRegion;
function mapPaymentInformationToBookingDetails(paymentInformation, bookingDetails) {
    return {
        ...bookingDetails,
        paymentId: paymentInformation.ftts_payment.ftts_paymentid,
        paymentStatus: paymentInformation.ftts_payment.ftts_status,
        financeTransaction: {
            financeTransactionId: paymentInformation.ftts_financetransactionid,
            transactionStatus: paymentInformation.ftts_status,
            transactionType: paymentInformation.ftts_type,
        },
    };
}
exports.mapPaymentInformationToBookingDetails = mapPaymentInformationToBookingDetails;
function mapToCandidate(response) {
    return {
        candidateId: response.candidateId,
        firstnames: response.firstnames,
        surname: response.surname,
        email: response.email,
        dateOfBirth: response.dateOfBirth,
        licenceId: response.ftts_licenceid,
        licenceNumber: response.ftts_licence,
        personReference: response.personReference,
        telephone: response.telephone,
        title: mapCRMPeopleTitleToString(response.title),
        gender: mapCRMGenderCodeToGenderEnum(response.gender),
        address: {
            line1: response.ftts_address1_street1,
            line2: response.ftts_address1_street2,
            line3: response.ftts_address1street3,
            line4: response.ftts_address1street4,
            line5: response.ftts_address1_city,
            postcode: response.ftts_address1_postalcode,
        },
        supportNeedName: response.supportNeedName,
        supportEvidenceStatus: response.supportEvidenceStatus,
    };
}
exports.mapToCandidate = mapToCandidate;
function mapToCandidateResponse(response) {
    return {
        candidateId: response.contactid,
        firstnames: response.ftts_firstandmiddlenames,
        surname: response.lastname,
        email: response.emailaddress1,
        telephone: response.telephone2,
        dateOfBirth: response.birthdate,
        personReference: response.ftts_personreference,
        address: {
            line1: response.address1_line1,
            line2: response.address1_line2,
            line3: response.address1_line3,
            line4: response.ftts_address1_line4,
            line5: response.address1_city,
            postcode: response.address1_postalcode,
        },
    };
}
exports.mapToCandidateResponse = mapToCandidateResponse;
function mapCRMRemitToCRMCalendarName(remit) {
    switch (remit) {
        case enums_2.CRMRemit.England:
            return enums_2.CRMCalendarName.England;
        case enums_2.CRMRemit.NorthernIreland:
            return enums_2.CRMCalendarName.NorthernIreland;
        case enums_2.CRMRemit.Scotland:
            return enums_2.CRMCalendarName.Scotland;
        case enums_2.CRMRemit.Wales:
            return enums_2.CRMCalendarName.Wales;
        default:
            throw Error(`Invalid value for remit. Value: ${remit}`);
    }
}
exports.mapCRMRemitToCRMCalendarName = mapCRMRemitToCRMCalendarName;
function mapVoiceoverToCRMVoiceover(voiceover) {
    switch (voiceover) {
        case enums_1.Voiceover.ARABIC:
            return enums_2.CRMVoiceOver.Arabic;
        case enums_1.Voiceover.CANTONESE:
            return enums_2.CRMVoiceOver.Cantonese;
        case enums_1.Voiceover.ENGLISH:
            return enums_2.CRMVoiceOver.English;
        case enums_1.Voiceover.FARSI:
            return enums_2.CRMVoiceOver.Farsi;
        case enums_1.Voiceover.POLISH:
            return enums_2.CRMVoiceOver.Polish;
        case enums_1.Voiceover.PORTUGUESE:
            return enums_2.CRMVoiceOver.Portuguese;
        case enums_1.Voiceover.TURKISH:
            return enums_2.CRMVoiceOver.Turkish;
        case enums_1.Voiceover.WELSH:
            return enums_2.CRMVoiceOver.Welsh;
        case enums_1.Voiceover.NONE:
        default:
            return enums_2.CRMVoiceOver.None;
    }
}
exports.mapVoiceoverToCRMVoiceover = mapVoiceoverToCRMVoiceover;
function mapPeopleTitleStringToCRMPeopleTitle(title) {
    switch (title === null || title === void 0 ? void 0 : title.toLowerCase().trim()) {
        case "mr":
            return enums_2.CRMPeopleTitle.MR;
        case "ms":
            return enums_2.CRMPeopleTitle.MS;
        case "mrs":
            return enums_2.CRMPeopleTitle.MRS;
        case "miss":
            return enums_2.CRMPeopleTitle.MISS;
        case "mx":
            return enums_2.CRMPeopleTitle.MX;
        case "dr":
            return enums_2.CRMPeopleTitle.DR;
        case "doctor":
            return enums_2.CRMPeopleTitle.DR;
        default:
            return undefined;
    }
}
exports.mapPeopleTitleStringToCRMPeopleTitle = mapPeopleTitleStringToCRMPeopleTitle;
function mapToSupportType(supports) {
    if (supports === null || supports === undefined || supports.length === 0) {
        return [enums_1.TestSupportNeed.NoSupport];
    }
    return supports.map((support) => {
        switch (support) {
            case enums_2.CRMTestSupportNeed.BSLInterpreter:
                return enums_1.TestSupportNeed.BSLInterpreter;
            case enums_2.CRMTestSupportNeed.ExtraTime:
                return enums_1.TestSupportNeed.ExtraTime;
            case enums_2.CRMTestSupportNeed.ExtraTimeWithBreak:
                return enums_1.TestSupportNeed.ExtraTimeWithBreak;
            case enums_2.CRMTestSupportNeed.ForeignLanguageInterpreter:
                return enums_1.TestSupportNeed.ForeignLanguageInterpreter;
            case enums_2.CRMTestSupportNeed.HomeTest:
                return enums_1.TestSupportNeed.HomeTest;
            case enums_2.CRMTestSupportNeed.LipSpeaker:
                return enums_1.TestSupportNeed.LipSpeaker;
            case enums_2.CRMTestSupportNeed.NonStandardAccommodationRequest:
                return enums_1.TestSupportNeed.NonStandardAccommodationRequest;
            case enums_2.CRMTestSupportNeed.OralLanguageModifier:
                return enums_1.TestSupportNeed.OralLanguageModifier;
            case enums_2.CRMTestSupportNeed.OtherSigner:
                return enums_1.TestSupportNeed.OtherSigner;
            case enums_2.CRMTestSupportNeed.Reader:
                return enums_1.TestSupportNeed.Reader;
            case enums_2.CRMTestSupportNeed.FamiliarReaderToCandidate:
                return enums_1.TestSupportNeed.FamiliarReaderToCandidate;
            case enums_2.CRMTestSupportNeed.Reader_Recorder:
                return enums_1.TestSupportNeed.Reader_Recorder;
            case enums_2.CRMTestSupportNeed.SeperateRoom:
                return enums_1.TestSupportNeed.SeperateRoom;
            case enums_2.CRMTestSupportNeed.TestInIsolation:
                return enums_1.TestSupportNeed.TestInIsolation;
            case enums_2.CRMTestSupportNeed.SpecialTestingEquipment:
                return enums_1.TestSupportNeed.SpecialTestingEquipment;
            default:
                return enums_1.TestSupportNeed.NoSupport;
        }
    });
}
exports.mapToSupportType = mapToSupportType;
function mapCRMPeopleTitleToString(title) {
    switch (title) {
        case enums_2.CRMPeopleTitle.MR:
            return "mr";
        case enums_2.CRMPeopleTitle.MS:
            return "ms";
        case enums_2.CRMPeopleTitle.MRS:
            return "mrs";
        case enums_2.CRMPeopleTitle.MISS:
            return "miss";
        case enums_2.CRMPeopleTitle.MX:
            return "mx";
        case enums_2.CRMPeopleTitle.DR:
            return "dr";
        default:
            return undefined;
    }
}
exports.mapCRMPeopleTitleToString = mapCRMPeopleTitleToString;
function mapGenderEnumToCRMGenderCode(gender) {
    switch (gender) {
        case undefined:
            return undefined;
        case ftts_eligibility_api_model_1.ELIG.CandidateDetails.GenderEnum.M:
            return enums_2.CRMGenderCode.Male;
        case ftts_eligibility_api_model_1.ELIG.CandidateDetails.GenderEnum.F:
            return enums_2.CRMGenderCode.Female;
        default:
            return enums_2.CRMGenderCode.Unknown;
    }
}
exports.mapGenderEnumToCRMGenderCode = mapGenderEnumToCRMGenderCode;
function mapCRMGenderCodeToGenderEnum(gender) {
    switch (gender) {
        case undefined:
            return undefined;
        case enums_2.CRMGenderCode.Male:
            return ftts_eligibility_api_model_1.ELIG.CandidateDetails.GenderEnum.M;
        case enums_2.CRMGenderCode.Female:
            return ftts_eligibility_api_model_1.ELIG.CandidateDetails.GenderEnum.F;
        default:
            return ftts_eligibility_api_model_1.ELIG.CandidateDetails.GenderEnum.U;
    }
}
exports.mapCRMGenderCodeToGenderEnum = mapCRMGenderCodeToGenderEnum;
function setNsaStatus(booking) {
    if (!booking.selectSupportType ||
        booking.hasSupportNeedsInCRM === undefined) {
        throw new Error("CRMHelper::setNsaStatus: Missing candidate support data from booking");
    }
    const evidenceRoute = evidence_helper_1.determineEvidenceRoute(booking.selectSupportType, booking.hasSupportNeedsInCRM);
    if (evidenceRoute === enums_1.EvidencePath.EVIDENCE_REQUIRED) {
        return enums_2.CRMNsaStatus.AwaitingCandidateMedicalEvidence;
    }
    return enums_2.CRMNsaStatus.AwaitingCscResponse;
}
function hasCRMSupportNeeds(candidate) {
    if (candidate.supportNeedName && candidate.supportEvidenceStatus) {
        return true;
    }
    return false;
}
exports.hasCRMSupportNeeds = hasCRMSupportNeeds;
