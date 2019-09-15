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
/*
    TODO:
    [ ]
*/
var EngageAnalytics = /** @class */ (function () {
    function EngageAnalytics(path) {
        this.path = path;
        this.init(path);
    }
    EngageAnalytics.prototype.init = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var details, collectionsPath;
            return __generator(this, function (_a) {
                details = EngageAnalytics.triggerParser(path);
                collectionsPath = details.collection;
                if (details.subCollection) {
                    collectionsPath += '-' + details.subCollection;
                }
                this.model = EngageAnalytics.STORE.getInstance("$collections/" + collectionsPath + "/$analyticModels");
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.triggerUpdate = function (models, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = models.map(function (model) {
                            if (triggerData.action === 'remove' && !model.final) {
                                return _this.subtractDoc(model, triggerData);
                            }
                            return _this.addDoc(model, triggerData);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.addDoc = function (model, doc) {
        return this.addAnalyticDoc(model, doc);
    };
    EngageAnalytics.prototype.subtractDoc = function (model, doc) {
        return this.removeAnalyticDoc(model, doc);
    };
    EngageAnalytics.prototype.getAnalytics = function (dest, field) {
        if (field === void 0) { field = 'total'; }
        var col = EngageAnalytics.STORE.getInstance(dest + "/" + EngageAnalytics.ANALYTICS_PATH);
        return col.get(field);
    };
    EngageAnalytics.prototype.getDataset = function (dest) {
        return EngageAnalytics.STORE.getInstance(dest + "/" + EngageAnalytics.DATASET_PATH);
    };
    EngageAnalytics.prototype.applyAction = function (doc, data, group) {
        return __awaiter(this, void 0, void 0, function () {
            var num;
            return __generator(this, function (_a) {
                num = data[group.field] || 1;
                if (!doc[group.field]) {
                    doc[group.field] = 0;
                }
                switch (group.action) {
                    case 'add':
                        doc[group.field] += num;
                        break;
                    case 'minus':
                        doc[group.field] -= num;
                        break;
                    case 'multiply':
                        doc[group.field] *= num;
                        break;
                    case 'minus':
                        doc[group.field] /= num;
                        break;
                    case 'set':
                        doc[group.field] = num;
                        break;
                    // case 'sum':
                    //     doc[group.field] = await this.sumList(group.field, group.action);
                    //     break;
                    default:
                        doc[group.field] += num;
                }
                if (group && group.type === 'int') {
                    doc[group.field] += parseInt(data[group.field]);
                }
                if (!(group.action === 'minus' || group.action === 'remove')) {
                    doc['$counter'] += 1;
                }
                doc['$counter'] += 1;
                return [2 /*return*/, doc];
            });
        });
    };
    EngageAnalytics.prototype.applyGroup = function (model, data, trigger) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                EngageAnalytics.createTriggerRef(data, trigger);
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.getModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.getList()];
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
    EngageAnalytics.getDates = function (data) {
        var createdAt = new Date(data[EngageAnalytics.CREATEDAT_NAME] || Date.now());
        return {
            $year: createdAt.getFullYear(),
            $month: createdAt.getMonth() + 1,
            $week: Math.floor(createdAt.getDate() / 7),
            $day: createdAt.getDate(),
        };
    };
    EngageAnalytics.prototype.groupValid = function (data, group) {
        var filter = group.filter;
        filter;
        return Object.keys(filter || {}).reduce(function (prev, curr) {
            if (!prev) {
                return prev;
            }
            if (curr.includes('$greater__')) {
                var field = curr.replace('$greater__', '');
                return data[field] > filter[curr];
            }
            if (curr.includes('$lesser__')) {
                var field = curr.replace('$lesser__', '');
                return data[field] < filter[curr];
            }
            return data[curr] === filter[curr];
        }, true);
    };
    EngageAnalytics.prototype.getGroup = function (doc, triggerData, model) {
        var _this = this;
        if (doc === void 0) { doc = {}; }
        var group = model.group;
        var data = triggerData.data;
        if (group && group.length && typeof group === 'object') {
            group.map(function (item) {
                if (_this.groupValid(data, item)) {
                    _this.applyAction(doc, data, item);
                }
            });
        }
        else if (typeof group === 'string') {
            doc[group] = data[group] || 1;
        }
        return doc;
    };
    EngageAnalytics.getGroupFields = function (group) {
        var fields = [];
        if (group && group.length && typeof group === 'object') {
            fields = group.map(function (item) { return item.field; });
        }
        else if (typeof group === 'string') {
            fields = [group];
        }
        return fields;
    };
    EngageAnalytics.getDataFromSnapshot = function (model, data) {
        var fields = EngageAnalytics.getGroupFields(model.group);
        var fieldDoc = {};
        fields.forEach(function (element) {
            fieldDoc[element] = data[element];
        });
        if (model.snapeshot === true) {
            fieldDoc = __assign({}, fieldDoc, data.data);
        }
        else if (typeof model.snapeshot === 'string') {
            fieldDoc[model.snapeshot] = data.data[model.snapeshot];
        }
        else if (typeof model.snapeshot === 'object' && model.snapeshot.length) {
            model.snapeshot.forEach(function (element) { return fieldDoc[element] = data.data[element]; });
        }
        return fieldDoc;
    };
    EngageAnalytics.buildDatasetDoc = function (model, data) {
        var fieldDoc = EngageAnalytics.getDataFromSnapshot(model, data);
        var dest = EngageAnalytics.createTriggerRef(data);
        var dataset = __assign({}, fieldDoc, { $action: model.action, $sourceRef: data.source || '', $destinationRef: dest || '', $userId: data.userId, $removed: false });
        return dataset;
    };
    EngageAnalytics.prototype.addAnalyticDoc = function (model, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var datasetDoc, dest, dates, dayRef, totalDoc, dayDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!model.allowDuplicates && (triggerData.action === 'update' || triggerData.action === 'write')) {
                            return [2 /*return*/, null];
                        }
                        datasetDoc = EngageAnalytics.buildDatasetDoc(model, triggerData);
                        dest = EngageAnalytics.createTriggerRef(triggerData);
                        dates = EngageAnalytics.getDates(triggerData.data);
                        dayRef = this.getAnalytics(dest);
                        return [4 /*yield*/, dayRef.get('total')];
                    case 1:
                        totalDoc = _a.sent();
                        return [4 /*yield*/, dayRef.getList(dayRef
                                .where('$year', '==', dates.$year)
                                .where('$month', '==', dates.$month)
                                .where('$week', '==', dates.$week)
                                .where('$day', '==', dates.$day))];
                    case 2:
                        dayDoc = ((_a.sent()) || [])[0];
                        if (model.allowDuplicates) {
                            delete datasetDoc['$id'];
                            delete datasetDoc['id'];
                        }
                        if (dayDoc) {
                            this.getGroup(dayDoc, triggerData, model);
                            dayDoc.$save();
                        }
                        if (totalDoc) {
                            this.getGroup(totalDoc, triggerData, model);
                            totalDoc.$save();
                        }
                        return [4 /*yield*/, EngageAnalytics.STORE.getInstance(dest + "/" + EngageAnalytics.DATASET_PATH).save(datasetDoc)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.removeAnalyticDoc = function (model, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.prototype.getAnalytic = function (docRef, dateRange) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldCollection;
            return __generator(this, function (_a) {
                fieldCollection = EngageAnalytics.STORE.getInstance(docRef + "/$analytics");
                return [2 /*return*/];
            });
        });
    };
    EngageAnalytics.getPathDetails = function (path) {
        var _a = path.split('/'), collection = _a[0], id = _a[1], subCollection = _a[2], subId = _a[3];
        return {
            collection: collection,
            id: id,
            subCollection: subCollection,
            subId: subId,
            name: "" + collection + ((subCollection || '').charAt(0).toUpperCase() + (subCollection || '').slice(1))
        };
    };
    EngageAnalytics.addRelationToDoc = function (doc, relation, relationId) {
        if (relation && relation[relation.length - 1].toLowerCase() === 's') {
            relation = relation.slice(0, -1);
        }
        return doc[relation + "Id"] = relationId;
    };
    EngageAnalytics.getDocRelations = function (doc) {
        return Object
            .keys(doc)
            .map(function (key) { return (key || '').length > 2 && (key || '').includes('Id') ? key.replace('Id', '') : ''; })
            .filter(function (item) { return item !== ''; });
    };
    EngageAnalytics.getGroupIdName = function (field) {
        var idField = '';
        if (field && field.includes('{') && field.includes('}')) {
            idField = field.replace('{', '').replace('}', '');
        }
        return idField;
    };
    EngageAnalytics.triggerParser = function (trigger) {
        var _a = trigger.split('/'), collection = _a[0], id = _a[1], subCollection = _a[2], subId = _a[3];
        var idField = EngageAnalytics.getGroupIdName(id);
        var subIdField = EngageAnalytics.getGroupIdName(subId);
        return {
            collection: collection,
            id: id,
            idField: idField,
            subCollection: subCollection,
            subId: subId,
            subIdField: subIdField,
        };
    };
    EngageAnalytics.createTriggerRef = function (triggerData, ref) {
        if (ref === void 0) { ref = false; }
        var data = triggerData.data, trigger = triggerData.trigger;
        var _a = EngageAnalytics.triggerParser(trigger), collection = _a.collection, idField = _a.idField, subCollection = _a.subCollection, subIdField = _a.subIdField;
        var path = '';
        if (collection && (data[idField] || data.$id)) {
            path += collection + "/" + (data[idField] || data.$id);
        }
        if (subCollection && data[subIdField]) {
            if (path)
                path += '/';
            path += subCollection + "/" + data[subIdField];
        }
        return ref ? path : EngageAnalytics.STORE.getInstance(path);
    };
    EngageAnalytics.buildTrigger = function (trigger, subCollection, ref) {
        if (ref === void 0) { ref = false; }
        var _a = EngageAnalytics.triggerParser(trigger), collection = _a.collection, idField = _a.idField, subIdField = _a.subIdField;
        var path = '';
        if (collection && collection[collection.length - 1].toLowerCase() === 's') {
            idField = collection.slice(0, -1) + 'Id';
        }
        if (subCollection && subIdField && subCollection[subCollection.length - 1].toLowerCase() === 's') {
            subIdField = subCollection.slice(0, -1) + 'Id';
        }
        if (collection && idField) {
            path += collection + "/{" + idField + "}";
        }
        if (subCollection && subIdField) {
            if (path)
                path += '/';
            path += subCollection + "/{" + subIdField + "}";
        }
        return ref ? path : EngageAnalytics.STORE.getInstance(path);
    };
    EngageAnalytics.ANALYTICS_PATH = '$analytics';
    EngageAnalytics.DATASET_PATH = '$dataset';
    EngageAnalytics.CREATEDAT_NAME = '$createAt';
    return EngageAnalytics;
}());
exports.EngageAnalytics = EngageAnalytics;
//# sourceMappingURL=analytics.js.map