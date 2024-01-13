"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const utilities_1 = require("../utilities");
class LocalStorage {
    constructor(storageName = 'adtrace-smart-banner') {
        this.storageName = storageName;
    }
    setItem(key, value) {
        localStorage.setItem(`${this.storageName}.${key}`, JSON.stringify(value));
    }
    getItem(key) {
        const value = localStorage.getItem(`${this.storageName}.${key}`);
        return (0, utilities_1.parseJson)(value);
    }
    removeItem(key) {
        localStorage.removeItem(`${this.storageName}.${key}`);
    }
}
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=local-storage.js.map