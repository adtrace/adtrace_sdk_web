"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrlsIterator = exports.urlStrategyRetries = exports.mockEndpoints = void 0;
const urlStrategyModule = jest.requireActual('../url-strategy');
const testEndpoints = {
    default: { app: 'app.default', gdpr: '' },
    india: { app: 'app.india', gdpr: '' },
    china: { app: 'app.china', gdpr: '' }
};
const singleEndpoint = { default: { app: 'app', gdpr: 'gdpr' } };
exports.mockEndpoints = {
    endpoints: testEndpoints,
    singleEndpoint
};
function urlStrategyRetries(sendRequest, endpoints = exports.mockEndpoints.endpoints) {
    return urlStrategyModule.urlStrategyRetries(sendRequest, endpoints);
}
exports.urlStrategyRetries = urlStrategyRetries;
function getBaseUrlsIterator(endpoints = exports.mockEndpoints.singleEndpoint) {
    return urlStrategyModule.getBaseUrlsIterator(endpoints);
}
exports.getBaseUrlsIterator = getBaseUrlsIterator;
//# sourceMappingURL=url-strategy.js.map