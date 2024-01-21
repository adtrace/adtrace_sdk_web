"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartBannerView = void 0;
const styles_module_scss_1 = __importDefault(require("../assets/styles.module.scss"));
const template_1 = __importDefault(require("../assets/template"));
const api_1 = require("../api");
const app_icon_1 = require("./app-icon");
class SmartBannerView {
    constructor(data, onDismiss, endpoint) {
        this.parent = document.body;
        this.dismissButton = null;
        this.onDismiss = onDismiss;
        this.render(data, endpoint);
    }
    render(bannerData, endpoint) {
        this.banner = document.createElement('div');
        this.banner.setAttribute('class', styles_module_scss_1.default.bannerContainer);
        const positionStyle = bannerData.position === api_1.Position.Top ? styles_module_scss_1.default.stickyToTop : styles_module_scss_1.default.stickyToBottom;
        const query = bannerData.deeplinkPath ? `?deeplink=${encodeURIComponent(bannerData.deeplinkPath)}` : '';
        const href = `${endpoint}/${bannerData.trackerToken}${query}`;
        this.banner.innerHTML = (0, template_1.default)(positionStyle, bannerData.header, bannerData.description, bannerData.buttonText, href);
        if (bannerData.position === api_1.Position.Top) {
            this.parent.insertBefore(this.banner, this.parent.firstChild);
        }
        else {
            this.parent.appendChild(this.banner);
        }
        this.dismissButton = this.getElemByClass(styles_module_scss_1.default.dismiss);
        if (this.dismissButton) {
            this.dismissButton.addEventListener('click', this.onDismiss);
        }
        const appIconPlaceholder = this.getElemByClass(styles_module_scss_1.default.placeholder);
        const appIconImage = this.getElemByClass(styles_module_scss_1.default.image);
        if (appIconImage && appIconPlaceholder) {
            new app_icon_1.AppIcon(bannerData, appIconImage, appIconPlaceholder);
        }
    }
    show() {
        this.banner.hidden = false;
    }
    hide() {
        this.banner.hidden = true;
    }
    destroy() {
        this.removeDismissButtonHandler();
        this.banner.remove();
    }
    removeDismissButtonHandler() {
        if (this.dismissButton && this.onDismiss) {
            this.dismissButton.removeEventListener('click', this.onDismiss);
            this.dismissButton = null;
        }
    }
    getElemByClass(classNames) {
        if (this.banner) {
            const elements = this.banner.getElementsByClassName(classNames);
            return elements.length > 0 ? elements[0] : null;
        }
        return null;
    }
}
exports.SmartBannerView = SmartBannerView;
//# sourceMappingURL=smart-banner-view.js.map