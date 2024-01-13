"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalStorageSupported = exports.isEmptyEntry = exports.values = exports.entries = exports.reducer = exports.getHostName = exports.isRequest = exports.intersection = exports.convertToMap = exports.findIndex = exports.isValidJson = exports.isObject = exports.isEmpty = exports.buildList = void 0;
/**
 * Build human readable list
 */
function buildList(array) {
    if (!array.length) {
        return '';
    }
    if (array.length === 1) {
        return `${array[0]}`;
    }
    const lastIndex = array.length - 1;
    const firstPart = array.slice(0, lastIndex).join(', ');
    return `${firstPart} and ${array[lastIndex]}`;
}
exports.buildList = buildList;
/**
 * Check if object is empty
 */
function isEmpty(obj) {
    return !Object.keys(obj).length && obj.constructor === Object;
}
exports.isEmpty = isEmpty;
/**
 * Check if value is object
 */
function isObject(obj) {
    return typeof obj === 'object' && obj !== null && !(obj instanceof Array);
}
exports.isObject = isObject;
/**
 * Check if string is valid json
 */
function isValidJson(string) {
    try {
        const json = JSON.parse(string);
        return isObject(json);
    }
    catch (e) {
        return false;
    }
}
exports.isValidJson = isValidJson;
/**
 * Find index of an element in the list and return it
 */
function findIndex(array, key, target) {
    function isEqual(item) {
        return (Array.isArray(key))
            ? key.every(k => item[k] === target[k])
            : (item[key] === target);
    }
    for (let i = 0; i < array.length; i += 1) {
        if (isEqual(array[i])) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
/**
 * Convert array with key/value item structure into key/value pairs object
 */
function convertToMap(array = []) {
    return array.reduce((acc, o) => (Object.assign(Object.assign({}, acc), { [o.key]: o.value })), {});
}
exports.convertToMap = convertToMap;
/**
 * Find intersecting values of provided array against given values
 */
function intersection(array = [], values = []) {
    return array.filter(item => values.indexOf(item) !== -1);
}
exports.intersection = intersection;
/**
 * Check if particular url is a certain request
 */
function isRequest(url, requestName) {
    const regex = new RegExp(`\\/${requestName}(\\/.*|\\?.*){0,1}$`);
    return regex.test(url);
}
exports.isRequest = isRequest;
/**
 * Extract the host name for the url
 */
function getHostName(url = '') {
    return url.replace(/^(http(s)*:\/\/)*(www\.)*/, '').split('/')[0].split('?')[0];
}
exports.getHostName = getHostName;
/**
 * Transform array entry into object key:value pair entry
 */
function reducer(acc, [key, value]) {
    return Object.assign(Object.assign({}, acc), { [key]: value });
}
exports.reducer = reducer;
/**
 * Extracts object entries in the [key, value] format
 */
function entries(object) {
    return Object.keys(object).map((key) => [key, object[key]]);
}
exports.entries = entries;
/**
 * Extracts object values
 */
function values(object) {
    return Object.keys(object).map((key) => object[key]);
}
exports.values = values;
/**
 * Check if value is empty in any way (empty object, false value, zero) and use it as predicate method
 */
function isEmptyEntry(value) {
    if (isObject(value)) {
        return !isEmpty(value);
    }
    return !!value || (value === 0);
}
exports.isEmptyEntry = isEmptyEntry;
function isLocalStorageSupported() {
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
exports.isLocalStorageSupported = isLocalStorageSupported;
//# sourceMappingURL=utilities.js.map