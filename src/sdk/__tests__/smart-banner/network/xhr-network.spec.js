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
const xhr_network_1 = require("../../../smart-banner/network/xhr-network");
const errors_1 = require("../../../smart-banner/network/errors");
jest.mock('../../../logger');
describe('XhrNetwork tests', () => {
    const testEndpoint = 'test.test';
    const xhrMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        onerror: jest.fn(),
        onreadystatechange: jest.fn()
    };
    const testedNetwork = new xhr_network_1.XhrNetwork(testEndpoint);
    beforeAll(() => {
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('request method', () => {
        it('sends request to path with encoded params', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            testedNetwork.request('/whatever', { foo: 'bar', n: 42 });
            const expectedUrl = `${testEndpoint}/whatever?foo=bar&n=42`;
            expect(xhrMock.open).toHaveBeenCalledWith('GET', expectedUrl);
        }));
        it('sends request to path without params', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            testedNetwork.request('/whatever');
            const expectedUrl = `${testEndpoint}/whatever`;
            expect(xhrMock.open).toHaveBeenCalledWith('GET', expectedUrl);
        }));
        it('throws NoConnectionError if request failed due to network connection issue', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            jest.spyOn(xhrMock, 'send').mockImplementationOnce(() => { xhrMock.onerror(); });
            try {
                yield testedNetwork.request('/whatever');
            }
            catch (error) {
                expect(error).toEqual(errors_1.NoConnectionError);
            }
        }));
        it('throws an error if request failed', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const err = { status: 400, message: 'Bad request' };
            jest.spyOn(xhrMock, 'send').mockImplementationOnce(() => {
                const xhrFailedMock = xhrMock;
                xhrFailedMock.readyState = 4;
                xhrFailedMock.status = err.status;
                xhrFailedMock.responseText = err.message;
                xhrFailedMock.onreadystatechange();
            });
            try {
                yield testedNetwork.request('/whatever');
            }
            catch (error) {
                expect(error).toEqual(err);
            }
        }));
    });
    describe('endpoint property', () => {
        it('returns endpoint', () => {
            expect(testedNetwork.endpoint).toEqual(testEndpoint);
        });
    });
});
//# sourceMappingURL=xhr-network.spec.js.map