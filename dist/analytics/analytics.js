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
var EngageAnalytics = /** @class */ (function () {
    function EngageAnalytics(path) {
        this.path = path;
        this.init(path);
    }
    EngageAnalytics.prototype.init = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var details;
            return __generator(this, function (_a) {
                details = this.getPathDetails(path);
                this.collection = EngageAnalytics.STORE.getInstance("$analytics");
                this.model = EngageAnalytics.STORE.getInstance("$analyticModels");
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.updateDestinations = function (models, data) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = models.map(function (model) {
                            return _this.addDoc(model, data);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // async add(field, num = 1) {
    //     this.action('add', field, num);
    // }
    // async subtract(field, num = 1) {
    //     this.action('minus', field, num);
    // }
    EngageAnalytics.prototype.addDoc = function (model, doc) {
        return this.addAnalyticDoc(model, doc);
    };
    EngageAnalytics.prototype.subtractDoc = function (model, doc) {
        return this.removeAnalyticDoc(model, doc);
    };
    EngageAnalytics.prototype.getAnalytics = function (dest, field) {
        if (field === void 0) { field = 'total'; }
        var col = EngageAnalytics.STORE.getInstance(dest + "/$analytics");
        return col.get(field);
    };
    // async action(action: AnalyticAction, field: string, num = 1, save = true) {
    //     let model;
    //     if (save) {
    //         model = await this.model.getList(
    //             this.model.ref.where('field', '==', field)
    //         );
    //     }
    //     if (!this.doc[field]) {
    //         this.doc[field] = 0;
    //     }
    //     switch (action) {
    //         case 'add': 
    //             this.doc[field] += num;
    //             break;
    //         case 'minus': 
    //             this.doc[field] -= num;
    //             break;
    //         case 'multiply': 
    //             this.doc[field] *= num;
    //             break;
    //         case 'minus': 
    //             this.doc[field] /= num;
    //             break;
    //         case 'set': 
    //             this.doc[field] = num;
    //             break;
    //         case 'sum': 
    //             this.doc[field] = await this.sumList(field, action);
    //             break;
    //         default:
    //             this.doc[field] += num;
    //     }
    //     if (model && model[0] && model[0].type === 'int') {
    //         this.doc[field] = parseInt(this.doc[field]);
    //     }
    //     if (save) await this.doc.$save();
    //     return this.doc[field];
    // }
    EngageAnalytics.prototype.applyAction = function (model, dataset, num, save) {
        if (dataset === void 0) { dataset = 'total'; }
        if (num === void 0) { num = 1; }
        if (save === void 0) { save = true; }
        return __awaiter(this, void 0, void 0, function () {
            var collectionAnalytics, doc, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        collectionAnalytics = EngageAnalytics.STORE.getInstance(model.destination + "/$analytics");
                        return [4 /*yield*/, collectionAnalytics.get(dataset)];
                    case 1:
                        doc = _d.sent();
                        if (!doc[model.field]) {
                            doc[model.field] = 0;
                        }
                        _a = model.action;
                        switch (_a) {
                            case 'add': return [3 /*break*/, 2];
                            case 'minus': return [3 /*break*/, 3];
                            case 'multiply': return [3 /*break*/, 4];
                            case 'minus': return [3 /*break*/, 5];
                            case 'set': return [3 /*break*/, 6];
                            case 'sum': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 2:
                        doc[model.field] += num;
                        return [3 /*break*/, 10];
                    case 3:
                        doc[model.field] -= num;
                        return [3 /*break*/, 10];
                    case 4:
                        doc[model.field] *= num;
                        return [3 /*break*/, 10];
                    case 5:
                        doc[model.field] /= num;
                        return [3 /*break*/, 10];
                    case 6:
                        doc[model.field] = num;
                        return [3 /*break*/, 10];
                    case 7:
                        _b = doc;
                        _c = model.field;
                        return [4 /*yield*/, this.sumList(model.field, model.action)];
                    case 8:
                        _b[_c] = _d.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        doc[model.field] += num;
                        _d.label = 10;
                    case 10:
                        if (model && model[0] && model[0].type === 'int') {
                            doc[model.field] = parseInt(doc[model.field]);
                        }
                        if (!save) return [3 /*break*/, 12];
                        return [4 /*yield*/, doc.$save()];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12: return [2 /*return*/, doc[model.field]];
                }
            });
        });
    };
    EngageAnalytics.prototype.sumList = function (field, action) {
        return __awaiter(this, void 0, void 0, function () {
            var col, ref, list;
            return __generator(this, function (_a) {
                col = EngageAnalytics.STORE.getInstance("$analytics");
                ref = action ? col.ref.where('action', '==', action) : col.ref;
                ref = ref.where('field', '==', field).where('collection', '==', this.path);
                list = col.getList(ref);
                return [2 /*return*/, list.reduce(function (prev, curr) { return prev += curr.amount || 0; }, 0)];
            });
        });
    };
    EngageAnalytics.prototype.getTiggers = function (trigger) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getList(this.model.ref.where('trigger', '==', trigger))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.getModels = function (trigger) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getList(this.model.ref.where('trigger', '==', trigger))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.getModelByField = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getList(this.model.ref.where('field', '==', field))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.addModel = function (doc) {
        return this.model.save(doc);
    };
    EngageAnalytics.prototype.linkFieldToCollection = function (model) {
        return this.model.save(model);
    };
    EngageAnalytics.prototype.healthCheck = function (model, dataset) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionAnalytics, doc, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        collectionAnalytics = EngageAnalytics.STORE.getInstance(model.destination + "/$analytics");
                        return [4 /*yield*/, collectionAnalytics.get(dataset)];
                    case 1:
                        doc = _b.sent();
                        console.log('field:', doc[model.field]);
                        _a = doc[model.field];
                        return [4 /*yield*/, this.sumList(model.field)];
                    case 2:
                        if (_a === (_b.sent())) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    // async fix(field) {
    //     this.action('sum', field);
    // }
    EngageAnalytics.prototype.getAmount = function (model, relationItem) {
        var valid = true;
        var relationAmount = 0;
        if (model.validation && model.validation.length) {
            valid = model.validation.reduce(function (prev, curr) {
                var valueTrue = prev && curr && relationItem && curr.field && relationItem[curr.field] !== curr.value;
                var greaterThan = curr.greaterThan === undefined || (prev && curr && relationItem && curr.greaterThan !== undefined && relationItem[curr.field] >= curr.greaterThan);
                var lessThan = curr.lessThan === undefined || (prev && curr && relationItem && curr.lessThan !== undefined && relationItem[curr.field] <= curr.lessThan);
                return valueTrue && greaterThan && lessThan;
            }, true);
        }
        if (valid) {
            relationAmount = relationItem[model.amountField] || 1;
        }
        return relationAmount;
    };
    EngageAnalytics.prototype.getDataFromSnapshot = function (model, relationItem) {
        var fieldDoc;
        if (model.snapeshot === true) {
            fieldDoc = __assign({}, relationItem);
        }
        else if (typeof model.snapeshot === 'string') {
            fieldDoc = {};
            fieldDoc[model.snapeshot] = relationItem[model.snapeshot];
        }
        else if (typeof model.snapeshot === 'object' && model.snapeshot.length) {
            fieldDoc = {};
            model.snapeshot.forEach(function (element) { return fieldDoc[element] = relationItem[element]; });
        }
        return fieldDoc;
    };
    EngageAnalytics.prototype.addAnalyticDoc = function (model, relationItem) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldDoc, relationAmount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldDoc = this.getDataFromSnapshot(model, relationItem);
                        relationAmount = this.getAmount(model, relationItem);
                        fieldDoc = __assign({}, fieldDoc, { $action: model.action, $amount: relationAmount, $source: model.source, $destination: model.destination });
                        if (model.source && relationItem.id) {
                            fieldDoc['$id'] = model.source + "/" + relationItem.id;
                        }
                        if (model.allowDuplicates) {
                            delete fieldDoc['$id'];
                            delete fieldDoc['id'];
                        }
                        if (!(model.range && model.range.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(model.range.map(function (item) { return _this.applyAction(model, item, relationAmount); }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.applyAction(model, 'total', relationAmount)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, EngageAnalytics.STORE.getInstance("$analytics").save(fieldDoc)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.removeAnalyticDoc = function (model, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var relationAmount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model.action = 'minus';
                        relationAmount = this.getAmount(model, doc);
                        if (!(model.range && model.range.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(model.range.map(function (item) { return _this.applyAction(model, item, relationAmount); }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.applyAction(model, 'total', relationAmount)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, EngageAnalytics.STORE.getInstance("$analytics").remove(doc.$id)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.sync = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var model, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getModelByField(field)];
                    case 1:
                        model = _a.sent();
                        promises = model.map(function (model) { return __awaiter(_this, void 0, void 0, function () {
                            var proms;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, EngageAnalytics.STORE.getInstance(model.source).getList()];
                                    case 1:
                                        proms = (_a.sent())
                                            .map(function (relationItem) { return __awaiter(_this, void 0, void 0, function () {
                                            var relationAmount_1;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!relationItem.snapshot) return [3 /*break*/, 1];
                                                        return [2 /*return*/, this.addAnalyticDoc(model, relationItem)];
                                                    case 1:
                                                        relationAmount_1 = this.getAmount(model, relationItem);
                                                        if (!(model.range && model.range.length)) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, Promise.all(model.range.map(function (item) { return _this.applyAction(model, item, relationAmount_1); }))];
                                                    case 2:
                                                        _a.sent();
                                                        _a.label = 3;
                                                    case 3: return [4 /*yield*/, this.applyAction(model, 'total', relationAmount_1)];
                                                    case 4: return [2 /*return*/, _a.sent()];
                                                }
                                            });
                                        }); });
                                        return [2 /*return*/, Promise.all(proms)];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageAnalytics.prototype.getRange = function (field, start, end) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldCollection, query;
            return __generator(this, function (_a) {
                fieldCollection = EngageAnalytics.STORE.getInstance("$analytics");
                query = fieldCollection.ref
                    .where('field', '==', field)
                    .where('source', '==', this.path)
                    .where('$createdAt', '>=', start)
                    .where('$createdAt', '<=', end);
                return [2 /*return*/, fieldCollection.getList(query)];
            });
        });
    };
    EngageAnalytics.prototype.getPathDetails = function (path) {
        var _a = path.split('/'), collection = _a[0], id = _a[1], subCollection = _a[2], subId = _a[3];
        return {
            collection: collection,
            id: id,
            subCollection: subCollection,
            subId: subId,
            name: "" + collection + (subCollection || '').toUpperCase()
        };
    };
    return EngageAnalytics;
}());
exports.EngageAnalytics = EngageAnalytics;
//# sourceMappingURL=analytics.js.map