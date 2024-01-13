"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../logger"));
const UrlStrategyModule = __importStar(require("../../../../smart-banner/network/url-strategy/url-strategy"));
const url_strategy_factory_1 = require("../../../../smart-banner/network/url-strategy/url-strategy-factory");
const blocked_url_bypass_1 = require("../../../../smart-banner/network/url-strategy//blocked-url-bypass");
const custom_url_1 = require("../../../../smart-banner/network/url-strategy//custom-url");
const data_residency_1 = require("../../../../smart-banner/network/url-strategy//data-residency");
jest.mock('../../../../logger');
describe('UrlStrategyFactory', () => {
    const urlStrategyConstructorMock = jest.fn();
    const urlsMap = { endpointName: 'foo.bar', app: 'app', gdpr: 'gdpr' };
    const customUrlMock = () => [urlsMap];
    const dataResidencyMock = () => [urlsMap];
    const blockedUrlBypassMock = () => [urlsMap];
    beforeAll(() => {
        jest.spyOn(UrlStrategyModule, 'UrlStrategy').mockImplementation(urlStrategyConstructorMock);
        jest.spyOn(custom_url_1.CustomUrl, 'preferredUrlsGetter').mockImplementation(() => customUrlMock);
        jest.spyOn(data_residency_1.DataResidency, 'preferredUrlsGetter').mockImplementation(() => dataResidencyMock);
        jest.spyOn(blocked_url_bypass_1.BlockedUrlBypass, 'preferredUrlsGetter').mockImplementation(() => blockedUrlBypassMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('creates CustomStrategy if customUrl is set in config', () => {
        url_strategy_factory_1.UrlStrategyFactory.create({ customUrl: 'custom.url' });
        expect(custom_url_1.CustomUrl.preferredUrlsGetter).toHaveBeenCalledWith('custom.url');
        expect(urlStrategyConstructorMock).toHaveBeenCalledWith(customUrlMock);
    });
    it.each([
        data_residency_1.DataResidency.EU,
        data_residency_1.DataResidency.TR,
        data_residency_1.DataResidency.US
    ])('creates DataResidency if dataResidency is set in config', (region) => {
        url_strategy_factory_1.UrlStrategyFactory.create({ dataResidency: region });
        expect(data_residency_1.DataResidency.preferredUrlsGetter).toHaveBeenCalledWith(region);
        expect(urlStrategyConstructorMock).toHaveBeenCalledWith(dataResidencyMock);
    });
    it.each([
        blocked_url_bypass_1.BlockedUrlBypass.China,
        blocked_url_bypass_1.BlockedUrlBypass.India
    ])('creates BlockedUrlBypass if urlStrategy is set in config', (strategy) => {
        url_strategy_factory_1.UrlStrategyFactory.create({ urlStrategy: strategy });
        expect(blocked_url_bypass_1.BlockedUrlBypass.preferredUrlsGetter).toHaveBeenCalledWith(strategy);
        expect(urlStrategyConstructorMock).toHaveBeenCalledWith(blockedUrlBypassMock);
    });
    it('creates BlockedUrlBypass if config is empty', () => {
        url_strategy_factory_1.UrlStrategyFactory.create({});
        expect(blocked_url_bypass_1.BlockedUrlBypass.preferredUrlsGetter).toHaveBeenCalled();
        expect(urlStrategyConstructorMock).toHaveBeenCalledWith(blockedUrlBypassMock);
    });
    it.each([
        [blocked_url_bypass_1.BlockedUrlBypass.China, data_residency_1.DataResidency.EU],
        [blocked_url_bypass_1.BlockedUrlBypass.China, data_residency_1.DataResidency.US],
        [blocked_url_bypass_1.BlockedUrlBypass.China, data_residency_1.DataResidency.TR],
        [blocked_url_bypass_1.BlockedUrlBypass.India, data_residency_1.DataResidency.EU],
        [blocked_url_bypass_1.BlockedUrlBypass.India, data_residency_1.DataResidency.US],
        [blocked_url_bypass_1.BlockedUrlBypass.India, data_residency_1.DataResidency.TR]
    ])('prefers DataResidency and prints warning if both dataResidency and urlStartegy are set in config', (strategy, region) => {
        jest.spyOn(logger_1.default, 'warn');
        url_strategy_factory_1.UrlStrategyFactory.create({ urlStrategy: strategy, dataResidency: region });
        expect(data_residency_1.DataResidency.preferredUrlsGetter).toHaveBeenCalledWith(region);
        expect(urlStrategyConstructorMock).toHaveBeenCalledWith(dataResidencyMock);
        expect(logger_1.default.warn).toHaveBeenCalledWith('Both dataResidency and urlStrategy are set in config, urlStrategy will be ignored');
    });
});
//# sourceMappingURL=url-strategy-factory.spec.js.map