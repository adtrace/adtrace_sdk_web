"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_startegy_network_1 = require("../../../smart-banner/network/url-startegy-network");
const url_strategy_1 = require("../../../smart-banner/network/url-strategy/url-strategy");
const url_strategy_factory_1 = require("../../../smart-banner/network/url-strategy/url-strategy-factory");
jest.mock('../../../logger');
describe('NetworkWithUrlStrategy', () => {
    const baseUrls = {
        endpointName: 'test',
        app: 'app.test',
        gdpr: 'gdpr.test'
    };
    const urlStrategyMock = new url_strategy_1.UrlStrategy(() => [baseUrls]);
    const networkMock = {
        endpoint: '',
        request: (_, __) => Promise.resolve('all good')
    };
    describe('instantiation', () => {
        beforeAll(() => {
            jest.resetAllMocks();
            jest.spyOn(url_strategy_factory_1.UrlStrategyFactory, 'create').mockImplementation(() => urlStrategyMock);
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('could be instantiated with provided UrlStrategy', () => {
            const network = new url_startegy_network_1.NetworkWithUrlStrategy(networkMock, { urlStrategy: urlStrategyMock });
            expect(url_strategy_factory_1.UrlStrategyFactory.create).not.toHaveBeenCalled();
            expect(network).toBeInstanceOf(url_startegy_network_1.NetworkWithUrlStrategy);
        });
        it('could be instantiated with UrlStrategyConfig', () => {
            const urlStrategyConfig = {};
            const network = new url_startegy_network_1.NetworkWithUrlStrategy(networkMock, { urlStrategyConfig });
            expect(url_strategy_factory_1.UrlStrategyFactory.create).toHaveBeenCalledWith(urlStrategyConfig);
            expect(network).toBeInstanceOf(url_startegy_network_1.NetworkWithUrlStrategy);
        });
    });
    describe('request', () => {
        beforeAll(() => {
            jest.spyOn(networkMock, 'request');
            jest.spyOn(urlStrategyMock, 'retries');
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('sends request with inner Network instance and uses UrlStrategy retries', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(3);
            const network = new url_startegy_network_1.NetworkWithUrlStrategy(networkMock, { urlStrategy: urlStrategyMock });
            const result = yield network.request('/whatever', { foo: 'bar', n: 42 });
            expect(result).toBe('all good');
            expect(urlStrategyMock.retries).toHaveBeenCalled();
            expect(networkMock.request).toHaveBeenCalledWith('/whatever', { foo: 'bar', n: 42 });
        }));
    });
    describe('endpoint property', () => {
        beforeAll(() => {
            jest.spyOn(networkMock, 'request');
            jest.spyOn(urlStrategyMock, 'retries');
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        const defaultEndpoint = 'https://app.adtrace.io';
        it('returns default endpoint before the first request', () => {
            const network = new url_startegy_network_1.NetworkWithUrlStrategy(networkMock, { urlStrategy: urlStrategyMock });
            expect(network.endpoint).toEqual(defaultEndpoint);
        });
        it('returns last endpoint after successful request', () => __awaiter(void 0, void 0, void 0, function* () {
            const network = new url_startegy_network_1.NetworkWithUrlStrategy(networkMock, { urlStrategy: urlStrategyMock });
            yield network.request('/whatever');
            expect(network.endpoint).toEqual(baseUrls.app);
        }));
        it('returns default endpoint after failed request', () => __awaiter(void 0, void 0, void 0, function* () {
            const network = new url_startegy_network_1.NetworkWithUrlStrategy(networkMock, { urlStrategy: urlStrategyMock });
            jest.spyOn(networkMock, 'request').mockRejectedValueOnce('Error!');
            try {
                yield network.request('/whatever');
            }
            catch (err) {
                // nothing to do here
            }
            expect(network.endpoint).toEqual(defaultEndpoint);
        }));
    });
});
//# sourceMappingURL=url-startegy-network.spec.js.map