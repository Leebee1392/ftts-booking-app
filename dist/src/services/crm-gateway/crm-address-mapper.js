"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCrmContactAddress = void 0;
/**
 * For DVSA candidates (address with 5 lines) map line 5 to the CRM city key.
 * For DVA (address with 3 lines) and incomplete DVSA addresses (fewer than 5 lines) - map the last populated line to the CRM city key.
 * Should only the mandatory lines be populated (line 1 and postcode) then the postcode is taken as the CRM city key.
 * @param address The elgibility address object
 * @returns a partial CRM contact entry containing only the address fields (lines 1-4), city and postcode
 */
function mapToCrmContactAddress(address) {
    if (address) {
        const mandatoryKeys = ["line1", "postcode"];
        const populatedNonMandatoryKeys = Object.keys(address).filter((key) => !mandatoryKeys.includes(key) &&
            Boolean(address[key]));
        const lastPopulatedKey = populatedNonMandatoryKeys[populatedNonMandatoryKeys.length - 1];
        if (lastPopulatedKey) {
            const newAddress = { ...address };
            delete newAddress[lastPopulatedKey];
            return {
                address1_line1: newAddress === null || newAddress === void 0 ? void 0 : newAddress.line1,
                address1_line2: newAddress === null || newAddress === void 0 ? void 0 : newAddress.line2,
                address1_line3: newAddress === null || newAddress === void 0 ? void 0 : newAddress.line3,
                ftts_address1_line4: newAddress === null || newAddress === void 0 ? void 0 : newAddress.line4,
                address1_city: address[lastPopulatedKey],
                address1_postalcode: newAddress === null || newAddress === void 0 ? void 0 : newAddress.postcode,
            };
        }
    }
    return {
        address1_line1: address === null || address === void 0 ? void 0 : address.line1,
        address1_line2: address === null || address === void 0 ? void 0 : address.line2,
        address1_line3: address === null || address === void 0 ? void 0 : address.line3,
        ftts_address1_line4: address === null || address === void 0 ? void 0 : address.line4,
        address1_city: address === null || address === void 0 ? void 0 : address.postcode,
        address1_postalcode: address === null || address === void 0 ? void 0 : address.postcode,
    };
}
exports.mapToCrmContactAddress = mapToCrmContactAddress;
