"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceOS = exports.DeviceOS = void 0;
/**
 * Operation systems
 */
var DeviceOS;
(function (DeviceOS) {
    DeviceOS["Android"] = "android";
    DeviceOS["iOS"] = "ios";
    DeviceOS["WindowsPC"] = "windows";
    DeviceOS["WindowsPhone"] = "windows-phone";
})(DeviceOS = exports.DeviceOS || (exports.DeviceOS = {}));
/**
 * Returns one of android, ios, windows, windows-phone or undefined for another OS.
 */
function getDeviceOS() {
    var _a;
    const userAgent = (_a = navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!userAgent || userAgent.length < 1) {
        return undefined;
    }
    if (/ipad|iphone|ipod/.test(userAgent)) {
        return DeviceOS.iOS;
    }
    // Checking Windows first because Lumia devices could have for example
    // "Mozilla/5.0 (Windows Mobile 10; Android 8.0.0; Microsoft; Lumia 950XL) ..." user agent
    if (userAgent.includes('windows')) {
        if (/phone|mobile/.test(userAgent)) {
            return DeviceOS.WindowsPhone;
        }
        return DeviceOS.WindowsPC;
    }
    if (userAgent.includes('android')) {
        return DeviceOS.Android;
    }
    return undefined;
}
exports.getDeviceOS = getDeviceOS;
//# sourceMappingURL=detect-os.js.map