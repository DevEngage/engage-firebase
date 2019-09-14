"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/*
* TODO:
* [ ] Finish localstorage integration
* */
var EngagePubsub = /** @class */ (function () {
    function EngagePubsub(localStorage, retain, id) {
        if (localStorage === void 0) { localStorage = false; }
        if (retain === void 0) { retain = false; }
        if (id === void 0) { id = 'EngageData'; }
        this.localStorage = localStorage;
        this.retain = retain;
        this.id = id;
        this.listeners = {};
        this.data = {};
        console.log('Local Storage Enabled: ', this.localStorage);
        if (this.localStorage) {
            this.storage = window.localStorage;
        }
        if (this.retain) {
            this.data = JSON.parse(this.storage.getItem(this.id)) || {};
        }
    }
    EngagePubsub.prototype.subscribe = function (what, listener) {
        if (what === void 0) { what = 'all'; }
        if (!this.listeners[what])
            this.listeners[what] = [];
        this.listeners[what].push(listener);
        if (what !== 'all' && this.data[what]) {
            listener(this.data[what]);
        }
    };
    EngagePubsub.prototype.publish = function (data, what) {
        if (what === void 0) { what = 'all'; }
        this.data[what] = data;
        if (what === 'all') {
            _.each(this.listeners, function (value) {
                if (_.isArray(value)) {
                    _.each(value, function (listener) {
                        if (_.isFunction(listener))
                            listener(data);
                    });
                }
            });
        }
        else {
            _.each(this.listeners[what], function (listener) {
                if (_.isFunction(listener))
                    listener(data);
            });
        }
    };
    EngagePubsub.prototype.get = function (what) {
        if (what === void 0) { what = 'all'; }
        if (what === 'all') {
            return this.data;
        }
        return this.data[what];
    };
    EngagePubsub.prototype.set = function (data, what) {
        if (!what)
            return;
        if (what === 'all') {
            return this.data = data;
        }
        return this.data[what] = data;
    };
    EngagePubsub.prototype.clear = function (what) {
        if (!what)
            return null;
        if (what === 'all') {
            return this.data = {};
        }
        return this.data[what] = {};
    };
    EngagePubsub.getInstance = function () {
        if (!EngagePubsub.instance) {
            EngagePubsub.instance = new EngagePubsub();
        }
        return EngagePubsub.instance;
    };
    return EngagePubsub;
}());
exports.EngagePubsub = EngagePubsub;
exports.engagePubsub = EngagePubsub.getInstance();
//# sourceMappingURL=pubsub.js.map