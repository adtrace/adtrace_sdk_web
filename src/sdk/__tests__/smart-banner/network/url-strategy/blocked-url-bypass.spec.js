"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blocked_url_bypass_1 = require("../../../../smart-banner/network/url-strategy/blocked-url-bypass");
describe('BlockedUrlBypass', () => {
    const testEndpoints = {
        [blocked_url_bypass_1.BlockedUrlBypass.Default]: {
            endpointName: blocked_url_bypass_1.BlockedUrlBypass.Default,
            app: 'app',
            gdpr: 'gdpr'
        },
        [blocked_url_bypass_1.BlockedUrlBypass.India]: {
            endpointName: 'Indian',
            app: 'app.adtrace.net.in',
            gdpr: 'gdpr.adtrace.net.in'
        },
        [blocked_url_bypass_1.BlockedUrlBypass.China]: {
            endpointName: 'Chinese',
            app: 'app.adtrace.world',
            gdpr: 'gdpr.adtrace.world'
        }
    };
    it.each([
        [blocked_url_bypass_1.BlockedUrlBypass.China, 2, [blocked_url_bypass_1.BlockedUrlBypass.Default]],
        [blocked_url_bypass_1.BlockedUrlBypass.India, 2, [blocked_url_bypass_1.BlockedUrlBypass.Default]],
        [blocked_url_bypass_1.BlockedUrlBypass.Default, 3, [blocked_url_bypass_1.BlockedUrlBypass.India, blocked_url_bypass_1.BlockedUrlBypass.China]],
    ])('returns urls map array depending on strategy', (strategy, retriesNumber, nextEndpoints) => {
        const resultingFn = blocked_url_bypass_1.BlockedUrlBypass.preferredUrlsGetter(strategy, testEndpoints);
        expect(resultingFn).toEqual(expect.any(Function));
        const baseUrlsMap = resultingFn();
        expect(baseUrlsMap.length).toEqual(retriesNumber);
        expect(baseUrlsMap[0]).toEqual(testEndpoints[strategy]);
        for (let i = 0; i < nextEndpoints.length; i++) {
            expect(baseUrlsMap[i + 1]).toEqual(testEndpoints[nextEndpoints[i]]);
        }
    });
    it('returns default strategy if option is undefined', () => {
        const resultingFn = blocked_url_bypass_1.BlockedUrlBypass.preferredUrlsGetter(undefined, testEndpoints);
        expect(resultingFn).toEqual(expect.any(Function));
        const baseUrlsMap = resultingFn();
        expect(baseUrlsMap.length).toBe(3);
        expect(baseUrlsMap[0]).toEqual(testEndpoints[blocked_url_bypass_1.BlockedUrlBypass.Default]);
        expect(baseUrlsMap[1]).toEqual(testEndpoints[blocked_url_bypass_1.BlockedUrlBypass.India]);
        expect(baseUrlsMap[2]).toEqual(testEndpoints[blocked_url_bypass_1.BlockedUrlBypass.China]);
    });
});
//# sourceMappingURL=blocked-url-bypass.spec.js.map