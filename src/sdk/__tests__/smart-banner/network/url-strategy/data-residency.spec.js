"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_residency_1 = require("../../../../smart-banner/network/url-strategy/data-residency");
describe('DataResidency', () => {
    const testEndpoints = {
        [data_residency_1.DataResidency.EU]: {
            endpointName: 'EU',
            app: 'app.eu',
            gdpr: 'gdpr.eu'
        },
        [data_residency_1.DataResidency.TR]: {
            endpointName: 'TR',
            app: 'app.tr',
            gdpr: 'gdpr.tr'
        },
        [data_residency_1.DataResidency.US]: {
            endpointName: 'US',
            app: 'app.us',
            gdpr: 'gdpr.us'
        }
    };
    it.each([
        data_residency_1.DataResidency.EU,
        data_residency_1.DataResidency.TR,
        data_residency_1.DataResidency.US
    ])('returns urls map depending on region', (dataResidency) => {
        const resultingFn = data_residency_1.DataResidency.preferredUrlsGetter(dataResidency, testEndpoints);
        expect(resultingFn).toEqual(expect.any(Function));
        const baseUrlsMap = resultingFn();
        expect(baseUrlsMap.length).toBe(1);
        expect(baseUrlsMap[0]).toEqual(testEndpoints[dataResidency]);
    });
});
//# sourceMappingURL=data-residency.spec.js.map