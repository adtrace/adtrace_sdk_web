"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeErrorMessage = exports.convertStoreName = exports.encodeValue = exports.convertValues = exports.convertRecords = exports.convertRecord = exports.Direction = void 0;
const utilities_1 = require("../utilities");
const scheme_1 = require("./scheme");
const scheme_map_1 = __importDefault(require("./scheme-map"));
const types_1 = require("./types");
var Direction;
(function (Direction) {
    Direction["right"] = "right";
    Direction["left"] = "left";
})(Direction || (Direction = {}));
exports.Direction = Direction;
/**
 * Get value from the map if available
 */
function _getValue(map, value) {
    return map ? (map[value] !== undefined ? map[value] : value) : value;
}
/**
 * Convert key and value by defined scheme
 */
function _convert(storeName, dir, key, value, scheme) {
    if (!scheme) {
        return [key, value];
    }
    const encodedKey = (0, scheme_1.isComplexStoreField)(scheme) ? scheme.key : scheme;
    if ((0, types_1.valueIsRecord)(value)) {
        const keys = (0, scheme_1.isNestingStoreField)(scheme) ? scheme.keys : null;
        return [
            encodedKey,
            convertRecord(storeName, dir, value, keys)
        ];
    }
    const valuesMap = (0, scheme_1.isPredefinedValuesField)(scheme) ? scheme.values : null;
    return [encodedKey, _getValue(valuesMap, value)];
}
/**
 * Convert record by defined direction and scheme
 * Note: the function signature is duplicated because TS hides function implementation
 */
function convertRecord(storeName, dir, record, scheme) {
    if (!record) {
        return undefined;
    }
    const _scheme = scheme || scheme_map_1.default[dir][convertStoreName(storeName, Direction.right)].fields;
    return (0, utilities_1.entries)(record)
        .map(([key, value]) => _convert(storeName, dir, key, value, _scheme[key]))
        .reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
}
exports.convertRecord = convertRecord;
/**
 * Convert records by defined direction
 */
function convertRecords(storeName, dir, records = []) {
    return records
        .map(record => convertRecord(storeName, dir, record));
}
exports.convertRecords = convertRecords;
/**
 * Convert values by defined direction
 */
function convertValues(storeName, dir, target) {
    const scheme = scheme_map_1.default[dir][convertStoreName(storeName, Direction.right)];
    const keyPathScheme = scheme.fields[scheme.keyPath];
    const values = target instanceof Array ? target.slice() : [target];
    const keys = (0, scheme_1.isCompositeKeyStoreField)(keyPathScheme) ? keyPathScheme.composite : [scheme.keyPath];
    const converted = keys
        .map((key, index) => {
        const field = scheme.fields[key];
        const predefinedValuesMap = (0, scheme_1.isPredefinedValuesField)(field) ? field.values : null;
        return _getValue(predefinedValuesMap, values[index]);
    });
    return converted.length === 1 ? converted[0] : converted;
}
exports.convertValues = convertValues;
/**
 * Encode value by defined scheme
 */
function encodeValue(target) {
    return scheme_map_1.default.values[target] || target;
}
exports.encodeValue = encodeValue;
/**
 * Convert store name by defined direction
 */
function convertStoreName(storeName, dir) {
    return (scheme_map_1.default.storeNames[dir][storeName] || {}).name || storeName;
}
exports.convertStoreName = convertStoreName;
/**
 * Decode error message by replacing short store name with long readable one
 */
function decodeErrorMessage(storeName, error) {
    return {
        name: error.name,
        message: error.message.replace(`"${storeName}"`, convertStoreName(storeName, Direction.right))
    };
}
exports.decodeErrorMessage = decodeErrorMessage;
//# sourceMappingURL=converter.js.map