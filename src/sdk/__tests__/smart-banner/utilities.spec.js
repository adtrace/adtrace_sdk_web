"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../smart-banner/utilities");
describe('Utilities tests', () => {
    describe('parseJson', () => {
        it('returns parsed object for valid JSON string', () => {
            const expectedObj = { key: 'value' };
            const stringToParse = '{"key": "value"}';
            expect((0, utilities_1.parseJson)(stringToParse)).toEqual(expectedObj);
        });
        it('returns null for invalid JSON string', () => {
            const stringToParse = '{"key": "value}';
            expect((0, utilities_1.parseJson)(stringToParse)).toBeNull();
        });
        it('returns null for no parameter or empty one passed', () => {
            expect((0, utilities_1.parseJson)(null)).toBeNull();
            expect((0, utilities_1.parseJson)(undefined)).toBeNull();
            expect((0, utilities_1.parseJson)('')).toBeNull();
        });
    });
});
//# sourceMappingURL=utilities.spec.js.map