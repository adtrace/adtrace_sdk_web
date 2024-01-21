"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResidency = void 0;
const constants_1 = require("../../../constants");
var DataResidency;
(function (DataResidency) {
    DataResidency.EU = 'EU';
    DataResidency.TR = 'TR';
    DataResidency.US = 'US';
    const endpoints = {
        [DataResidency.EU]: constants_1.ENDPOINTS.EU,
        [DataResidency.TR]: constants_1.ENDPOINTS.TR,
        [DataResidency.US]: constants_1.ENDPOINTS.US,
    };
    const getPreferredUrlsWithOption = (endpoints, option) => {
        return [endpoints[option]];
    };
    function preferredUrlsGetter(option, endpointsMap = endpoints) {
        return () => getPreferredUrlsWithOption(endpointsMap, option);
    }
    DataResidency.preferredUrlsGetter = preferredUrlsGetter;
})(DataResidency = exports.DataResidency || (exports.DataResidency = {}));
//# sourceMappingURL=data-residency.js.map