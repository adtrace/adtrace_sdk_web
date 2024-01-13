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
const logger_1 = __importDefault(require("../../logger"));
const Api = __importStar(require("../../smart-banner/api"));
const DetectOS = __importStar(require("../../smart-banner/detect-os"));
const factory_1 = require("../../smart-banner/storage/factory");
const local_storage_1 = require("../../smart-banner/storage/local-storage");
const smart_banner_1 = require("../../smart-banner/smart-banner");
jest.mock('../../logger');
jest.useFakeTimers();
const storage = new local_storage_1.LocalStorage;
jest.spyOn(factory_1.StorageFactory, 'createStorage').mockImplementation(() => storage);
describe('Smart Banner tests', () => {
    const webToken = 'abc123';
    const defaultDismissInterval = 60 * 60 * 1000; // 1 hour in millis
    const platform = DetectOS.DeviceOS.iOS;
    const bannerData = {
        appId: 'none',
        appName: 'Adtrace Web SDK',
        header: 'Adtrace Smart Banners',
        description: 'Not so smart actually, but deeplinks do the magic anyway',
        buttonText: 'Let\'s go!',
        dismissInterval: defaultDismissInterval,
        position: Api.Position.Top,
        trackerToken: 'abcd'
    };
    const onCreatedCallbackSpy = jest.fn();
    const onDismissedCallbackSpy = jest.fn();
    let smartBanner;
    beforeAll(() => {
        jest.spyOn(document, 'createElement');
        jest.spyOn(logger_1.default, 'log');
        jest.spyOn(logger_1.default, 'error');
        jest.spyOn(global, 'setTimeout');
        smartBanner = new smart_banner_1.SmartBanner({ webToken, onCreated: onCreatedCallbackSpy, onDismissed: onDismissedCallbackSpy });
    });
    beforeEach(() => {
        jest.spyOn(DetectOS, 'getDeviceOS').mockReturnValue(platform);
        jest.spyOn(Api, 'fetchSmartBannerData').mockResolvedValue(bannerData);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('initialisation', () => {
        afterEach(() => {
            smartBanner.destroy();
        });
        it(('initialises and renders banner'), () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(6);
            smartBanner.init(webToken);
            yield Utils.flushPromises(); // resolves data fetch promise that allows initialisation to finish
            expect(logger_1.default.log).toHaveBeenCalledWith('Creating Smart Banner');
            expect(document.createElement).toHaveBeenCalled();
            expect(smartBanner.banner).not.toBeNull();
            expect(smartBanner.dismissButton).not.toBeNull();
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner created');
            expect(onCreatedCallbackSpy).toHaveBeenCalled();
        }));
        describe('can not call init repeatedly', () => {
            it('initialisation in progress', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(2);
                smartBanner.init(webToken); // setup
                smartBanner.init(webToken);
                expect(logger_1.default.error).toHaveBeenCalledWith('Smart Banner is initialising already');
                yield Utils.flushPromises(); // tear down
                expect(onCreatedCallbackSpy).toHaveBeenCalledTimes(1);
            }));
            it('initialisation finished', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(2);
                smartBanner.init(webToken); // setup
                yield Utils.flushPromises(); // allow initialisation to finish
                smartBanner.init(webToken);
                expect(logger_1.default.error).toHaveBeenCalledWith('Smart Banner already exists');
                expect(onCreatedCallbackSpy).toHaveBeenCalledTimes(1);
            }));
        });
        it('logs message when no banner for platform', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Api, 'fetchSmartBannerData').mockResolvedValueOnce(null);
            expect.assertions(2);
            smartBanner.init(webToken);
            yield Utils.flushPromises();
            expect(logger_1.default.log).toHaveBeenCalledWith(`No Smart Banners for ${platform} platform found`);
            expect(onCreatedCallbackSpy).not.toHaveBeenCalled();
        }));
        it('logs message when no target platform', () => {
            jest.spyOn(DetectOS, 'getDeviceOS').mockReturnValueOnce(undefined);
            smartBanner.init(webToken);
            expect(logger_1.default.log).toHaveBeenCalledWith('This platform is not one of the targeting ones, Smart Banner will not be shown');
            expect(onCreatedCallbackSpy).not.toHaveBeenCalled();
        });
    });
    describe('hide and show', () => {
        beforeAll(() => {
            jest.spyOn(smartBanner, 'hide');
            jest.spyOn(smartBanner, 'show');
        });
        describe('Smart Banner initialised', () => {
            beforeEach(() => {
                smartBanner.init(webToken);
                return Utils.flushPromises() // resolves data fetch promise that allows initialisation to finish
                    .then(() => {
                    jest.spyOn(smartBanner.banner, 'hide');
                    jest.spyOn(smartBanner.banner, 'show');
                });
            });
            afterEach(() => {
                smartBanner.destroy();
            });
            it('hides banner', () => {
                smartBanner.hide();
                expect(smartBanner.banner.hide).toHaveBeenCalled();
            });
            it('shows banner', () => {
                smartBanner.show();
                expect(smartBanner.banner.show).toHaveBeenCalled();
            });
        });
        describe('Smart Banner is still initialising', () => {
            afterEach(() => {
                smartBanner.destroy();
                jest.clearAllMocks();
            });
            it('logs a message when hide called and hides after initialisation finished', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(3);
                smartBanner.init();
                smartBanner.hide();
                expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner will be hidden after initialisation finished');
                yield Utils.flushPromises(); // resolves data fetch promise that allows initialisation to finish
                expect(logger_1.default.log).toHaveBeenCalledWith('Initialisation finished, hiding Smart Banner');
                expect(smartBanner.hide).toHaveBeenCalledTimes(2);
            }));
            it('logs a message when show called and shows after initialisation finished', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(3);
                smartBanner.init();
                smartBanner.show();
                expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner will be shown after initialisation finished');
                yield Utils.flushPromises(); // resolves data fetch promise that allows initialisation to finish
                expect(logger_1.default.log).toHaveBeenCalledWith('Initialisation finished, showing Smart Banner');
                expect(smartBanner.show).toHaveBeenCalledTimes(2);
            }));
        });
        describe('Smart Banner was not initialised', () => {
            it('logs an error when hide called', () => {
                smartBanner.hide();
                expect(logger_1.default.error).toHaveBeenCalledWith('There is no Smart Banner to hide, have you called initialisation?');
            });
            it('logs an error when show called', () => {
                smartBanner.show();
                expect(logger_1.default.error).toHaveBeenCalledWith('There is no Smart Banner to show, have you called initialisation?');
            });
        });
    });
    describe('dismiss', () => {
        const now = Date.now();
        beforeAll(() => {
            jest.spyOn(Date, 'now').mockReturnValue(now);
            jest.spyOn(storage, 'setItem');
            jest.spyOn(smartBanner, 'init');
            jest.spyOn(smartBanner, 'destroy');
        });
        beforeEach(() => {
            smartBanner.init();
            return Utils.flushPromises()
                .then(() => {
                jest.clearAllMocks();
                smartBanner.dismiss(webToken, defaultDismissInterval);
            });
        });
        afterEach(() => {
            localStorage.clear();
        });
        it('banner removed from DOM when dismissed', () => {
            expect.assertions(8);
            expect(storage.setItem).toHaveBeenCalledWith(smartBanner.STORAGE_KEY_DISMISSED, now); // add timestamp in Local Storage
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner dismissed');
            expect(smartBanner.destroy).toHaveBeenCalled();
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), defaultDismissInterval); // next initialisation scheduled
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner creation scheduled on ' + new Date(now + defaultDismissInterval));
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner removed'); // banner removed from DOM
            expect(smartBanner.banner).toBeNull();
            expect(onDismissedCallbackSpy).toHaveBeenCalled();
        });
        it('intialisation reschedules banner display when dismiss interval has not over', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(6);
            smartBanner.init(webToken);
            yield Utils.flushPromises();
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner was dismissed');
            expect(logger_1.default.log).toHaveBeenCalledWith('Clearing previously scheduled creation of Smart Banner');
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), defaultDismissInterval); // initialisation scheduled
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner creation scheduled on ' + new Date(now + defaultDismissInterval));
            expect(onCreatedCallbackSpy).not.toHaveBeenCalled();
            expect(onDismissedCallbackSpy).toHaveBeenCalledTimes(1);
        }));
        it('banner is displayed again when dismiss interval is over', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(7);
            jest.spyOn(Date, 'now').mockReturnValue(now + defaultDismissInterval);
            jest.advanceTimersByTime(defaultDismissInterval);
            expect(smartBanner.init).toHaveBeenCalled();
            yield Utils.flushPromises();
            expect(logger_1.default.log).toHaveBeenCalledWith('Creating Smart Banner');
            expect(document.createElement).toHaveBeenCalled();
            expect(smartBanner.banner).not.toBeNull();
            expect(smartBanner.dismissButton).not.toBeNull();
            expect(logger_1.default.log).toHaveBeenCalledWith('Smart Banner created');
            expect(onCreatedCallbackSpy).toHaveBeenCalled();
            smartBanner.destroy();
        }));
    });
});
//# sourceMappingURL=smart-banner.spec.js.map