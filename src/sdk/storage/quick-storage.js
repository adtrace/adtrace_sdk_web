"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
const utilities_1 = require("../utilities");
const globals_1 = __importDefault(require("../globals"));
const scheme_map_1 = __importDefault(require("./scheme-map"));
const scheme_1 = require("./scheme");
const utilities_2 = require("../utilities");
class InMemoryStorage {
    constructor() {
        this.items = {};
    }
    getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.items, key) ? this.items[key] : null;
    }
    removeItem(key) {
        delete this.items[key];
    }
    setItem(key, value) {
        this.items[key] = value;
    }
}
class QuickStorage {
    constructor() {
        this.defaultName = globals_1.default.namespace;
        this.storageName = this.defaultName;
        this.storeNames = scheme_map_1.default.storeNames.left;
        this.storesMap = {};
        if ((0, utilities_2.isLocalStorageSupported)()) {
            this.storage = window.localStorage;
        }
        else {
            this.storage = new InMemoryStorage();
        }
        const read = this.read.bind(this);
        const write = this.write.bind(this);
        (0, utilities_1.values)(this.storeNames)
            .forEach((store) => {
            const shortStoreName = store.name;
            Object.defineProperty(this.storesMap, shortStoreName, {
                get() { return read(shortStoreName); },
                set(value) { write(shortStoreName, value); }
            });
        });
        Object.freeze(this.storesMap);
    }
    /**
     * Get the value for specified key
     */
    read(key) {
        const valueToParse = this.storage.getItem(`${this.storageName}.${key}`);
        const value = valueToParse ? JSON.parse(valueToParse) : null;
        if (key === scheme_1.ShortPreferencesStoreName.Preferences && value) {
            return (0, converter_1.convertRecord)(scheme_1.ShortPreferencesStoreName.Preferences, converter_1.Direction.right, value);
        }
        return value;
    }
    /**
     * Set the value for specified key
     */
    write(key, value) {
        if (!value) {
            this.storage.removeItem(`${this.storageName}.${key}`);
        }
        else {
            this.storage.setItem(`${this.storageName}.${key}`, JSON.stringify(value instanceof Array
                ? value
                : (0, converter_1.convertRecord)(scheme_1.ShortPreferencesStoreName.Preferences, converter_1.Direction.left, value)));
        }
    }
    /**
     * Clear all data related to the sdk
     */
    clear() {
        this.deleteData();
    }
    /**
     * Clear all data related to the sdk
     *
     * @param wipe if true then also remove permanent data such as user's preferences
     */
    deleteData(wipe = false) {
        (0, utilities_1.values)(this.storeNames)
            .forEach((store) => {
            if (wipe || !store.permanent) {
                this.storage.removeItem(`${this.storageName}.${store.name}`);
            }
        });
    }
    /**
     * Sets custom name to use in data keys and updates existing keys in localStorage
     */
    setCustomName(customName) {
        if (!customName || !customName.length) {
            return;
        }
        const newName = `${globals_1.default.namespace}-${customName}`;
        // Clone data
        (0, utilities_1.values)(this.storeNames)
            .forEach((store) => {
            const key = store.name;
            const rawData = this.storage.getItem(`${this.storageName}.${key}`); // Get data from the store, no need to encode it
            if (rawData) {
                this.storage.setItem(`${newName}.${key}`, rawData); // Put data into a new store
            }
        });
        this.deleteData(true);
        this.storageName = newName;
    }
    get stores() { return this.storesMap; }
}
exports.default = new QuickStorage();
//# sourceMappingURL=quick-storage.js.map