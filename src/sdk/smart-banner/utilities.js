"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJson = void 0;
/**
 * Wraps JSON.parse() with try-catch.
 * Returns parsed object if successfully parsed and null otherwise.
 */
function parseJson(str) {
    if (!str) {
        return null;
    }
    try {
        return JSON.parse(str);
    }
    catch (error) {
        return null;
    }
}
exports.parseJson = parseJson;
//# sourceMappingURL=utilities.js.map