"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_url_1 = require("../../../../smart-banner/network/url-strategy/custom-url");
describe('CustomUrl', () => {
    it('returns urls map with custom url', () => {
        const url = 'custom.url';
        const expectedUrlMap = {
            endpointName: `Custom (${url})`,
            app: url,
            gdpr: url
        };
        const resultingFn = custom_url_1.CustomUrl.preferredUrlsGetter(url);
        expect(resultingFn).toEqual(expect.any(Function));
        expect(resultingFn()).toEqual([expectedUrlMap]);
    });
});
//# sourceMappingURL=custom-url.spec.js.map