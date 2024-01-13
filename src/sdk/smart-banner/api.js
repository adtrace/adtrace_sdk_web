"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSmartBannerData = exports.Position = void 0;
const logger_1 = __importDefault(require("../logger"));
var Position;
(function (Position) {
    Position["Top"] = "top";
    Position["Bottom"] = "bottom";
})(Position = exports.Position || (exports.Position = {}));
/**
 * Ensures response contains general info: title, description, button_label and tracker_token and converts response
 * to SmartBannerData
 */
function validate(response) {
    var _a, _b;
    const { title, description, button_label, tracker_token } = response;
    if (title && description && button_label && tracker_token) {
        return {
            appId: ((_a = response.app) === null || _a === void 0 ? void 0 : _a.default_store_app_id) || '',
            appName: ((_b = response.app) === null || _b === void 0 ? void 0 : _b.name) || '',
            position: response.position || Position.Bottom,
            imageUrl: response.image_url,
            header: title,
            description: description,
            buttonText: button_label,
            trackerToken: tracker_token,
            deeplinkPath: response.deeplink_path,
            dismissInterval: 24 * 60 * 60 * 1000, // 1 day in millis before show banner next time
        };
    }
    return null;
}
function fetchSmartBannerData(webToken, deviceOs, network) {
    const path = '/smart_banner';
    return network.request(path, { 'app_web_token': webToken })
        .then(banners => {
        const banner = banners.find(item => item.platform === deviceOs);
        if (!banner) {
            return null;
        }
        return validate(banner);
    })
        .catch(error => {
        logger_1.default.error('Network error occurred during loading Smart Banner: ' + JSON.stringify(error));
        return null;
    });
}
exports.fetchSmartBannerData = fetchSmartBannerData;
//# sourceMappingURL=api.js.map