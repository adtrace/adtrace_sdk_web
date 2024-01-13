"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComplexStoreField = exports.isCompositeKeyStoreField = exports.isNestingStoreField = exports.isPredefinedValuesField = exports.ShortPreferencesStoreName = exports.PreferencesStoreName = exports.ShortStoreName = exports.StoreName = void 0;
const constants_1 = require("../constants");
var StoreName;
(function (StoreName) {
    StoreName["Queue"] = "queue";
    StoreName["ActivityState"] = "activityState";
    StoreName["GlobalParams"] = "globalParams";
    StoreName["EventDeduplication"] = "eventDeduplication";
})(StoreName || (StoreName = {}));
exports.StoreName = StoreName;
var PreferencesStoreName;
(function (PreferencesStoreName) {
    PreferencesStoreName["Preferences"] = "preferences";
})(PreferencesStoreName || (PreferencesStoreName = {}));
exports.PreferencesStoreName = PreferencesStoreName;
var ShortStoreName;
(function (ShortStoreName) {
    ShortStoreName["Queue"] = "q";
    ShortStoreName["ActivityState"] = "as";
    ShortStoreName["GlobalParams"] = "gp";
    ShortStoreName["EventDeduplication"] = "ed";
})(ShortStoreName || (ShortStoreName = {}));
exports.ShortStoreName = ShortStoreName;
var ShortPreferencesStoreName;
(function (ShortPreferencesStoreName) {
    ShortPreferencesStoreName["Preferences"] = "p";
})(ShortPreferencesStoreName || (ShortPreferencesStoreName = {}));
exports.ShortPreferencesStoreName = ShortPreferencesStoreName;
const _queueScheme = {
    keyPath: 'timestamp',
    autoIncrement: false,
    fields: {
        url: {
            key: 'u',
            values: {
                '/session': 1,
                '/event': 2,
                '/gdpr_forget_device': 3,
                '/sdk_click': 4,
                '/disable_third_party_sharing': 5
            }
        },
        method: {
            key: 'm',
            values: {
                GET: 1,
                POST: 2,
                PUT: 3,
                DELETE: 4
            }
        },
        timestamp: 't',
        createdAt: 'ca',
        params: {
            key: 'p',
            keys: {
                timeSpent: 'ts',
                sessionLength: 'sl',
                sessionCount: 'sc',
                eventCount: 'ec',
                lastInterval: 'li',
                eventToken: 'et',
                revenue: 're',
                currency: 'cu',
                callbackParams: 'cp',
                partnerParams: 'pp'
            }
        }
    }
};
const _activityStateScheme = {
    keyPath: 'uuid',
    autoIncrement: false,
    fields: {
        uuid: {
            key: 'u',
            values: {
                unknown: '-'
            }
        },
        timeSpent: 'ts',
        sessionLength: 'sl',
        sessionCount: 'sc',
        eventCount: 'ec',
        lastActive: 'la',
        lastInterval: 'li',
        installed: {
            key: 'in',
            values: {
                false: 0,
                true: 1
            }
        },
        attribution: {
            key: 'at',
            keys: {
                adid: 'a',
                tracker_token: 'tt',
                tracker_name: 'tn',
                network: 'nt',
                campaign: 'cm',
                adgroup: 'ag',
                creative: 'cr',
                click_label: 'cl',
                state: {
                    key: 'st',
                    values: {
                        installed: 1,
                        reattributed: 2
                    }
                }
            }
        }
    }
};
const _globalParamsScheme = {
    keyPath: 'keyType',
    autoIncrement: false,
    index: 'type',
    fields: {
        keyType: {
            key: 'kt',
            composite: ['key', 'type']
        },
        key: 'k',
        value: 'v',
        type: {
            key: 't',
            values: {
                callback: 1,
                partner: 2
            }
        }
    }
};
const _eventDeduplicationScheme = {
    keyPath: 'internalId',
    autoIncrement: true,
    fields: {
        internalId: 'ii',
        id: 'i'
    }
};
const _preferencesScheme = {
    fields: {
        thirdPartySharingDisabled: {
            key: 'td',
            keys: {
                reason: {
                    key: 'r',
                    values: {
                        [constants_1.REASON_GENERAL]: 1
                    }
                },
                pending: {
                    key: 'p',
                    values: {
                        false: 0,
                        true: 1
                    }
                }
            }
        },
        sdkDisabled: {
            key: 'sd',
            keys: {
                reason: {
                    key: 'r',
                    values: {
                        [constants_1.REASON_GENERAL]: 1,
                        [constants_1.REASON_GDPR]: 2
                    }
                },
                pending: {
                    key: 'p',
                    values: {
                        false: 0,
                        true: 1
                    }
                }
            }
        }
    }
};
const scheme = {
    queue: {
        name: ShortStoreName.Queue,
        scheme: _queueScheme
    },
    activityState: {
        name: ShortStoreName.ActivityState,
        scheme: _activityStateScheme
    },
    globalParams: {
        name: ShortStoreName.GlobalParams,
        scheme: _globalParamsScheme
    },
    eventDeduplication: {
        name: ShortStoreName.EventDeduplication,
        scheme: _eventDeduplicationScheme
    },
    preferences: {
        name: ShortPreferencesStoreName.Preferences,
        scheme: _preferencesScheme,
        permanent: true
    }
};
function isPredefinedValuesField(field) {
    return !!field && Object.prototype.hasOwnProperty.call(field, 'values');
}
exports.isPredefinedValuesField = isPredefinedValuesField;
function isNestingStoreField(field) {
    return !!field && Object.prototype.hasOwnProperty.call(field, 'keys');
}
exports.isNestingStoreField = isNestingStoreField;
function isCompositeKeyStoreField(field) {
    return !!field && Object.prototype.hasOwnProperty.call(field, 'composite');
}
exports.isCompositeKeyStoreField = isCompositeKeyStoreField;
function isComplexStoreField(field) {
    return !!field && typeof (field) !== 'string';
}
exports.isComplexStoreField = isComplexStoreField;
exports.default = scheme;
//# sourceMappingURL=scheme.js.map