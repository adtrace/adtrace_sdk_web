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
const logger_1 = __importDefault(require("../../../logger"));
const detect_os_1 = require("../../../smart-banner/detect-os");
const api_1 = require("../../../smart-banner/api");
jest.mock('../../../logger');
describe('Smart banner API tests', () => {
    describe('fetchSmartBannerData', () => {
        const webToken = 'abc123';
        const platform = detect_os_1.DeviceOS.iOS;
        const serverResponseMock = {
            platform: 'ios',
            position: 'bottom',
            tracker_token: 'none',
            title: 'Run App Name',
            description: 'You can run or install App Name',
            button_label: 'Go!'
        };
        const testNetwork = {
            endpoint: 'test-endpoint',
            request: jest.fn()
        };
        let requestSpy;
        beforeAll(() => {
            jest.spyOn(logger_1.default, 'error');
            requestSpy = jest.spyOn(testNetwork, 'request');
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('returns data when request is succesfull', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            requestSpy.mockResolvedValueOnce([serverResponseMock]);
            const smartBannerData = yield (0, api_1.fetchSmartBannerData)(webToken, platform, testNetwork);
            expect(smartBannerData).not.toBeNull();
            expect(smartBannerData).toEqual({
                appId: '',
                appName: '',
                position: api_1.Position.Bottom,
                header: serverResponseMock.title,
                description: serverResponseMock.description,
                buttonText: serverResponseMock.button_label,
                trackerToken: serverResponseMock.tracker_token,
                dismissInterval: 24 * 60 * 60 * 1000, // 1 day in millis before show banner next time
            });
        }));
        it('returns null when no banners for platform', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            requestSpy.mockResolvedValueOnce([Object.assign(Object.assign({}, serverResponseMock), { platform: 'android' })]);
            const smartBannerData = yield (0, api_1.fetchSmartBannerData)(webToken, platform, testNetwork);
            expect(smartBannerData).toBeNull();
        }));
        it('returns null when response invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            requestSpy.mockResolvedValueOnce([Object.assign(Object.assign({}, serverResponseMock), { title: '' })]);
            const smartBannerData = yield (0, api_1.fetchSmartBannerData)(webToken, platform, testNetwork);
            expect(smartBannerData).toBeNull();
        }));
        it('returns null when network error occurred', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const error = { status: 404, message: 'Not found' };
            requestSpy.mockRejectedValueOnce(error);
            const smartBannerData = yield (0, api_1.fetchSmartBannerData)(webToken, platform, testNetwork);
            expect(smartBannerData).toBeNull();
            expect(logger_1.default.error).toHaveBeenCalledWith('Network error occurred during loading Smart Banner: ' + JSON.stringify(error));
        }));
    });
});
//# sourceMappingURL=api.spec.js.map