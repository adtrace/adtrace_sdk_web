"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_storage_1 = require("../../../smart-banner/storage/local-storage");
describe('Local storage', () => {
    const storage = new local_storage_1.LocalStorage;
    beforeAll(() => {
        jest.spyOn(localStorage, 'getItem');
        jest.spyOn(localStorage, 'setItem');
        jest.spyOn(localStorage, 'removeItem');
    });
    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });
    const key = 'test';
    const value = { data: 'test-data' };
    const lsKey = `adtrace-smart-banner.${key}`;
    const lsValue = JSON.stringify(value);
    it('writes record', () => {
        storage.setItem(key, value);
        expect(localStorage.getItem(lsKey)).toEqual(lsValue);
    });
    it('reads stored record', () => {
        localStorage.setItem(lsKey, lsValue);
        const actual = storage.getItem(key);
        expect(actual).toEqual(value);
        expect(localStorage.getItem).toHaveBeenCalled();
    });
    it('removes record', () => {
        localStorage.setItem(lsKey, lsValue);
        storage.removeItem(key);
        expect(localStorage.getItem(lsKey)).toBeNull();
        expect(localStorage.removeItem).toHaveBeenCalled();
    });
    it('returns null when no such record', () => {
        const noExistentValue = storage.getItem(key);
        expect(noExistentValue).toBeNull();
        expect(localStorage.getItem).toHaveBeenCalled();
    });
    it('does not throw on invalid JSON', () => {
        localStorage.setItem(lsKey, '{hello":"world"}');
        let invalidValue;
        expect(() => { invalidValue = storage.getItem(key); }).not.toThrow();
        expect(invalidValue).toBeNull();
    });
});
//# sourceMappingURL=local-storage.spec.js.map