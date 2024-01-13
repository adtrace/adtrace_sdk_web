"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppIcon = void 0;
class AppIcon {
    constructor(bannerData, image, placeholder) {
        this.appTraceUrl = (appId) => `https://www.apptrace.com/api/app/${appId}/artwork_url_small`;
        this.image = image;
        this.placeholder = placeholder;
        this.appName = bannerData.appName;
        const sources = this.getSources(bannerData);
        this.showImage(sources);
    }
    getSources(bannerData) {
        const sourcesArray = [];
        if (bannerData.imageUrl) {
            sourcesArray.push(bannerData.imageUrl);
        }
        sourcesArray.push(this.appTraceUrl(bannerData.appId));
        return sourcesArray;
    }
    showImage(sources) {
        const imageLoadingPromise = sources.reduce((acc, url) => {
            return acc.catch(() => this.loadImage(url, this.image));
        }, Promise.reject());
        return imageLoadingPromise
            .then(() => {
            this.placeholder.remove();
        })
            .catch(() => {
            this.image.remove();
            this.placeholder.innerText = this.appName.length ? this.appName[0].toUpperCase() : '';
        });
    }
    loadImage(url, image) {
        return new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = url;
        });
    }
}
exports.AppIcon = AppIcon;
//# sourceMappingURL=app-icon.js.map