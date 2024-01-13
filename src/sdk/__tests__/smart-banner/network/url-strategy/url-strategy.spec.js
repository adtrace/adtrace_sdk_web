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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../logger"));
const url_strategy_1 = require("../../../../smart-banner/network/url-strategy/url-strategy");
const errors_1 = require("../../../../smart-banner/network/errors");
jest.mock('../../../../logger');
describe('UrlStrategy', () => {
    const urls = [{
            endpointName: 'foo',
            app: 'foo',
            gdpr: 'foo'
        }, {
            endpointName: 'bar',
            app: 'bar',
            gdpr: 'bar'
        }];
    const preferredUrlsMock = jest.fn();
    const testedUrlStrategy = new url_strategy_1.UrlStrategy(preferredUrlsMock);
    const sendRequestMock = jest.fn();
    beforeAll(() => {
        jest.spyOn(logger_1.default, 'error');
        jest.spyOn(logger_1.default, 'log');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('preferredUrls sanity check', () => {
        it('throws error if there is no enpoint defined', () => __awaiter(void 0, void 0, void 0, function* () {
            preferredUrlsMock.mockImplementation(() => undefined);
            expect.assertions(2);
            try {
                yield testedUrlStrategy.retries(sendRequestMock);
            }
            catch (err) {
                expect(err).toBe(url_strategy_1.UrlStrategy.NoPreferredUrlsDefinedError);
                expect(logger_1.default.error).toHaveBeenCalledWith(url_strategy_1.UrlStrategy.NoPreferredUrlsDefinedError.message);
            }
        }));
        it('throws error if array of endpoints is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            preferredUrlsMock.mockImplementation(() => []);
            expect.assertions(2);
            try {
                yield testedUrlStrategy.retries(sendRequestMock);
            }
            catch (err) {
                expect(err).toBe(url_strategy_1.UrlStrategy.NoPreferredUrlsDefinedError);
                expect(logger_1.default.error).toHaveBeenCalledWith(url_strategy_1.UrlStrategy.NoPreferredUrlsDefinedError.message);
            }
        }));
    });
    describe('retries functionality', () => {
        beforeAll(() => {
            preferredUrlsMock.mockImplementation(() => urls);
        });
        it('tries to reach next endpoint if could not connect', () => __awaiter(void 0, void 0, void 0, function* () {
            sendRequestMock
                .mockRejectedValueOnce(errors_1.NoConnectionError)
                .mockResolvedValueOnce('all good');
            expect.assertions(4);
            const result = yield testedUrlStrategy.retries(sendRequestMock);
            expect(sendRequestMock).toHaveBeenCalledTimes(urls.length);
            expect(logger_1.default.log).toHaveBeenCalledWith(`Failed to connect ${urls[0].endpointName} endpoint`);
            expect(logger_1.default.log).toHaveBeenCalledWith(`Trying ${urls[1].endpointName} one`);
            expect(result).toBe('all good');
        }));
        it('re-throws if there is no available endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            sendRequestMock.mockRejectedValue(errors_1.NoConnectionError);
            expect.assertions(6);
            try {
                yield testedUrlStrategy.retries(sendRequestMock);
            }
            catch (err) {
                expect(err).toEqual(errors_1.NoConnectionError);
            }
            expect(sendRequestMock).toHaveBeenCalledTimes(urls.length);
            expect(logger_1.default.log).toHaveBeenCalledWith(`Failed to connect ${urls[0].endpointName} endpoint`);
            expect(logger_1.default.log).toHaveBeenCalledWith(`Trying ${urls[1].endpointName} one`);
            expect(logger_1.default.log).toHaveBeenCalledWith(`Failed to connect ${urls[1].endpointName} endpoint`);
            expect(testedUrlStrategy.retries).toThrow();
        }));
        it('re-throws if other error occured', () => __awaiter(void 0, void 0, void 0, function* () {
            sendRequestMock.mockRejectedValue({ status: 404, message: 'not found' });
            expect.assertions(3);
            try {
                yield testedUrlStrategy.retries(sendRequestMock);
            }
            catch (err) {
                expect(err).toEqual({ status: 404, message: 'not found' });
            }
            expect(sendRequestMock).toHaveBeenCalledTimes(1);
            expect(testedUrlStrategy.retries).toThrow();
        }));
    });
});
//# sourceMappingURL=url-strategy.spec.js.map