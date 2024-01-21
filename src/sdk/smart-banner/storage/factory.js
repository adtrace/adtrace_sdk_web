"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const local_storage_1 = require("./local-storage");
const in_memory_storage_1 = require("./in-memory-storage");
class StorageFactory {
    static isLocalStorageSupported() {
        try {
            const uid = (new Date).toString();
            const storage = window.localStorage;
            storage.setItem(uid, uid);
            const result = storage.getItem(uid) === uid;
            storage.removeItem(uid);
            const support = !!(result && storage);
            return support;
        }
        catch (e) {
            return false;
        }
    }
    static createStorage() {
        if (this.isLocalStorageSupported()) {
            return new local_storage_1.LocalStorage();
        }
        return new in_memory_storage_1.InMemoryStorage();
    }
}
exports.StorageFactory = StorageFactory;
//# sourceMappingURL=factory.js.map