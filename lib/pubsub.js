"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/*
* TODO:
* [ ] Finish localstorage integration
* */
class EngagePubsub {
    constructor(localStorage = false, retain = false, id = 'EngageData') {
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
    subscribe(what = 'all', listener) {
        if (!this.listeners[what])
            this.listeners[what] = [];
        this.listeners[what].push(listener);
        if (what !== 'all' && this.data[what]) {
            listener(this.data[what]);
        }
    }
    publish(data, what = 'all') {
        this.data[what] = data;
        if (what === 'all') {
            lodash_1.default.each(this.listeners, (value) => {
                if (lodash_1.default.isArray(value)) {
                    lodash_1.default.each(value, (listener) => {
                        if (lodash_1.default.isFunction(listener))
                            listener(data);
                    });
                }
            });
        }
        else {
            lodash_1.default.each(this.listeners[what], (listener) => {
                if (lodash_1.default.isFunction(listener))
                    listener(data);
            });
        }
    }
    get(what = 'all') {
        if (what === 'all') {
            return this.data;
        }
        return this.data[what];
    }
    set(data, what) {
        if (!what)
            return;
        if (what === 'all') {
            return this.data = data;
        }
        return this.data[what] = data;
    }
    clear(what) {
        if (!what)
            return;
        if (what === 'all') {
            return this.data = {};
        }
        return this.data[what] = {};
    }
    static getInstance() {
        if (!EngagePubsub.instance) {
            EngagePubsub.instance = new EngagePubsub();
        }
        return EngagePubsub.instance;
    }
}
exports.EngagePubsub = EngagePubsub;
exports.engagePubsub = EngagePubsub.getInstance();
//# sourceMappingURL=pubsub.js.map