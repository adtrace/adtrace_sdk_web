"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlStrategyFactory = void 0;
const logger_1 = __importDefault(require("../../../logger"));
const url_strategy_1 = require("./url-strategy");
const blocked_url_bypass_1 = require("./blocked-url-bypass");
const custom_url_1 = require("./custom-url");
const data_residency_1 = require("./data-residency");
var UrlStrategyFactory;
(function (UrlStrategyFactory) {
    const incorrectOptionIgnoredMessage = (higherPriority, lowerPriority) => {
        logger_1.default.warn(`Both ${higherPriority} and ${lowerPriority} are set in config, ${lowerPriority} will be ignored`);
    };
    function create(config) {
        const { customUrl, dataResidency, urlStrategy } = config;
        if (customUrl) {
            if (dataResidency || urlStrategy) {
                incorrectOptionIgnoredMessage('customUrl', dataResidency ? 'dataResidency' : 'urlStrategy');
            }
            return new url_strategy_1.UrlStrategy(custom_url_1.CustomUrl.preferredUrlsGetter(customUrl));
        }
        else if (dataResidency) {
            if (urlStrategy) {
                incorrectOptionIgnoredMessage('dataResidency', 'urlStrategy');
            }
            return new url_strategy_1.UrlStrategy(data_residency_1.DataResidency.preferredUrlsGetter(dataResidency));
        }
        else {
            return new url_strategy_1.UrlStrategy(blocked_url_bypass_1.BlockedUrlBypass.preferredUrlsGetter(urlStrategy));
        }
    }
    UrlStrategyFactory.create = create;
})(UrlStrategyFactory = exports.UrlStrategyFactory || (exports.UrlStrategyFactory = {}));
//# sourceMappingURL=url-strategy-factory.js.map