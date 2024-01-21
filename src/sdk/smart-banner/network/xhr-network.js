"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XhrNetwork = void 0;
const globals_1 = __importDefault(require("../../globals"));
const utilities_1 = require("../utilities");
const errors_1 = require("./errors");
/** Sends HTTP GET request using XMLHttpRequest */
class XhrNetwork {
    constructor(origin) {
        this.origin = origin;
    }
    get endpoint() {
        if (!this.origin) {
            throw Error('XhrNetwork: Origin not defined');
        }
        return this.origin;
    }
    set endpoint(value) {
        this.origin = value;
    }
    /**
     * Creates an XMLHttpRequest object and sends a GET request with provided encoded URL
     * @param url encoded URL
     */
    xhr(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            const headers = [
                ['Client-SDK', `js${globals_1.default.version}`],
                ['Content-Type', 'application/json']
            ];
            headers.forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
            xhr.onerror = () => reject(errors_1.NoConnectionError);
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                const okStatus = xhr.status >= 200 && xhr.status < 300;
                const json = (0, utilities_1.parseJson)(xhr.responseText);
                if (xhr.status === 0) {
                    reject(errors_1.NoConnectionError);
                }
                else {
                    if (okStatus) {
                        resolve(json);
                    }
                    else {
                        reject({ status: xhr.status, message: json || xhr.responseText || '' });
                    }
                }
            };
            xhr.send();
        });
    }
    encodeParams(params) {
        return Object.keys(params)
            .map(key => [encodeURIComponent(key), encodeURIComponent(params[key])].join('='))
            .join('&');
    }
    request(path, params) {
        const encodedParams = params ? `?${this.encodeParams(params)}` : '';
        return this.xhr(`${this.endpoint}${path}${encodedParams}`);
    }
}
exports.XhrNetwork = XhrNetwork;
//# sourceMappingURL=xhr-network.js.map