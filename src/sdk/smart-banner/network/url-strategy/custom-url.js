"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUrl = void 0;
var CustomUrl;
(function (CustomUrl) {
    const getPreferredUrlsWithOption = (customUrl) => {
        return [{
                endpointName: `Custom (${customUrl})`,
                app: customUrl,
                gdpr: customUrl
            }];
    };
    function preferredUrlsGetter(customUrl) {
        return () => getPreferredUrlsWithOption(customUrl);
    }
    CustomUrl.preferredUrlsGetter = preferredUrlsGetter;
})(CustomUrl = exports.CustomUrl || (exports.CustomUrl = {}));
//# sourceMappingURL=custom-url.js.map