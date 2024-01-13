"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartBanner = void 0;
const logger_1 = __importDefault(require("../logger"));
const detect_os_1 = require("./detect-os");
const factory_1 = require("./storage/factory");
const api_1 = require("./api");
const smart_banner_view_1 = require("./view/smart-banner-view");
const xhr_network_1 = require("./network/xhr-network");
const url_startegy_network_1 = require("./network/url-startegy-network");
/**
 * Adtrace Web SDK Smart Banner
 */
class SmartBanner {
    constructor({ webToken, logLevel = 'error', dataResidency, onCreated, onDismissed }, network) {
        this.STORAGE_KEY_DISMISSED = 'closed';
        this.timer = null;
        this.onCreated = onCreated;
        this.onDismissed = onDismissed;
        logger_1.default.setLogLevel(logLevel);
        const config = dataResidency ? { dataResidency } : {};
        this.network = network || new url_startegy_network_1.NetworkWithUrlStrategy(new xhr_network_1.XhrNetwork(), { urlStrategyConfig: config });
        this.storage = factory_1.StorageFactory.createStorage();
        this.init(webToken);
    }
    /**
     * Initiate Smart Banner
     *
     * @param webToken token used to get data from backend
     */
    init(webToken) {
        if (this.banner) {
            logger_1.default.error('Smart Banner already exists');
            return;
        }
        if (this.dataFetchPromise) {
            logger_1.default.error('Smart Banner is initialising already');
            return;
        }
        const deviceOs = (0, detect_os_1.getDeviceOS)();
        if (!deviceOs) {
            logger_1.default.log('This platform is not one of the targeting ones, Smart Banner will not be shown');
            return;
        }
        this.dataFetchPromise = (0, api_1.fetchSmartBannerData)(webToken, deviceOs, this.network);
        this.dataFetchPromise.then(bannerData => {
            this.dataFetchPromise = null;
            if (!bannerData) {
                logger_1.default.log(`No Smart Banners for ${deviceOs} platform found`);
                return;
            }
            const whenToShow = this.getDateToShowAgain(bannerData.dismissInterval);
            if (Date.now() < whenToShow) {
                logger_1.default.log('Smart Banner was dismissed');
                this.scheduleCreation(webToken, whenToShow);
                return;
            }
            logger_1.default.log('Creating Smart Banner');
            this.banner = new smart_banner_view_1.SmartBannerView(bannerData, () => this.dismiss(webToken, bannerData.dismissInterval), this.network.endpoint);
            logger_1.default.log('Smart Banner created');
            if (this.onCreated) {
                this.onCreated();
            }
        });
    }
    /**
     * Show Smart Banner
     */
    show() {
        if (this.banner) {
            this.banner.show();
            return;
        }
        if (this.dataFetchPromise) {
            logger_1.default.log('Smart Banner will be shown after initialisation finished');
            this.dataFetchPromise
                .then(() => {
                logger_1.default.log('Initialisation finished, showing Smart Banner');
                this.show();
            });
            return;
        }
        logger_1.default.error('There is no Smart Banner to show, have you called initialisation?');
    }
    /**
     * Hide Smart Banner
     */
    hide() {
        if (this.banner) {
            this.banner.hide();
            return;
        }
        if (this.dataFetchPromise) {
            logger_1.default.log('Smart Banner will be hidden after initialisation finished');
            this.dataFetchPromise
                .then(() => {
                logger_1.default.log('Initialisation finished, hiding Smart Banner');
                this.hide();
            });
            return;
        }
        logger_1.default.error('There is no Smart Banner to hide, have you called initialisation?');
    }
    /**
     * Removes Smart Banner from DOM
     */
    destroy() {
        if (this.banner) {
            this.banner.destroy();
            this.banner = null;
            logger_1.default.log('Smart Banner removed');
        }
        else {
            logger_1.default.error('There is no Smart Banner to remove');
        }
    }
    /**
     * Schedules next Smart Banner show and removes banner from DOM
     */
    dismiss(webToken, dismissInterval) {
        logger_1.default.log('Smart Banner dismissed');
        this.storage.setItem(this.STORAGE_KEY_DISMISSED, Date.now());
        const whenToShow = this.getDateToShowAgain(dismissInterval);
        this.scheduleCreation(webToken, whenToShow);
        this.destroy();
        if (this.onDismissed) {
            this.onDismissed();
        }
    }
    /**
     * Sets a timeout to schedule next Smart Banner show
     */
    scheduleCreation(webToken, when) {
        if (this.timer) {
            logger_1.default.log('Clearing previously scheduled creation of Smart Banner');
            clearTimeout(this.timer);
            this.timer = null;
        }
        const delay = when - Date.now();
        this.timer = setTimeout(() => {
            this.timer = null;
            this.init(webToken);
        }, delay);
        logger_1.default.log('Smart Banner creation scheduled on ' + new Date(when));
    }
    /**
     * Returns date when Smart Banner should be shown again
     */
    getDateToShowAgain(dismissInterval) {
        const dismissedDate = this.storage.getItem(this.STORAGE_KEY_DISMISSED);
        if (!dismissedDate || typeof dismissedDate !== 'number') {
            return Date.now();
        }
        return dismissedDate + dismissInterval;
    }
}
exports.SmartBanner = SmartBanner;
//# sourceMappingURL=smart-banner.js.map