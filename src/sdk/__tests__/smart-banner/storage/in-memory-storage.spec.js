"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_storage_1 = require("../../../smart-banner/storage/in-memory-storage");
describe('In-memory storage', () => {
    let storage;
    beforeEach(() => {
        storage = new in_memory_storage_1.InMemoryStorage;
    });
    const key = 'test';
    const value = { data: 'test-data' };
    it('writes record', () => {
        storage.setItem(key, value);
        expect(storage['items'][key]).toEqual(value);
    });
    it('reads stored record', () => {
        storage['items'][key] = value;
        const actual = storage.getItem(key);
        expect(actual).toEqual(value);
    });
    it('removes record', () => {
        storage['items'][key] = value;
        expect(storage.getItem(key)).toEqual(value);
        storage.removeItem(key);
        expect(storage['items'][key]).toBeUndefined();
    });
    it('returns null when no such record', () => {
        const noExistentValue = storage.getItem(key);
        expect(noExistentValue).toBeNull();
    });
});
//# sourceMappingURL=in-memory-storage.spec.js.map