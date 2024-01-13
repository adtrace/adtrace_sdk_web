"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResidency = exports.UrlStrategy = exports.getBaseUrlsIterator = void 0;
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("./constants");
var UrlStrategy;
(function (UrlStrategy) {
    UrlStrategy["Default"] = "default";
    UrlStrategy["India"] = "india";
    UrlStrategy["China"] = "china";
})(UrlStrategy || (UrlStrategy = {}));
exports.UrlStrategy = UrlStrategy;
var DataResidency;
(function (DataResidency) {
    DataResidency["EU"] = "EU";
    DataResidency["TR"] = "TR";
    DataResidency["US"] = "US";
})(DataResidency || (DataResidency = {}));
exports.DataResidency = DataResidency;
function incorrectOptionIgnoredMessage(higherPriority, lowerPriority) {
    logger_1.default.warn(`Both ${higherPriority} and ${lowerPriority} are set in config, ${lowerPriority} will be ignored`);
}
/**
 * Returns a map of base URLs or a list of endpoint names depending on SDK configuration
 */
function getEndpointPreference() {
    const { customUrl, urlStrategy, dataResidency } = config_1.default.getCustomConfig();
    if (customUrl) { // If custom URL is set then send all requests there
        if (dataResidency || urlStrategy) {
            incorrectOptionIgnoredMessage('customUrl', dataResidency ? 'dataResidency' : 'urlStrategy');
        }
        return { app: customUrl, gdpr: customUrl };
    }
    if (dataResidency && urlStrategy) {
        incorrectOptionIgnoredMessage('dataResidency', 'urlStrategy');
    }
    if (dataResidency) {
        return [dataResidency];
    }
    if (urlStrategy === UrlStrategy.India) {
        return [UrlStrategy.India, UrlStrategy.Default];
    }
    if (urlStrategy === UrlStrategy.China) {
        return [UrlStrategy.China, UrlStrategy.Default];
    }
    return [UrlStrategy.Default, UrlStrategy.India, UrlStrategy.China];
}
const endpointMap = {
    [UrlStrategy.Default]: constants_1.ENDPOINTS.default,
    [UrlStrategy.India]: constants_1.ENDPOINTS.india,
    [UrlStrategy.China]: constants_1.ENDPOINTS.china,
    [DataResidency.EU]: constants_1.ENDPOINTS.EU,
    [DataResidency.TR]: constants_1.ENDPOINTS.TR,
    [DataResidency.US]: constants_1.ENDPOINTS.US
};
function getPreferredUrls(endpoints) {
    const preference = getEndpointPreference();
    if (!Array.isArray(preference)) {
        return [preference];
    }
    else {
        const res = preference
            .map(strategy => endpoints[strategy] || null)
            .filter((i) => !!i);
        return res;
    }
}
function getBaseUrlsIterator(endpoints = endpointMap) {
    const _urls = getPreferredUrls(endpoints);
    let _counter = 0;
    return {
        next: () => {
            if (_counter < _urls.length) {
                return { value: _urls[_counter++], done: false };
            }
            else {
                return { value: undefined, done: true };
            }
        },
        reset: () => {
            _counter = 0;
        }
    };
}
exports.getBaseUrlsIterator = getBaseUrlsIterator;
//# sourceMappingURL=url-strategy.js.map