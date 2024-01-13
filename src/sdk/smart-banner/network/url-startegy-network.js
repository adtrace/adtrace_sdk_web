"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkWithUrlStrategy = void 0;
const constants_1 = require("../../constants");
const network_1 = require("../network/network");
const url_strategy_factory_1 = require("./url-strategy/url-strategy-factory");
class NetworkWithUrlStrategy extends network_1.NetworkDecorator {
    constructor(network, { urlStrategy, urlStrategyConfig }) {
        super(network);
        this.urlStrategy = urlStrategy || url_strategy_factory_1.UrlStrategyFactory.create(urlStrategyConfig);
    }
    /**
     * Returns last succesfull endpoint or default (`https://app.adtrace.io`) one
     */
    get endpoint() {
        return this.lastSuccessfulEndpoint || NetworkWithUrlStrategy.DEFAULT_ENDPOINT;
    }
    /**
     * Sends a request to provided path choosing origin with UrlStrategy and caches used origin if it was successfully
     * reached
     *
     * @param path
     * @param params non-encoded parameters of the request
     */
    request(path, params) {
        return this.urlStrategy.retries((baseUrlsMap) => {
            this.network.endpoint = baseUrlsMap.app;
            return this.network.request(path, params)
                .then((result) => {
                this.lastSuccessfulEndpoint = baseUrlsMap.app;
                return result;
            })
                .catch((err) => {
                this.lastSuccessfulEndpoint = undefined;
                throw err;
            });
        });
    }
}
exports.NetworkWithUrlStrategy = NetworkWithUrlStrategy;
NetworkWithUrlStrategy.DEFAULT_ENDPOINT = constants_1.ENDPOINTS.default.app;
//# sourceMappingURL=url-startegy-network.js.map