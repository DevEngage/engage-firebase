"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var functions = require("firebase-functions");
var algolia_export_1 = require("../algolia/algolia.export");
var analytics_trigger_1 = require("./analytics.trigger");
var functions_1 = require("../functions");
var EngageTrigger = /** @class */ (function () {
    function EngageTrigger(path) {
        this.path = path;
        this.relations = [];
        this.pathDetails = functions_1.EngageAnalytics.getPathDetails(path);
        this.ref = functions.firestore.document(this.path);
    }
    EngageTrigger.prototype.enableSearch = function () {
        this.algoliaExport = new algolia_export_1.AlgoliaExport(this.pathDetails.name, '/' + this.pathDetails.name);
        return this;
    };
    EngageTrigger.prototype.enableAnalytics = function (models, restore) {
        this.analyticTrigger = new analytics_trigger_1.EngageAnalyticsTrigger(this.path, models);
        this.analyticTrigger.restore(restore, EngageTrigger.buildTriggerData({ data: {} }, {}, this.path));
        return this;
    };
    EngageTrigger.prototype.addRelations = function (relations) {
        this.relations = relations;
        return this;
    };
    EngageTrigger.prototype.bindExports = function (exports) {
        this.exports = exports;
        return this;
    };
    EngageTrigger.getTriggerCollections = function (path) {
        return (path || '').split('/').filter(function (item, index) { return index % 2 === 0; });
    };
    EngageTrigger.buildTriggerData = function (change, context, path) {
        var data = change.after.data();
        var previousData = change.before.data();
        var _a = EngageTrigger.getTriggerCollections(path), collection = _a[0], subCollection = _a[1];
        var triggerData = __assign({}, context.params, { data: data,
            previousData: previousData,
            collection: collection,
            subCollection: subCollection, trigger: path, source: '', sourceParent: '' });
        var _b = functions_1.EngageAnalytics.createSourceRef(triggerData), source = _b[0], sourceParent = _b[1];
        triggerData.source = source;
        triggerData.sourceParent = sourceParent;
        var pathSplit = (source || '').split('/');
        triggerData.id = pathSplit[1];
        triggerData.subId = pathSplit[3];
        console.log('triggerData', triggerData);
        return triggerData;
    };
    EngageTrigger.prototype.onWrite = function (cb, ignoreFirst) {
        var _this = this;
        if (ignoreFirst === void 0) { ignoreFirst = false; }
        var onWrite = this.ref.onWrite(function (change, context) { return __awaiter(_this, void 0, void 0, function () {
            var id, data, triggerData, algoliaData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!change.before.exists && ignoreFirst)
                            return [2 /*return*/, null];
                        id = context.params.id;
                        data = change.after.data();
                        triggerData = EngageTrigger.buildTriggerData(change, context, this.path);
                        triggerData.algoliaExport = this.algoliaExport;
                        triggerData.analyticTrigger = this.analyticTrigger;
                        if (!(id &&
                            data &&
                            (data.isApproved === undefined || data.isApproved) &&
                            (data.isPublic === undefined || data.isPublic) &&
                            data.info &&
                            data.info.name)) return [3 /*break*/, 2];
                        algoliaData = __assign({}, data, { objectID: id, $id: id });
                        return [4 /*yield*/, this.algoliaExport.once(algoliaData)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.algoliaExport && id && data && (data.isPublic === undefined || data.isPublic) && data.isSearchDisabled)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.algoliaExport.remove(id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!this.analyticTrigger) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.analyticTrigger.onWrite(triggerData)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!cb) return [3 /*break*/, 8];
                        return [4 /*yield*/, cb(triggerData)];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        if (this.exports && this.pathDetails.name) {
            this.exports[this.pathDetails.name + "OnWrite"] = onWrite;
            return this;
        }
        return this;
    };
    EngageTrigger.prototype.onDelete = function (cb) {
        var _this = this;
        var onDelete = this.ref.onDelete(function (snap, context) { return __awaiter(_this, void 0, void 0, function () {
            var id, triggerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = context.params.id;
                        triggerData = EngageTrigger.buildTriggerData(snap, context, this.path);
                        triggerData.algoliaExport = this.algoliaExport;
                        triggerData.analyticTrigger = this.analyticTrigger;
                        if (!cb) return [3 /*break*/, 2];
                        return [4 /*yield*/, cb(triggerData)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.analyticTrigger) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.analyticTrigger.onDelete(triggerData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!this.algoliaExport) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.algoliaExport.remove(id)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, 'done'];
                }
            });
        }); });
        if (this.exports && this.pathDetails.name) {
            this.exports[this.pathDetails.name + "OnDelete"] = onDelete;
        }
        return this;
    };
    EngageTrigger.prototype.onCreate = function (cb) {
        var _this = this;
        var onCreate = this.ref.onCreate(function (snap, context) { return __awaiter(_this, void 0, void 0, function () {
            var triggerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        triggerData = EngageTrigger.buildTriggerData(snap, context, this.path);
                        triggerData.algoliaExport = this.algoliaExport;
                        triggerData.analyticTrigger = this.analyticTrigger;
                        if (!this.analyticTrigger) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.analyticTrigger.onCreate(triggerData)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!cb) return [3 /*break*/, 4];
                        return [4 /*yield*/, cb(triggerData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        if (this.exports && this.pathDetails.name) {
            this.exports[this.pathDetails.name + "OnCreate"] = onCreate;
            return this;
        }
        return this;
    };
    EngageTrigger.prototype.onUpdate = function (cb) {
        var _this = this;
        var onUpdate = this.ref.onUpdate(function (change, context) { return __awaiter(_this, void 0, void 0, function () {
            var triggerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        triggerData = EngageTrigger.buildTriggerData(change, context, this.path);
                        triggerData.algoliaExport = this.algoliaExport;
                        triggerData.analyticTrigger = this.analyticTrigger;
                        if (!this.analyticTrigger) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.analyticTrigger.onUpdate(triggerData)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!cb) return [3 /*break*/, 4];
                        return [4 /*yield*/, cb(triggerData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        if (this.exports && this.pathDetails.name) {
            this.exports[this.pathDetails.name + "OnUpdate"] = onUpdate;
            return this;
        }
        return this;
    };
    return EngageTrigger;
}());
exports.default = EngageTrigger;
//# sourceMappingURL=trigger.js.map