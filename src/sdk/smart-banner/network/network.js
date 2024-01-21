"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkDecorator = void 0;
class NetworkDecorator {
    constructor(network) {
        this.network = network;
    }
    get endpoint() {
        return this.network.endpoint;
    }
    set endpoint(value) {
        this.network.endpoint = value;
    }
    request(path, params) {
        return this.network.request(path, params);
    }
}
exports.NetworkDecorator = NetworkDecorator;
//# sourceMappingURL=network.js.map