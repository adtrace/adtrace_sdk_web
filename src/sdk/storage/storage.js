"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
const utilities_1 = require("../utilities");
const converter_1 = require("./converter");
const indexeddb_1 = require("./indexeddb");
const localstorage_1 = require("./localstorage");
const quick_storage_1 = __importDefault(require("./quick-storage"));
var StorageType;
(function (StorageType) {
    StorageType[StorageType["noStorage"] = constants_1.STORAGE_TYPES.NO_STORAGE] = "noStorage";
    StorageType[StorageType["indexedDB"] = constants_1.STORAGE_TYPES.INDEXED_DB] = "indexedDB";
    StorageType[StorageType["localStorage"] = constants_1.STORAGE_TYPES.LOCAL_STORAGE] = "localStorage";
})(StorageType || (StorageType = {}));
/**
 * Methods to extend
 */
const _methods = {
    getAll: _getAll,
    getFirst: _getFirst,
    getItem: _getItem,
    filterBy: _filterBy,
    addItem: _addItem,
    addBulk: _addBulk,
    updateItem: _updateItem,
    deleteItem: _deleteItem,
    deleteBulk: _deleteBulk,
    trimItems: _trimItems,
    count: _count,
    clear: _clear,
    destroy: _destroy,
    deleteDatabase: _deleteDatabase
};
/**
 * Extends storage's getAll method by decoding returned records
 */
function _getAll(storage, storeName, firstOnly) {
    return storage.getAll(storeName, firstOnly)
        .then(records => (0, converter_1.convertRecords)(storeName, converter_1.Direction.right, records));
}
/**
 * Extends storage's getFirst method by decoding returned record
 */
function _getFirst(storage, storeName) {
    return storage.getFirst(storeName)
        .then(record => (0, converter_1.convertRecord)(storeName, converter_1.Direction.right, record));
}
/**
 * Extends storage's getItem method by encoding target value and then decoding returned record
 */
function _getItem(storage, storeName, target) {
    return storage.getItem(storeName, (0, converter_1.convertValues)(storeName, converter_1.Direction.left, target))
        .then(record => (0, converter_1.convertRecord)(storeName, converter_1.Direction.right, record))
        .catch(error => Promise.reject((0, converter_1.decodeErrorMessage)(storeName, error)));
}
/**
 * Extends storage's filterBy method by encoding target value and then decoding returned records
 */
function _filterBy(storage, storeName, target) {
    return storage.filterBy(storeName, (0, converter_1.encodeValue)(target))
        .then(records => (0, converter_1.convertRecords)(storeName, converter_1.Direction.right, records));
}
/**
 * Extends storage's addItem method by encoding target record and then decoding returned keys
 */
function _addItem(storage, storeName, record) {
    const convertedRecord = (0, converter_1.convertRecord)(storeName, converter_1.Direction.left, record);
    return storage.addItem(storeName, convertedRecord)
        .then(target => (0, converter_1.convertValues)(storeName, converter_1.Direction.right, target))
        .catch(error => Promise.reject((0, converter_1.decodeErrorMessage)(storeName, error)));
}
/**
 * Extends storage's addBulk method by encoding target records and then decoding returned keys
 */
function _addBulk(storage, storeName, records, overwrite) {
    const convertedRecords = (0, converter_1.convertRecords)(storeName, converter_1.Direction.left, records);
    return storage.addBulk(storeName, convertedRecords, overwrite)
        .then(values => values.map(target => (0, converter_1.convertValues)(storeName, converter_1.Direction.right, target)))
        .catch(error => Promise.reject((0, converter_1.decodeErrorMessage)(storeName, error)));
}
/**
 * Extends storage's updateItem method by encoding target record and then decoding returned keys
 */
function _updateItem(storage, storeName, record) {
    const convertedRecord = (0, converter_1.convertRecord)(storeName, converter_1.Direction.left, record);
    return storage.updateItem(storeName, convertedRecord)
        .then(target => (0, converter_1.convertValues)(storeName, converter_1.Direction.right, target));
}
/**
 * Extends storage's deleteItem method by encoding target value and then decoding returned keys
 */
function _deleteItem(storage, storeName, target) {
    return storage.deleteItem(storeName, (0, converter_1.convertValues)(storeName, converter_1.Direction.left, target))
        .then(target => (0, converter_1.convertValues)(storeName, converter_1.Direction.right, target));
}
/**
 * Extends storage's deleteBulk method by encoding target value and then decoding returned records that are deleted
 */
function _deleteBulk(storage, storeName, value, condition) {
    return storage.deleteBulk(storeName, (0, converter_1.encodeValue)(value), condition)
        .then(records => records.map(record => (0, converter_1.convertValues)(storeName, converter_1.Direction.right, record)));
}
/**
 * Extends storage's trimItems method by passing encoded storage name
 */
function _trimItems(storage, storeName, length) {
    return storage.trimItems(storeName, length);
}
/**
 * Extends storage's count method by passing encoded storage name
 */
function _count(storage, storeName) {
    return storage.count(storeName);
}
/**
 * Extends storage's clear method by passing encoded storage name
 */
function _clear(storage, storeName) {
    return storage.clear(storeName);
}
/**
 * Calls storage's destroy method
 */
function _destroy(storage) {
    return storage.destroy();
}
/**
 * Calls storage's deleteDatabase method
 */
function _deleteDatabase(storage) {
    return storage.deleteDatabase();
}
/**
 * Augment whitelisted methods with encoding/decoding functionality
 */
function _augment() {
    const methods = (0, utilities_1.entries)(_methods)
        .map(([methodName, method]) => {
        const augmentedMethod = (storeName, ...args) => {
            return init()
                .then(({ storage }) => {
                if (storage) {
                    return method.call(null, storage, (0, converter_1.convertStoreName)(storeName, converter_1.Direction.left), ...args);
                }
            });
        };
        return [methodName, augmentedMethod];
    });
    return methods.reduce(utilities_1.reducer, {});
}
/**
 * Type of available storage
 */
let type;
/**
 * Returns type of used storage which is one of possible values INDEXED_DB, LOCAL_STORAGE or NO_STORAGE if there is no
 * storage available
 */
function getType() {
    return type;
}
/**
 * Cached promise of Storage initialization
 */
let _initializationPromise = null;
/**
 * Check which storage is available and pick it up
 * Prefer indexedDB over localStorage
 */
function init(dbName) {
    let storage = null;
    if (_initializationPromise !== null) {
        return _initializationPromise;
    }
    else {
        _initializationPromise = Promise.all([indexeddb_1.IndexedDB.isSupported(), localstorage_1.LocalStorage.isSupported()])
            .then(([idbSupported, lsSupported]) => {
            quick_storage_1.default.setCustomName(dbName);
            if (idbSupported) {
                type = StorageType.indexedDB;
                const idb = new indexeddb_1.IndexedDB();
                return idb.setCustomName(dbName).then(() => storage = idb);
            }
            else if (lsSupported) {
                type = StorageType.localStorage;
                storage = new localstorage_1.LocalStorage();
                return Promise.resolve(storage);
            }
            else {
                logger_1.default.error('There is no storage available, app will run with minimum set of features');
                type = StorageType.noStorage;
                storage = null;
                return Promise.resolve(storage);
            }
        })
            .then(() => {
            return {
                type,
                storage
            };
        });
    }
    return _initializationPromise;
}
exports.default = Object.assign({ init,
    getType }, _augment());
//# sourceMappingURL=storage.js.map