"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueIsRecord = exports.KeyRangeCondition = void 0;
const utilities_1 = require("../utilities");
var KeyRangeCondition;
(function (KeyRangeCondition) {
    KeyRangeCondition["LowerBound"] = "lowerBound";
    KeyRangeCondition["UpperBound"] = "upperBound";
})(KeyRangeCondition || (KeyRangeCondition = {}));
exports.KeyRangeCondition = KeyRangeCondition;
function valueIsRecord(value) {
    return (0, utilities_1.isObject)(value);
}
exports.valueIsRecord = valueIsRecord;
//# sourceMappingURL=types.js.map