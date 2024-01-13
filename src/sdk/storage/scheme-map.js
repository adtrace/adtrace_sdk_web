"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
const scheme_1 = __importStar(require("./scheme"));
/**
 * Cast value into it's original type
 */
function _parseValue(value) {
    try {
        return JSON.parse(value);
    }
    catch (e) {
        return value;
    }
}
/**
 * Flip key/value pairs
 */
function _flipObject(obj) {
    return (0, utilities_1.entries)(obj)
        .map(([key, value]) => [value, _parseValue(key)])
        .reduce(utilities_1.reducer, {});
}
/**
 * Flip store name definition names:
 * - short key pointing the long one along with additional configuration
 */
function _flipStoreNames(obj) {
    const flippedConfigs = (0, utilities_1.entries)(obj)
        .map(([name, options]) => {
        const config = {
            name,
            permanent: options.permanent
        };
        return [options.name, config];
    });
    return flippedConfigs.reduce(utilities_1.reducer, {});
}
/**
 * Flip store scheme values
 */
function _flipStoreScheme(storeName, key, scheme) {
    const values = (0, scheme_1.isPredefinedValuesField)(scheme) ? { values: _flipObject(scheme.values) } : {};
    const keys = (0, scheme_1.isNestingStoreField)(scheme) ? { keys: _flipScheme(storeName, scheme.keys) } : {};
    const composite = (0, scheme_1.isCompositeKeyStoreField)(scheme) ? { composite: scheme.composite.map(key => _getShortKey(storeName, key)) } : {};
    return Object.assign(Object.assign(Object.assign({ key }, values), keys), composite);
}
/**
 * Flip general scheme recursivelly
 */
function _flipScheme(storeName, fieldsScheme) {
    return (0, utilities_1.entries)(fieldsScheme)
        .map(([key, scheme]) => {
        return (0, scheme_1.isComplexStoreField)(scheme)
            ? [scheme.key, _flipStoreScheme(storeName, key, scheme)]
            : [scheme, key];
    })
        .reduce(utilities_1.reducer, {});
}
/**
 * Extend base scheme with some more maps for encoding
 */
function _prepareLeft() {
    const storesOptions = (0, utilities_1.entries)(scheme_1.default)
        .map(([storeName, store]) => {
        const options = {
            keyPath: store.scheme.keyPath,
            autoIncrement: store.scheme.autoIncrement,
            index: store.scheme.index,
            fields: store.scheme.fields
        };
        return [storeName, options];
    });
    return storesOptions.reduce(utilities_1.reducer, {});
}
/**
 * Prepare scheme for decoding
 */
function _prepareRight() {
    const storesOptionsEncoded = (0, utilities_1.entries)(Left)
        .map(([storeName, storeScheme]) => {
        const options = {
            keyPath: _getShortKey(storeName, storeScheme.keyPath),
            autoIncrement: storeScheme.autoIncrement,
            index: _getShortKey(storeName, storeScheme.index),
            fields: _flipScheme(storeName, storeScheme.fields)
        };
        return [storeName, options];
    });
    return storesOptionsEncoded.reduce(utilities_1.reducer, {});
}
/**
 * Get available values for encoding
 */
function _getValuesMap() {
    // all pairs of predefined keys and values such as {GET: 1}
    return (0, utilities_1.entries)(scheme_1.default)
        .reduce((acc, [, store]) => acc.concat(store.scheme.fields), [])
        .map(scheme => (0, utilities_1.values)(scheme)
        .filter(scheme_1.isPredefinedValuesField)
        .map(map => (0, utilities_1.entries)(map.values))
        .reduce((acc, map) => acc.concat(map), []))
        .reduce((acc, map) => acc.concat(map), [])
        .reduce(utilities_1.reducer, {});
}
/**
 * Get short key version of a specified key
 */
function _getShortKey(storeName, key) {
    if (!key) {
        return undefined;
    }
    const map = scheme_1.default[storeName].scheme.fields[key];
    if ((0, scheme_1.isComplexStoreField)(map)) {
        return map.key;
    }
    return map || key;
}
/**
 * Get store names and their general configuration (if store is permanent or not)
 */
function _getStoreNames() {
    const storeNames = (0, utilities_1.entries)(scheme_1.default)
        .map(([name, store]) => {
        const config = {
            name: store.name,
            permanent: store.permanent
        };
        return [name, config];
    });
    return storeNames.reduce(utilities_1.reducer, {});
}
const Left = _prepareLeft();
const Right = _prepareRight();
const Values = _getValuesMap();
const StoreNamesAndConfigs = _getStoreNames();
exports.default = {
    left: Left,
    right: Right,
    values: Values,
    storeNames: {
        left: StoreNamesAndConfigs,
        right: _flipStoreNames(StoreNamesAndConfigs)
    }
};
//# sourceMappingURL=scheme-map.js.map