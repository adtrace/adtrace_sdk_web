"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedUrlBypass = void 0;
const constants_1 = require("../../../constants");
var BlockedUrlBypass;
(function (BlockedUrlBypass) {
    BlockedUrlBypass.Default = 'default';
    BlockedUrlBypass.India = 'india';
    BlockedUrlBypass.China = 'china';
    const endpoints = {
        [BlockedUrlBypass.Default]: constants_1.ENDPOINTS.default,
        [BlockedUrlBypass.India]: constants_1.ENDPOINTS.india,
        [BlockedUrlBypass.China]: constants_1.ENDPOINTS.china,
    };
    const getPreferredUrlsWithOption = (endpoints, option) => {
        if (option === BlockedUrlBypass.India) {
            return [
                endpoints[BlockedUrlBypass.India],
                endpoints[BlockedUrlBypass.Default]
            ];
        }
        if (option === BlockedUrlBypass.China) {
            return [
                endpoints[BlockedUrlBypass.China],
                endpoints[BlockedUrlBypass.Default]
            ];
        }
        return [
            endpoints[BlockedUrlBypass.Default],
            endpoints[BlockedUrlBypass.India],
            endpoints[BlockedUrlBypass.China]
        ];
    };
    function preferredUrlsGetter(option, endpointsMap = endpoints) {
        return () => getPreferredUrlsWithOption(endpointsMap, option);
    }
    BlockedUrlBypass.preferredUrlsGetter = preferredUrlsGetter;
})(BlockedUrlBypass = exports.BlockedUrlBypass || (exports.BlockedUrlBypass = {}));
//# sourceMappingURL=blocked-url-bypass.js.map