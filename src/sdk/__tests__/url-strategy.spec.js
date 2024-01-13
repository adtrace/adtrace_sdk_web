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
Object.defineProperty(exports, "__esModule", { value: true });
const url_strategy_1 = require("../url-strategy");
const Globals = __importStar(require("../globals"));
const Logger = __importStar(require("../logger"));
jest.mock('../logger');
describe('test url strategy', () => {
    const testEndpoints = {
        [url_strategy_1.UrlStrategy.Default]: {
            app: 'app.default',
            gdpr: 'gdpr.default'
        },
        [url_strategy_1.UrlStrategy.India]: {
            app: 'app.india',
            gdpr: 'gdpr.india'
        },
        [url_strategy_1.UrlStrategy.China]: {
            app: 'app.china',
            gdpr: 'gdpr.china'
        },
        [url_strategy_1.DataResidency.EU]: {
            app: 'app.eu',
            gdpr: 'gdpr.eu'
        },
        [url_strategy_1.DataResidency.TR]: {
            app: 'app.tr',
            gdpr: 'gdpr.tr'
        },
        [url_strategy_1.DataResidency.US]: {
            app: 'app.us',
            gdpr: 'gdpr.us'
        }
    };
    let Config;
    const options = {
        appToken: '123abc',
        environment: 'sandbox'
    };
    const env = Globals.default.env;
    beforeAll(() => {
        Globals.default.env = 'development';
        jest.spyOn(Logger.default, 'warn');
    });
    beforeEach(() => {
        Config = require('../config').default;
    });
    afterEach(() => {
        Config.destroy();
        jest.clearAllMocks();
    });
    afterAll(() => {
        Globals.default.env = env;
        jest.restoreAllMocks();
    });
    describe('BaseUrlsIterator tests', () => {
        const iterateThrough = (iterator, iterationsNumber) => {
            const results = [];
            let current;
            let steps = iterationsNumber === undefined ? -1 : iterationsNumber;
            do {
                current = iterator.next();
                if (current.value) {
                    results.push(current.value);
                }
            } while (!current.done && --steps !== 0);
            return results;
        };
        it('returns all values through iteration when default url startegy used', () => {
            const iterator = (0, url_strategy_1.getBaseUrlsIterator)(testEndpoints);
            expect(iterator.next()).toEqual({ value: testEndpoints.default, done: false });
            expect(iterator.next()).toEqual({ value: testEndpoints.india, done: false });
            expect(iterator.next()).toEqual({ value: testEndpoints.china, done: false });
            expect(iterator.next()).toEqual({ value: undefined, done: true });
        });
        it('prefers Indian enpoint and does not try reach Chinese one when india url strategy set', () => {
            Config.set(Object.assign(Object.assign({}, options), { urlStrategy: url_strategy_1.UrlStrategy.India }));
            const values = iterateThrough((0, url_strategy_1.getBaseUrlsIterator)(testEndpoints));
            expect(values.length).toBe(2);
            expect(values[0]).toEqual(testEndpoints.india);
            expect(values[1]).toEqual(testEndpoints.default);
        });
        it('prefers Chinese enpoint and does not try reach Indian one when china url strategy set', () => {
            Config.set(Object.assign(Object.assign({}, options), { urlStrategy: url_strategy_1.UrlStrategy.China }));
            const values = iterateThrough((0, url_strategy_1.getBaseUrlsIterator)(testEndpoints));
            expect(values.length).toBe(2);
            expect(values[0]).toEqual(testEndpoints.china);
            expect(values[1]).toEqual(testEndpoints.default);
        });
        it('does not override custom url', () => {
            const customUrl = 'custom-url';
            Config.set(Object.assign(Object.assign({}, options), { customUrl }));
            const values = iterateThrough((0, url_strategy_1.getBaseUrlsIterator)(testEndpoints));
            expect(values.length).toBe(1);
            expect(values[0]).toEqual({ app: 'custom-url', gdpr: 'custom-url' });
        });
        describe('reset allows to restart iteration', () => {
            it('iterates through all endpoints twice in default order', () => {
                const defaultEndpointsNumber = 3; // number of endpoints to try if default url strategy used
                const iterator = (0, url_strategy_1.getBaseUrlsIterator)(testEndpoints);
                const first = iterateThrough(iterator);
                iterator.reset();
                const second = iterateThrough(iterator);
                expect(first.length).toEqual(defaultEndpointsNumber);
                expect(second.length).toEqual(defaultEndpointsNumber);
                expect(second).toEqual(first);
            });
            it('iterates partially then reset', () => {
                const iterator = (0, url_strategy_1.getBaseUrlsIterator)(testEndpoints);
                const firstIteration = iterateThrough(iterator, 1);
                iterator.reset();
                const secondIteration = iterateThrough(iterator, 2);
                iterator.reset();
                const thirdIteration = iterateThrough(iterator, 3);
                iterator.reset();
                expect(firstIteration.length).toBe(1);
                expect(secondIteration.length).toBe(2);
                expect(thirdIteration.length).toBe(3);
                expect(firstIteration[0]).toEqual(testEndpoints.default);
                expect(secondIteration[0]).toEqual(testEndpoints.default);
                expect(thirdIteration[0]).toEqual(testEndpoints.default);
                expect(secondIteration[1]).toEqual(testEndpoints.india);
                expect(thirdIteration[1]).toEqual(testEndpoints.india);
                expect(thirdIteration[2]).toEqual(testEndpoints.china);
            });
        });
        describe('data residency', () => {
            it.each([
                url_strategy_1.DataResidency.EU,
                url_strategy_1.DataResidency.US,
                url_strategy_1.DataResidency.TR
            ])('tries to reach only regional endpoint if data residency set', (dataResidency) => {
                Config.set(Object.assign(Object.assign({}, options), { dataResidency: dataResidency }));
                const values = iterateThrough((0, url_strategy_1.getBaseUrlsIterator)(testEndpoints));
                expect(values.length).toBe(1);
                expect(values[0]).toEqual(testEndpoints[dataResidency]);
            });
            it.each([
                [url_strategy_1.UrlStrategy.China, url_strategy_1.DataResidency.EU],
                [url_strategy_1.UrlStrategy.China, url_strategy_1.DataResidency.US],
                [url_strategy_1.UrlStrategy.China, url_strategy_1.DataResidency.TR],
                [url_strategy_1.UrlStrategy.India, url_strategy_1.DataResidency.EU],
                [url_strategy_1.UrlStrategy.India, url_strategy_1.DataResidency.US],
                [url_strategy_1.UrlStrategy.India, url_strategy_1.DataResidency.TR]
            ])('drops url strategy if data residency set', (urlStrategy, dataResidency) => {
                Config.set(Object.assign(Object.assign({}, options), { urlStrategy: urlStrategy, dataResidency: dataResidency }));
                const values = iterateThrough((0, url_strategy_1.getBaseUrlsIterator)(testEndpoints));
                expect(Logger.default.warn).toHaveBeenCalledWith('Both dataResidency and urlStrategy are set in config, urlStrategy will be ignored');
                expect(values.length).toBe(1);
                expect(values[0]).toEqual(testEndpoints[dataResidency]);
            });
        });
    });
});
//# sourceMappingURL=url-strategy.spec.js.map