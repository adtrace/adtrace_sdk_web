"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../../../smart-banner/storage/factory");
const local_storage_1 = require("../../../smart-banner/storage/local-storage");
const in_memory_storage_1 = require("../../../smart-banner/storage/in-memory-storage");
jest.mock('../../../smart-banner/storage/local-storage');
jest.mock('../../../smart-banner/storage/in-memory-storage');
describe('StorageFactory', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('creates LocalStorage by default', () => {
        factory_1.StorageFactory.createStorage();
        expect(local_storage_1.LocalStorage).toHaveBeenCalledTimes(1);
        expect(in_memory_storage_1.InMemoryStorage).not.toHaveBeenCalled();
    });
    it('creates InMemoryStorage if LocalStorage not supported', () => {
        jest.spyOn(window, 'localStorage', 'get').mockImplementationOnce(() => {
            throw new Error('EmulatedSecurityError');
        });
        factory_1.StorageFactory.createStorage();
        expect(in_memory_storage_1.InMemoryStorage).toHaveBeenCalledTimes(1);
        expect(local_storage_1.LocalStorage).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=factory.spec.js.map