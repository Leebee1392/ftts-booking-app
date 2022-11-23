"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distanceUomFrom = exports.DistanceUom = void 0;
const query_param_1 = require("./query-param");
var DistanceUom;
(function (DistanceUom) {
    DistanceUom["miles"] = "miles";
    DistanceUom["km"] = "km";
})(DistanceUom = exports.DistanceUom || (exports.DistanceUom = {}));
const distanceFrom = (v) => {
    if (v === DistanceUom[DistanceUom.km]) {
        return DistanceUom.km;
    }
    return DistanceUom.miles;
};
exports.distanceUomFrom = query_param_1.paramValueOf("distanceUom", distanceFrom, () => DistanceUom.miles);
