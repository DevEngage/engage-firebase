"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algoliasearch = require("algoliasearch");
class EngageAlgolia {
    constructor(path) {
        this.path = path;
        this.index = EngageAlgolia.client.initIndex(this.path);
    }
    search(query, filters, debug = false) {
        if (debug)
            console.log(this.path, query, filters);
        return new Promise((resolve, reject) => {
            this.index.search({
                query: query || '',
                filters: filters || '',
            }, (err, content) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    if (debug)
                        console.log('searchResults', content);
                    resolve({
                        results: content.hits,
                        content: content
                    });
                }
            });
        });
    }
    // getEventsListByIp(query?, filters?) {
    //     return new Promise(resolve => {
    //         this.index.search({
    //             query: query || '',
    //             aroundLatLngViaIP: true,
    //             aroundRadius: this.rangeInMeters,
    //             filters: filters || '',
    //         }, (err, content) => {
    //             if (err) {
    //                 console.error(err);
    //                 return;
    //             }
    //             this.eventsList = content.hits;
    //             console.log('searchResults', content);
    //             resolve(this.eventsList)
    //         });
    //     });
    // }
    static getIndex(path, config) {
        if (config) {
            EngageAlgolia.config = config;
        }
        if (EngageAlgolia.client) {
            EngageAlgolia.client = algoliasearch(this.config.appId, this.config.apiKey);
        }
        if (!EngageAlgolia.indexes[path]) {
            EngageAlgolia.indexes[path] = new EngageAlgolia(path);
        }
        return EngageAlgolia.indexes[path];
    }
}
EngageAlgolia.config = { appId: '', apiKey: '' };
exports.EngageAlgolia = EngageAlgolia;
//# sourceMappingURL=algolia.js.map