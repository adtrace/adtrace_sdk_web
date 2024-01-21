"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlStrategy = void 0;
const logger_1 = __importDefault(require("../../../logger"));
const errors_1 = require("../errors");
class UrlStrategy {
    constructor(preferredUrls) {
        this.preferredUrls = preferredUrls;
    }
    /**
     * Gets the list of preferred endpoints and wraps `sendRequest` function with iterative retries until available
     * endpoint found or another error occurred.
     */
    retries(sendRequest) {
        let attempt = 0;
        const trySendRequest = () => {
            const preferredUrls = this.preferredUrls();
            if (!preferredUrls || preferredUrls.length === 0) {
                logger_1.default.error(UrlStrategy.NoPreferredUrlsDefinedError.message);
                throw UrlStrategy.NoPreferredUrlsDefinedError;
            }
            const urlsMap = preferredUrls[attempt++];
            return sendRequest(urlsMap)
                .catch((reason) => {
                if (reason === errors_1.NoConnectionError) {
                    logger_1.default.log(`Failed to connect ${urlsMap.endpointName} endpoint`);
                    if (attempt < preferredUrls.length) {
                        logger_1.default.log(`Trying ${preferredUrls[attempt].endpointName} one`);
                        return trySendRequest(); // Trying next endpoint
                    }
                }
                // Another error occurred or we ran out of attempts, re-throw
                throw reason;
            });
        };
        return trySendRequest();
    }
}
exports.UrlStrategy = UrlStrategy;
UrlStrategy.NoPreferredUrlsDefinedError = new ReferenceError('UrlStrategy: No preferred URL defined');
//# sourceMappingURL=url-strategy.js.map