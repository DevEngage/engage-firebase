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
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.collection = EngageAnalytics.STORE.getInstance("$analytics");
                        _a = this;
                        return [4 /*yield*/, this.collection.get("" + path)];
                    case 1:
                        _a.doc = _b.sent();
                        this.model = EngageAnalytics.STORE.getInstance("$analytics/" + path + "/$model");
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageAnalytics.prototype.add = function (field, num) {
        if (num === void 0) { num = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.action('add', field, num);
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.subtract = function (field, num) {
        if (num === void 0) { num = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.action('minus', field, num);
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.action = function (action, field, num, save) {
        if (num === void 0) { num = 1; }
        if (save === void 0) { save = true; }
        return __awaiter(this, void 0, void 0, function () {
            var model, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!save) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.model.getList(this.model.ref.where('field', '==', field))];
                    case 1:
                        model = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!this.doc[field]) {
                            this.doc[field] = 0;
                        }
                        _a = action;
                        switch (_a) {
                            case 'add': return [3 /*break*/, 3];
                            case 'minus': return [3 /*break*/, 4];
                            case 'multiply': return [3 /*break*/, 5];
                            case 'minus': return [3 /*break*/, 6];
                            case 'set': return [3 /*break*/, 7];
                            case 'sum': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 3:
                        this.doc[field] += num;
                        return [3 /*break*/, 11];
                    case 4:
                        this.doc[field] -= num;
                        return [3 /*break*/, 11];
                    case 5:
                        this.doc[field] *= num;
                        return [3 /*break*/, 11];
                    case 6:
                        this.doc[field] /= num;
                        return [3 /*break*/, 11];
                    case 7:
                        this.doc[field] = num;
                        return [3 /*break*/, 11];
                    case 8:
                        _b = this.doc;
                        _c = field;
                        return [4 /*yield*/, this.sumList(field, action)];
                    case 9:
                        _b[_c] = _d.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        this.doc[field] += num;
                        _d.label = 11;
                    case 11:
                        if (model && model[0] && model[0].type === 'int') {
                            this.doc[field] = parseInt(this.doc[field]);
                        }
                        if (!save) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.doc.$save()];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [2 /*return*/, this.doc[field]];
                }
            });
        });
    };
    EngageAnalytics.prototype.sumList = function (field, action) {
        return __awaiter(this, void 0, void 0, function () {
            var col, list;
            return __generator(this, function (_a) {
                col = EngageAnalytics.STORE.getInstance("$analytics/" + this.path + "/" + field);
                list = col.getList(action ? col.ref.where('action', '==', action) : col.ref);
                return [2 /*return*/, list.reduce(function (prev, curr) { return prev += curr.amount || 0; }, 0)];
            });
        });
    };
    EngageAnalytics.prototype.saveModelField = function (doc) {
        doc.$save();
        return this;
    };
    EngageAnalytics.prototype.getModel = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getList(this.model.ref.where('field', '==', field))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.linkFieldToCollection = function (model) {
        this.model.save(model);
    };
    EngageAnalytics.prototype.healthCheck = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('field:', this.doc[field]);
                        _a = this.doc[field];
                        return [4 /*yield*/, this.sumList(field)];
                    case 1:
                        if (_a === (_b.sent())) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    EngageAnalytics.prototype.fix = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.action('sum', field);
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.getRelationAmount = function (model, relationItem) {
        var relationAmount = 1;
        if (model.relactionField) {
            relationAmount = relationItem[model.relactionField] || 1;
        }
        return relationAmount;
    };
    EngageAnalytics.prototype.addRelationDoc = function (model, relationItem) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldDoc, relationAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        relationAmount = this.getRelationAmount(model, relationItem);
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
                        fieldDoc = __assign({}, fieldDoc, { $action: model.action, $amount: relationAmount, $relation: model.relaction, $relactionField: model.relactionField });
                        this.action(model.action, model.field, relationAmount);
                        return [4 /*yield*/, EngageAnalytics.STORE.getInstance("$analytics/" + this.path + "/" + model.field).save(fieldDoc)];
                    case 1: return [2 /*return*/, _a.sent()];
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
                    case 0:
                        this.doc[field] = 0;
                        return [4 /*yield*/, this.getModel(field)];
                    case 1:
                        model = _a.sent();
                        promises = model.map(function (model) { return __awaiter(_this, void 0, void 0, function () {
                            var proms;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, EngageAnalytics.STORE.getInstance(model.relaction).getList()];
                                    case 1:
                                        proms = (_a.sent())
                                            .map(function (relationItem) {
                                            if (relationItem.snapshot) {
                                                return _this.addRelationDoc(model, relationItem);
                                            }
                                            else {
                                                var relationAmount = _this.getRelationAmount(model, relationItem);
                                                return _this.action(model.action, model.field, relationAmount);
                                            }
                                        });
                                        return [2 /*return*/, Promise.all(proms)];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.doc[field]];
                }
            });
        });
    };
    return EngageAnalytics;
}());
exports.EngageAnalytics = EngageAnalytics;
//# sourceMappingURL=analytics.js.map