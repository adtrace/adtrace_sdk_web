"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const activity_state_1 = __importDefault(require("../activity-state"));
const logger_1 = __importDefault(require("../logger"));
const preferences_1 = require("../preferences");
const utilities_1 = require("../utilities");
const converter_1 = require("./converter");
const quick_storage_1 = __importDefault(require("./quick-storage"));
const scheme_1 = require("./scheme");
const scheme_map_1 = __importDefault(require("./scheme-map"));
const types_1 = require("./types");
class LocalStorageWrapper {
    /**
     * Check if LocalStorage is supported in the current browser
     */
    static isSupported() {
        if (LocalStorageWrapper.isSupportedPromise) {
            return LocalStorageWrapper.isSupportedPromise;
        }
        else {
            LocalStorageWrapper.isSupportedPromise = new Promise((resolve) => {
                const supported = (0, utilities_1.isLocalStorageSupported)();
                if (!supported) {
                    logger_1.default.warn('LocalStorage is not supported in this browser');
                }
                resolve(supported);
            });
        }
        return LocalStorageWrapper.isSupportedPromise;
    }
    /**
     * Prepare schema details if not existent
     */
    open() {
        return LocalStorageWrapper.isSupported()
            .then(supported => {
            if (!supported) {
                return { status: 'error', error: { name: 'LSNotSupported', message: 'LocalStorage is not supported' } };
            }
            const storeNames = scheme_map_1.default.storeNames.left;
            const activityState = activity_state_1.default.current || {};
            const inMemoryAvailable = activityState && !(0, utilities_1.isEmpty)(activityState);
            (0, utilities_1.entries)(storeNames)
                .filter(([, store]) => !store.permanent)
                .forEach(([longStoreName, store]) => {
                const shortStoreName = store.name;
                if (shortStoreName === scheme_1.ShortStoreName.ActivityState && !quick_storage_1.default.stores[shortStoreName]) {
                    quick_storage_1.default.stores[shortStoreName] = inMemoryAvailable
                        ? [(0, converter_1.convertRecord)(longStoreName, converter_1.Direction.left, activityState)]
                        : [];
                }
                else if (!quick_storage_1.default.stores[shortStoreName]) {
                    quick_storage_1.default.stores[shortStoreName] = [];
                }
            });
            (0, preferences_1.recover)();
            return { status: 'success' };
        });
    }
    /**
     * Get list of composite keys if available
     */
    getCompositeKeys(options) {
        const field = options.fields[options.keyPath];
        return (0, scheme_1.isCompositeKeyStoreField)(field) ? field.composite : null;
    }
    /**
     * Get composite keys when defined or fallback to primary key for particular store
     */
    getKeys(storeName) {
        const name = (0, converter_1.convertStoreName)(storeName, converter_1.Direction.right);
        const options = scheme_map_1.default.right[name];
        return this.getCompositeKeys(options) || [options.keyPath];
    }
    /**
     * Return next index using the current one and undefined if current is undefined
     */
    nextIndex(current) {
        return typeof current === 'number' ? current + 1 : undefined;
    }
    /**
     * Initiate quasi-database request
     */
    initRequest({ storeName, id, item }, action) {
        const options = scheme_map_1.default.right[(0, converter_1.convertStoreName)(storeName, converter_1.Direction.right)];
        return this.open()
            .then(open => {
            if (open.status === 'error') {
                return Promise.reject(open.error);
            }
            return new Promise((resolve, reject) => {
                const items = quick_storage_1.default.stores[storeName];
                const keys = this.getKeys(storeName);
                const lastId = ((items[items.length - 1] || {})[options.keyPath] || 0);
                let target;
                if (!id) {
                    target = Object.assign({}, item);
                }
                else {
                    const ids = Array.isArray(id) ? id.slice() : [id];
                    target = keys
                        .map((key, index) => [key, ids[index]])
                        .reduce(utilities_1.reducer, {});
                }
                const index = target ? (0, utilities_1.findIndex)(items, keys, target) : 0;
                return action(resolve, reject, { keys, items, index, options, lastId });
            });
        });
    }
    /**
     * Sort the array by provided key (key can be a composite one)
     * - by default sorts in ascending order by primary keys
     * - force order by provided value
     */
    sort(items, keys, exact) {
        const clone = [...items];
        const reversed = keys.slice().reverse();
        function compare(a, b, key) {
            const expr1 = exact ? exact === a[key] : a[key] < b[key];
            const expr2 = exact ? exact > a[key] : a[key] > b[key];
            return expr1 ? -1 : (expr2 ? 1 : 0);
        }
        return clone.sort((a, b) => reversed
            .reduce((acc, key) => {
            return acc || compare(a, b, key);
        }, 0));
    }
    /**
     * Prepare the target to be queried depending on the composite key if defined
     */
    prepareTarget(options, target, next) {
        const composite = this.getCompositeKeys(options);
        return composite
            ? Object.assign({ [options.keyPath]: composite.map(key => target[key]).join('') }, target) : options.autoIncrement && next
            ? Object.assign({ [options.keyPath]: next }, target) : Object.assign({}, target);
    }
    /**
     * Prepare the result to be return depending on the composite key definition
     */
    prepareResult(options, target) {
        const composite = this.getCompositeKeys(options);
        if (composite) {
            return composite
                .map(key => target[key])
                .filter((value) => !(0, types_1.valueIsRecord)(value));
        }
        return target[options.keyPath];
    }
    /**
     * Get all records from particular store
     */
    getAll(storeName, firstOnly = false) {
        return this.open()
            .then(open => {
            if (open.status === 'error') {
                return Promise.reject(open.error);
            }
            return new Promise((resolve, reject) => {
                const value = quick_storage_1.default.stores[storeName];
                if (value instanceof Array) {
                    resolve(firstOnly ? [value[0]] : this.sort(value, this.getKeys(storeName)));
                }
                else {
                    reject({ name: 'NotFoundError', message: `No objectStore named ${storeName} in this database` });
                }
            });
        });
    }
    /**
     * Get the first row from the store
     */
    getFirst(storeName) {
        return this.getAll(storeName, true)
            .then(all => all.length ? all[0] : undefined);
    }
    /**
     * Get item from a particular store
     */
    getItem(storeName, id) {
        const action = (resolve, reject, { items, index, options }) => {
            if (index === -1) {
                reject({ name: 'NotRecordFoundError', message: `Requested record not found in "${storeName}" store` });
            }
            else {
                resolve(this.prepareTarget(options, items[index]));
            }
        };
        return this.initRequest({ storeName, id }, action);
    }
    /**
     * Return filtered result by value on available index
     */
    filterBy(storeName, by) {
        return this.getAll(storeName)
            .then((result) => {
            return result.filter(item => {
                const store = scheme_map_1.default.right[(0, converter_1.convertStoreName)(storeName, converter_1.Direction.right)];
                const indexedValue = store.index && item[store.index];
                return indexedValue === by;
            });
        });
    }
    /**
     * Add item to a particular store
     */
    addItem(storeName, item) {
        return this.initRequest({ storeName, item }, (resolve, reject, { items, index, options, lastId }) => {
            if (index !== -1) {
                reject({ name: 'ConstraintError', message: `Constraint was not satisfied, trying to add existing item into "${storeName}" store` });
            }
            else {
                items.push(this.prepareTarget(options, item, this.nextIndex(lastId)));
                quick_storage_1.default.stores[storeName] = items;
                resolve(this.prepareResult(options, item));
            }
        });
    }
    /**
     * Add multiple items into particular store
     */
    addBulk(storeName, target, overwrite) {
        return this.initRequest({ storeName }, (resolve, reject, { keys, items, options, lastId }) => {
            if (!target || target && !target.length) {
                reject({ name: 'NoTargetDefined', message: `No array provided to perform add bulk operation into "${storeName}" store` });
                return;
            }
            let id = lastId;
            const newItems = target.map(item => this.prepareTarget(options, item, id = this.nextIndex(id)));
            const overlapping = newItems
                .filter(item => (0, utilities_1.findIndex)(items, keys, item) !== -1)
                .map(item => item[options.keyPath]);
            const currentItems = overwrite ? items.filter(item => overlapping.indexOf(item[options.keyPath]) === -1) : [...items];
            if (overlapping.length && !overwrite) {
                reject({ name: 'ConstraintError', message: `Constraint was not satisfied, trying to add existing items into "${storeName}" store` });
            }
            else {
                quick_storage_1.default.stores[storeName] = this.sort([...currentItems, ...newItems], keys);
                const result = target.map(item => this.prepareResult(options, item));
                resolve(result);
            }
        });
    }
    /**
     * Update item in a particular store
     */
    updateItem(storeName, item) {
        return this.initRequest({ storeName, item }, (resolve, _, { items, index, options, lastId }) => {
            const nextId = index === -1 ? this.nextIndex(lastId) : undefined;
            const target = this.prepareTarget(options, item, nextId);
            if (index === -1) {
                items.push(target);
            }
            else {
                items.splice(index, 1, target);
            }
            quick_storage_1.default.stores[storeName] = items;
            resolve(this.prepareResult(options, item));
        });
    }
    /**
     * Delete item from a particular store
     */
    deleteItem(storeName, id) {
        return this.initRequest({ storeName, id }, (resolve, _, { items, index }) => {
            if (index !== -1) {
                items.splice(index, 1);
                quick_storage_1.default.stores[storeName] = items;
            }
            resolve(id);
        });
    }
    /**
     * Find index of the item with the closest value to the bound
     */
    findMax(array, key, value) {
        if (!array.length) {
            return -1;
        }
        let max = { index: -1, value: (typeof value === 'string' ? '' : 0) };
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][key] <= value) {
                if (array[i][key] >= max.value) {
                    max = { value: array[i][key], index: i };
                }
            }
            else {
                return max.index;
            }
        }
        return max.index;
    }
    /**
     * Delete items until certain bound (primary key as a bound scope)
     * Returns array of deleted elements
     */
    deleteBulk(storeName, value, condition) {
        return this.getAll(storeName)
            .then((items) => {
            const keys = this.getKeys(storeName);
            const key = scheme_map_1.default.right[(0, converter_1.convertStoreName)(storeName, converter_1.Direction.right)].index || keys[0];
            const exact = condition ? null : value;
            const sorted = this.sort(items, keys, exact);
            const index = this.findMax(sorted, key, value);
            if (index === -1) {
                return [];
            }
            const start = condition === types_1.KeyRangeCondition.LowerBound ? index : 0;
            const end = !condition || condition === types_1.KeyRangeCondition.UpperBound ? (index + 1) : sorted.length;
            const deleted = sorted
                .splice(start, end)
                .map(item => keys.length === 1
                ? item[key]
                : keys.map(k => item[k]));
            quick_storage_1.default.stores[storeName] = sorted;
            return deleted;
        });
    }
    /**
     * Trim the store from the left by specified length
     */
    trimItems(storeName, length) {
        const convertedName = (0, converter_1.convertStoreName)(storeName, converter_1.Direction.right);
        const options = scheme_map_1.default.right[convertedName];
        return this.getAll(storeName)
            .then((records) => records.length ? records[length - 1] : null)
            .then(record => record ? this.deleteBulk(storeName, record[options.keyPath], types_1.KeyRangeCondition.UpperBound) : []);
    }
    /**
     * Count the number of records in the store
     */
    count(storeName) {
        return this.open()
            .then(open => {
            if (open.status === 'error') {
                return Promise.reject(open.error);
            }
            const records = quick_storage_1.default.stores[storeName];
            return Promise.resolve(records instanceof Array ? records.length : 1);
        });
    }
    /**
     * Clear all records from a particular store
     */
    clear(storeName) {
        return this.open()
            .then(open => {
            if (open.status === 'error') {
                return Promise.reject(open.error);
            }
            return new Promise(resolve => {
                quick_storage_1.default.stores[storeName] = [];
                resolve();
            });
        });
    }
    /**
     * Does nothing, it simply matches the common storage interface
     */
    destroy() { } // eslint-disable-line
    /**
     * Does nothing, it simply matches the common storage interface
     */
    deleteDatabase() { } // eslint-disable-line
}
exports.LocalStorage = LocalStorageWrapper;
/**
 * Cached promise of LocalStorage validation
 */
LocalStorageWrapper.isSupportedPromise = null;
//# sourceMappingURL=localstorage.js.map