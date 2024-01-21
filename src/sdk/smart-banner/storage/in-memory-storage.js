"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStorage = void 0;
class InMemoryStorage {
    constructor() {
        this.items = {};
    }
    setItem(key, value) {
        this.items[key] = value;
    }
    getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.items, key) ? this.items[key] : null;
    }
    removeItem(key) {
        delete this.items[key];
    }
}
exports.InMemoryStorage = InMemoryStorage;
//# sourceMappingURL=in-memory-storage.js.map