"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedDB = void 0;
const activity_state_1 = __importDefault(require("../activity-state"));
const globals_1 = __importDefault(require("../globals"));
const logger_1 = __importDefault(require("../logger"));
const preferences_1 = require("../preferences");
const quick_storage_1 = __importDefault(require("../storage/quick-storage"));
const utilities_1 = require("../utilities");
const converter_1 = require("./converter");
const scheme_1 = require("./scheme");
const scheme_map_1 = __importDefault(require("./scheme-map"));
const types_1 = require("./types");
var Action;
(function (Action) {
    Action["add"] = "add";
    Action["put"] = "put";
    Action["get"] = "get";
    Action["list"] = "list";
    Action["clear"] = "clear";
    Action["delete"] = "delete";
})(Action || (Action = {}));
var AccessMode;
(function (AccessMode) {
    AccessMode["readonly"] = "readonly";
    AccessMode["readwrite"] = "readwrite";
})(AccessMode || (AccessMode = {}));
class IndexedDBWrapper {
    constructor() {
        this.dbDefaultName = globals_1.default.namespace;
        this.dbName = this.dbDefaultName;
        this.dbVersion = 1;
        this.indexedDbConnection = null;
        this.notSupportedError = { name: 'IDBNotSupported', message: 'IndexedDB is not supported' };
        this.databaseOpenError = { name: 'CannotOpenDatabaseError', message: 'Cannot open a database' };
        this.noConnectionError = { name: 'NoDatabaseConnection', message: 'Cannot open a transaction' };
        const idb = IndexedDBWrapper.getIndexedDB();
        if (!idb) {
            throw this.notSupportedError;
        }
        this.idbFactory = idb;
    }
    /**
     * Tries to open a temporary database
     */
    static tryOpen(db) {
        return new Promise((resolve) => {
            try {
                const request = db.open(IndexedDBWrapper.dbValidationName);
                request.onsuccess = () => {
                    request.result.close();
                    db.deleteDatabase(IndexedDBWrapper.dbValidationName);
                    resolve(true);
                };
                request.onerror = () => resolve(false);
            }
            catch (error) {
                resolve(false);
            }
        });
    }
    /**
     * Check if IndexedDB is supported in the current browser (exclude iOS forcefully)
     */
    static isSupported() {
        if (IndexedDBWrapper.isSupportedPromise) {
            return IndexedDBWrapper.isSupportedPromise;
        }
        else {
            const notSupportedMessage = 'IndexedDB is not supported in this browser';
            IndexedDBWrapper.isSupportedPromise = new Promise((resolve) => {
                const indexedDB = IndexedDBWrapper.getIndexedDB();
                const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
                if (!indexedDB || iOS) {
                    logger_1.default.warn(notSupportedMessage);
                    resolve(false);
                }
                else {
                    const dbOpenablePromise = IndexedDBWrapper.tryOpen(indexedDB)
                        .then((dbOpenable) => {
                        if (!dbOpenable) {
                            logger_1.default.warn(notSupportedMessage);
                        }
                        return dbOpenable;
                    });
                    resolve(dbOpenablePromise);
                }
            });
        }
        return IndexedDBWrapper.isSupportedPromise;
    }
    /**
     * Get indexedDB instance
     */
    static getIndexedDB() {
        return window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB;
    }
    /**
     * Sets custom name if provided and migrates database
     */
    setCustomName(customName) {
        if (customName && customName.length > 0) {
            this.dbName = `${globals_1.default.namespace}-${customName}`;
            return this.migrateDb(this.dbDefaultName, this.dbName);
        }
        return Promise.resolve();
    }
    /**
     * Opens database with defined name and resolves with database connection if successed
     * @param name name of database to open
     * @param version optional version of database schema
     * @param upgradeCallback optional `IDBOpenRequest.onupgradeneeded` event handler
     */
    openDatabase(name, upgradeCallback, version) {
        return IndexedDBWrapper.isSupported()
            .then(supported => {
            if (!supported) {
                return Promise.reject(this.notSupportedError);
            }
            else {
                return new Promise((resolve, reject) => {
                    const request = this.idbFactory.open(name, version);
                    if (upgradeCallback) {
                        request.onupgradeneeded = (event) => upgradeCallback(event, reject);
                    }
                    request.onsuccess = (event) => {
                        const connection = event.target.result;
                        if (connection) {
                            resolve(connection);
                        }
                        else {
                            reject(this.databaseOpenError);
                        }
                    };
                    request.onerror = reject;
                });
            }
        });
    }
    /**
     * Checks if database with passed name exists
     */
    databaseExists(name) {
        return new Promise((resolve) => {
            let existed = true;
            this.openDatabase(name, () => { existed = false; })
                .then(connection => {
                connection.close();
                if (existed) {
                    return;
                }
                // We didn't have this database before the check, so remove it
                return this.deleteDatabaseByName(name);
            })
                .then(() => resolve(existed));
        });
    }
    cloneData(defaultDbConnection, customDbConnection) {
        // Function to clone a single store
        const cloneStore = (storeName) => {
            const connection = this.indexedDbConnection;
            this.indexedDbConnection = defaultDbConnection;
            return this.getAll(storeName) // Get all records from default-named database
                .then(records => {
                this.indexedDbConnection = customDbConnection;
                if (records.length < 1) { // There is no records in the store
                    return;
                }
                return this.addBulk(storeName, records, true); // Put all records into custom-named database
            })
                .then(() => {
                this.indexedDbConnection = connection; // Restore initial state
            });
        };
        // Type guard to filter stores
        function isStoreName(key) {
            return key !== 'p';
        }
        // Get names of stores
        const storeNames = (0, utilities_1.values)(scheme_map_1.default.storeNames.left)
            .map(store => store.name)
            .filter(isStoreName);
        const cloneStorePromises = storeNames.map(name => () => cloneStore(name));
        // Run clone operations one by one
        return cloneStorePromises.reduce((previousTask, currentTask) => previousTask.then(currentTask), Promise.resolve());
    }
    /**
     * Migrates created database with default name to custom
     * The IndexedDb API doesn't provide method to rename existing database so we have to create a new database, clone
     * data and remove the old one.
     */
    migrateDb(defaultName, customName) {
        return this.databaseExists(defaultName)
            .then((defaultExists) => {
            if (defaultExists) {
                // Migration hadn't finished yet
                return Promise.all([
                    this.openDatabase(defaultName, this.handleUpgradeNeeded, this.dbVersion),
                    this.openDatabase(customName, this.handleUpgradeNeeded, this.dbVersion), // Open or create a new database, migrate version if needed
                ])
                    .then(([defaultDbConnection, customDbConnection]) => {
                    return this.cloneData(defaultDbConnection, customDbConnection)
                        .then(() => {
                        this.indexedDbConnection = customDbConnection;
                        defaultDbConnection.close();
                        return this.deleteDatabaseByName(defaultName);
                    });
                })
                    .then(() => logger_1.default.info('Database migration finished'));
            }
            else {
                // There is no default-named database, let's just create or open a custom-named one
                return this.openDatabase(customName, this.handleUpgradeNeeded, this.dbVersion)
                    .then(customDbConnection => { this.indexedDbConnection = customDbConnection; });
            }
        });
    }
    /**
     * Handle database upgrade/initialization
     * - store activity state from memory if database unexpectedly got lost in the middle of the window session
     * - migrate data from localStorage if available on browser upgrade
     */
    handleUpgradeNeeded(e, reject) {
        const db = e.target.result;
        e.target.transaction.onerror = reject;
        e.target.transaction.onabort = reject;
        const storeNames = scheme_map_1.default.storeNames.left;
        const activityState = activity_state_1.default.current || {};
        const inMemoryAvailable = activityState && !(0, utilities_1.isEmpty)(activityState);
        (0, utilities_1.entries)(storeNames)
            .filter(([, store]) => !store.permanent)
            .forEach(([longStoreName, store]) => {
            const shortStoreName = store.name;
            const options = scheme_map_1.default.right[longStoreName];
            const objectStore = db.createObjectStore(shortStoreName, {
                keyPath: options.keyPath,
                autoIncrement: options.autoIncrement || false
            });
            if (options.index) {
                objectStore.createIndex(`${options.index}Index`, options.index);
            }
            if (shortStoreName === scheme_1.ShortStoreName.ActivityState && inMemoryAvailable) {
                objectStore.add((0, converter_1.convertRecord)(longStoreName, converter_1.Direction.left, activityState));
                logger_1.default.info('Activity state has been recovered');
                return;
            }
            const localStorageRecord = quick_storage_1.default.stores[shortStoreName];
            if (localStorageRecord) {
                localStorageRecord.forEach(record => objectStore.add(record));
                logger_1.default.info(`Migration from localStorage done for ${longStoreName} store`);
            }
        });
        (0, preferences_1.recover)();
        quick_storage_1.default.clear();
    }
    /**
     * Open the database connection and create store if not existent
     */
    open() {
        if (this.indexedDbConnection) {
            return Promise.resolve({ success: true });
        }
        return this.openDatabase(this.dbName, this.handleUpgradeNeeded, this.dbVersion)
            .then(connection => {
            this.indexedDbConnection = connection;
            this.indexedDbConnection.onclose = () => this.destroy;
            return ({ success: true });
        });
    }
    /**
     * Get transaction and the store
     */
    getTransactionStore({ storeName, mode }, reject, db) {
        const transaction = db.transaction([storeName], mode);
        const store = transaction.objectStore(storeName);
        const options = scheme_map_1.default.right[(0, converter_1.convertStoreName)(storeName, converter_1.Direction.right)];
        let index;
        if (options.index) {
            index = store.index(`${options.index}Index`);
        }
        transaction.onerror = reject;
        transaction.onabort = reject;
        return { transaction, store, index, options };
    }
    /**
     * Override the error by extracting only name and message of the error
     */
    overrideError(reject, error) {
        const { name, message } = error.target.error;
        return reject({ name, message });
    }
    /**
     * Get list of composite keys if available
     */
    getCompositeKeys(options) {
        const keyField = options.fields[options.keyPath];
        return (0, scheme_1.isCompositeKeyStoreField)(keyField) ? keyField.composite : null;
    }
    /**
     * Check if target is an object
     */
    targetIsObject(target) {
        return (0, utilities_1.isObject)(target);
    }
    /**
     * Prepare the target to be queried depending on the composite key if defined
     */
    prepareTarget(options, target, action) {
        if (action === Action.clear || !target) {
            return null; // No target needed when we clear the whole store
        }
        const composite = this.getCompositeKeys(options);
        const needObjectTarget = [Action.add, Action.put].indexOf(action) !== -1;
        if (needObjectTarget) {
            if (this.targetIsObject(target)) { // target is a StoredRecord
                // extend target with composite path if needed and return it
                return composite ? Object.assign({ [options.keyPath]: composite.map(key => target[key]).join('') }, target) : target;
            }
            return null;
        }
        // target is StoredRecordId (plain or composite)
        return (target instanceof Array) ? target.join('') : target;
    }
    /**
     * Prepare the result to be return depending on the composite key definition
     */
    prepareResult(options, target) {
        const composite = this.getCompositeKeys(options);
        if (composite && this.targetIsObject(target)) {
            return composite.map(key => target[key]);
        }
        return null;
    }
    /**
     * Initiate the database request
     */
    initRequest({ storeName, target = null, action, mode = AccessMode.readonly }) {
        return this.open()
            .then(() => {
            return new Promise((resolve, reject) => {
                if (!this.indexedDbConnection) {
                    reject(this.noConnectionError);
                }
                else {
                    const { store, options } = this.getTransactionStore({ storeName, mode }, reject, this.indexedDbConnection);
                    const request = store[action](this.prepareTarget(options, target, action));
                    const result = this.prepareResult(options, target);
                    request.onsuccess = () => {
                        if (action === Action.get && !request.result) {
                            reject({ name: 'NotRecordFoundError', message: `Requested record not found in "${storeName}" store` });
                        }
                        else {
                            resolve(result || request.result || target);
                        }
                    };
                    request.onerror = (error) => this.overrideError(reject, error);
                }
            });
        });
    }
    /**
     * Initiate bulk database request by reusing the same transaction to perform the operation
     */
    initBulkRequest({ storeName, target, action, mode = AccessMode.readwrite }) {
        if (!target || target && !target.length) {
            return Promise.reject({ name: 'NoTargetDefined', message: `No array provided to perform ${action} bulk operation into "${storeName}" store` });
        }
        return this.open()
            .then(() => {
            return new Promise((resolve, reject) => {
                if (!this.indexedDbConnection) {
                    reject(this.noConnectionError);
                }
                else {
                    const { transaction, store, options } = this.getTransactionStore({ storeName, mode }, reject, this.indexedDbConnection);
                    // Array contains or StoredRecord either RecordIds, but not both at the same time
                    const result = new Array();
                    let current = target[0];
                    transaction.oncomplete = () => resolve(result);
                    const request = (req) => {
                        req.onerror = error => this.overrideError(reject, error);
                        req.onsuccess = () => {
                            result.push(this.prepareResult(options, current) || req.result);
                            current = target[result.length];
                            if (result.length < target.length) {
                                request(store[action](this.prepareTarget(options, current, action)));
                            }
                        };
                    };
                    request(store[action](this.prepareTarget(options, current, action)));
                }
            });
        });
    }
    /**
     * Open cursor for bulk operations or listing
     */
    openCursor({ storeName, action, range = null, firstOnly = false, mode = AccessMode.readonly }) {
        return this.open()
            .then(() => {
            return new Promise((resolve, reject) => {
                if (!this.indexedDbConnection) {
                    reject(this.noConnectionError);
                }
                else {
                    const { transaction, store, index, options } = this.getTransactionStore({ storeName, mode }, reject, this.indexedDbConnection);
                    const cursorRequest = (index || store).openCursor(range);
                    const items = new Array();
                    transaction.oncomplete = () => resolve(items);
                    cursorRequest.onsuccess = e => {
                        const cursor = e.target.result;
                        if (cursor) {
                            if (action === Action.delete) {
                                cursor.delete();
                                items.push(this.prepareResult(options, cursor.value) || cursor.value[options.keyPath]);
                            }
                            else {
                                items.push(cursor.value);
                            }
                            if (!firstOnly) {
                                cursor.continue();
                            }
                        }
                    };
                    cursorRequest.onerror = error => this.overrideError(reject, error);
                }
            });
        });
    }
    deleteDatabaseByName(dbName) {
        return new Promise((resolve, reject) => {
            const request = this.idbFactory.deleteDatabase(dbName);
            request.onerror = error => this.overrideError(reject, error);
            request.onsuccess = () => resolve();
            request.onblocked = e => reject(e.target);
        });
    }
    /**
     * Get all records from particular store
     */
    getAll(storeName, firstOnly = false) {
        return this.openCursor({ storeName, action: Action.list, firstOnly });
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
    getItem(storeName, target) {
        return this.initRequest({ storeName, target, action: Action.get });
    }
    /**
     * Return filtered result by value on available index
     */
    filterBy(storeName, by) {
        const range = IDBKeyRange.only(by);
        return this.openCursor({ storeName, action: Action.list, range });
    }
    /**
     * Add item to a particular store
     */
    addItem(storeName, target) {
        return this.initRequest({ storeName, target, action: Action.add, mode: AccessMode.readwrite });
    }
    /**
     * Add multiple items into particular store
     */
    addBulk(storeName, target, overwrite) {
        return this.initBulkRequest({
            storeName,
            target,
            action: (overwrite ? Action.put : Action.add),
            mode: AccessMode.readwrite
        });
    }
    /**
     * Update item in a particular store
     */
    updateItem(storeName, target) {
        return this.initRequest({ storeName, target, action: Action.put, mode: AccessMode.readwrite });
    }
    /**
     * Delete item from a particular store
     */
    deleteItem(storeName, target) {
        return this.initRequest({
            storeName,
            target,
            action: Action.delete,
            mode: AccessMode.readwrite
        });
    }
    /**
     * Delete items until certain bound (primary key as a bound scope)
     */
    deleteBulk(storeName, value, condition) {
        const range = condition
            ? IDBKeyRange[condition](value)
            : IDBKeyRange.only(value);
        return this.openCursor({
            storeName,
            action: Action.delete,
            range,
            mode: AccessMode.readwrite
        });
    }
    /**
     * Trim the store from the left by specified length
     */
    trimItems(storeName, length) {
        const options = scheme_map_1.default.right[(0, converter_1.convertStoreName)(storeName, converter_1.Direction.right)];
        return this.getAll(storeName)
            .then(records => records.length ? records[length - 1] : null)
            .then(record => record ? this.deleteBulk(storeName, record[options.keyPath], types_1.KeyRangeCondition.UpperBound) : []);
    }
    /**
     * Count the number of records in the store
     */
    count(storeName) {
        return this.open()
            .then(() => {
            return new Promise((resolve, reject) => {
                if (!this.indexedDbConnection) {
                    reject(this.noConnectionError);
                }
                else {
                    const { store } = this.getTransactionStore({ storeName, mode: AccessMode.readonly }, reject, this.indexedDbConnection);
                    const request = store.count();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = error => this.overrideError(reject, error);
                }
            });
        });
    }
    /**
     * Clear all records from a particular store
     */
    clear(storeName) {
        return this.initRequest({ storeName, action: Action.clear, mode: AccessMode.readwrite });
    }
    /**
     * Close the database and destroy the reference to it
     */
    destroy() {
        if (this.indexedDbConnection) {
            this.indexedDbConnection.close();
        }
        this.indexedDbConnection = null;
    }
    /**
     * Close db connection and delete the db
     * WARNING: should be used only by adtrace's demo app!
     */
    deleteDatabase() {
        this.destroy();
        return this.deleteDatabaseByName(this.dbName);
    }
}
exports.IndexedDB = IndexedDBWrapper;
IndexedDBWrapper.dbValidationName = 'validate-db-openable';
/**
 * Cached promise of IndexedDB validation
 */
IndexedDBWrapper.isSupportedPromise = null;
//# sourceMappingURL=indexeddb.js.map