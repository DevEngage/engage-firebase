"use strict";
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_functions_1 = require("firebase-functions");
var firebase_admin_1 = require("firebase-admin");
var algoliasearch = require("algoliasearch");
var _ = require("lodash");
var algolia = firebase_functions_1.config().algolia;
var _a = algolia || { app_id: undefined, api_key: undefined }, app_id = _a.app_id, api_key = _a.api_key;
var client;
if (!app_id)
    console.error('missing', app_id);
if (!api_key)
    console.error('missing', api_key);
if (app_id && api_key) {
    client = algoliasearch(app_id, api_key);
}
var AlgoliaExport = /** @class */ (function () {
    function AlgoliaExport(indexName, ref) {
        this.contactsRef = firebase_admin_1.firestore().collection(ref);
        this.index = client.initIndex(indexName);
    }
    AlgoliaExport.prototype.bulk = function (path, omit, include) {
        var _this = this;
        if (omit === void 0) { omit = []; }
        if (include === void 0) { include = {}; }
        return this.contactsRef.get().then(function (dataSnapshot) {
            // Array of data to index
            var objectsToIndex = [];
            // Get all objects
            // const values = dataSnapshot.val();
            // Process each child Firebase object
            dataSnapshot.forEach((function (childSnapshot) {
                // get the key and data from the snapshot
                var childKey = childSnapshot.id;
                var childData = childSnapshot.data();
                if (childSnapshot && include && !_.isMatch(childData, include)) {
                    return;
                }
                // Specify Algolia's objectID using the Firebase object key
                // Add object for indexing
                if (path && childData && childData[path]) {
                    var data = childData[path];
                    _this.addGeo(data);
                    data.objectID = childKey;
                    data = _.omit(data, omit);
                    objectsToIndex.push(data);
                }
                else if (childData) {
                    _this.addGeo(childData);
                    childData.objectID = childKey;
                    childData = _.omit(childData, omit);
                    objectsToIndex.push(childData);
                }
            }));
            // Add or update new objects
            return _this.index.saveObjects(objectsToIndex).then(function (result) {
                console.log('Firebase -> Algolia import done');
                return result;
            });
        });
    };
    AlgoliaExport.prototype.addGeo = function (obj) {
        if (obj && obj.locationLat && obj.locationLng) {
            if (!_.isNumber(obj.locationLat)) {
                obj.locationLat = _.toNumber(obj.locationLat);
            }
            if (!_.isNumber(obj.locationLng)) {
                obj.locationLng = _.toNumber(obj.locationLng);
            }
            obj._geoloc = {
                lat: obj.locationLat,
                lng: obj.locationLng,
            };
        }
    };
    AlgoliaExport.prototype.once = function (payload, include, omit) {
        if (include === void 0) { include = {}; }
        if (omit === void 0) { omit = ['isCompleted', 'locationLat', 'locationLng', 'profile']; }
        if (payload && include && !_.isMatch(payload, include)) {
            return Promise.resolve();
        }
        this.addGeo(payload);
        console.log('Payload for Algolia: ', payload);
        payload = _.omit(payload, omit);
        return this.index.saveObject(payload);
    };
    AlgoliaExport.prototype.remove = function (key) {
        console.log('Algolia remove key: ', key);
        return this.index.deleteObject(key);
    };
    AlgoliaExport.prototype.search = function (query, geo, range) {
        return __awaiter(this, void 0, void 0, function () {
            var rangeInMeters, filters;
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var data, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (range)
                                        rangeInMeters = range * 1609.34;
                                    rangeInMeters = parseInt(rangeInMeters);
                                    console.log('filters', filters);
                                    if (!!geo) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.getList(query, filters)];
                                case 1:
                                    data = _a.sent();
                                    resolve(data);
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, this.getListByGeo(query, geo, rangeInMeters, filters)];
                                case 3:
                                    data = _a.sent();
                                    resolve(data);
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    AlgoliaExport.prototype.getList = function (query, filters) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.index.search({
                query: query || '',
                filters: filters || '',
            }, function (err, content) {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(content.hits);
            });
        });
    };
    AlgoliaExport.prototype.getListByGeo = function (query, geo, range, filters) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.index.search({
                query: query || '',
                aroundLatLng: geo.lat + ", " + geo.lng,
                aroundRadius: range,
                filters: filters || '',
            }, function (err, content) {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(content.hits);
            });
        });
    };
    return AlgoliaExport;
}());
exports.AlgoliaExport = AlgoliaExport;
//# sourceMappingURL=algolia.export.js.map