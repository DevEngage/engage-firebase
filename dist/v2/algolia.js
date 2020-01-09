"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algoliasearch = require("algoliasearch");
var EngageAlgolia = /** @class */ (function () {
    function EngageAlgolia(path) {
        this.path = path;
        this.index = EngageAlgolia.client.initIndex(this.path);
    }
    EngageAlgolia.prototype.search = function (query, filters, debug) {
        var _this = this;
        if (debug === void 0) { debug = false; }
        if (debug)
            console.log(this.path, query, filters);
        return new Promise(function (resolve, reject) {
            _this.index.search({
                query: query || '',
                filters: filters || '',
            }, function (err, content) {
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
    };
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
    EngageAlgolia.getIndex = function (path, config) {
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
    };
    EngageAlgolia.config = { appId: '', apiKey: '' };
    return EngageAlgolia;
}());
exports.EngageAlgolia = EngageAlgolia;
//# sourceMappingURL=algolia.js.map