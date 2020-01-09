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
    [ ] allow destination building to parent collection from child
*/
var EngageAnalytics = /** @class */ (function () {
    function EngageAnalytics(path) {
        this.path = path;
        this.debug = false;
    }
    EngageAnalytics.prototype.triggerUpdate = function (models, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(models || []).length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getModels()];
                    case 1:
                        models = _a.sent();
                        _a.label = 2;
                    case 2:
                        promises = models.map(function (model) {
                            if (triggerData.action === 'remove' && !model.final) {
                                return _this.subtractDoc(model, triggerData);
                            }
                            return _this.addDoc(model, triggerData);
                        });
                        return [4 /*yield*/, Promise.all(promises).then(function (_) { return _this.report('triggerUpdate finished', _); })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.enableDebug = function () {
        this.debug = true;
        return this;
    };
    EngageAnalytics.prototype.report = function (title, value) {
        if (this.debug) {
            console.log("report " + title + ":", value);
        }
    };
    EngageAnalytics.prototype.addDoc = function (model, doc) {
        return this.addAnalyticDoc(model, doc);
    };
    EngageAnalytics.prototype.subtractDoc = function (model, doc) {
        return this.removeAnalyticDoc(model, doc);
    };
    EngageAnalytics.prototype.getAnalytics = function (dest) {
        var col = EngageAnalytics.STORE.getInstance(dest + "/" + EngageAnalytics.ANALYTICS_PATH);
        return col;
    };
    EngageAnalytics.prototype.getDataset = function (dest) {
        return EngageAnalytics.STORE.getInstance(dest + "/" + EngageAnalytics.DATASET_PATH);
    };
    EngageAnalytics.prototype.applyAction = function (doc, data, group) {
        var dataField = data[group.fieldValue] || data[group.field];
        var num = typeof dataField === 'number' ? dataField : 1;
        this.report("EngageAnalytics.applyAction(" + group.field + ")", dataField);
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
        return doc;
    };
    EngageAnalytics.prototype.getModelRef = function () {
        var details = EngageAnalytics.triggerParser(this.path);
        if (details.subCollection) {
            return EngageAnalytics.STORE
                .getInstance("$collections/" + details.collection + "/$analyticModels/" + details.subCollection + "/$analyticModels");
        }
        return EngageAnalytics.STORE
            .getInstance("$collections/" + details.collection + "/$analyticModels");
    };
    EngageAnalytics.prototype.getModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getModelRef().getList()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.getModelByField = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var ref;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ref = this.getModelRef();
                        return [4 /*yield*/, ref.getList(ref.ref.where('field', '==', field))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAnalytics.prototype.addModel = function (doc) {
        return this.getModelRef().save(doc);
    };
    EngageAnalytics.getDates = function (data) {
        var createdAt = new Date((data || {})[EngageAnalytics.CREATEDAT_NAME] || Date.now());
        return {
            $year: createdAt.getFullYear(),
            $month: createdAt.getMonth() + 1,
            $week: Math.floor(createdAt.getDate() / 7) + 1,
            $day: createdAt.getDate(),
        };
    };
    EngageAnalytics.prototype.groupValid = function (data, group) {
        var filter = group.filter;
        if (!filter)
            return true;
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
        doc['$counter'] = doc['$counter'] || 0;
        if (group && group.length && typeof group === 'object') {
            group.map(function (item) {
                _this.report("groupValid (" + item.field + ")", { data: data, item: item, valid: _this.groupValid(data, item) });
                if (_this.groupValid(data, item)) {
                    _this.applyAction(doc, data, item);
                }
            });
        }
        else if (typeof group === 'string') {
            doc[group] = data[group] || 1;
        }
        if ((triggerData.action === 'remove')) {
            doc['$counter'] -= 1;
        }
        else {
            doc['$counter'] += 1;
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
    EngageAnalytics.getDataFromSnapshot = function (model, triggerData, analyticData) {
        var fields = EngageAnalytics.getGroupFields(model.group);
        var fieldDoc = {};
        fields.forEach(function (element) {
            fieldDoc[element] = analyticData[element];
        });
        if (model.snapeshot === true) {
            fieldDoc = __assign({}, fieldDoc, triggerData.data);
        }
        else if (typeof model.snapeshot === 'string') {
            fieldDoc[model.snapeshot] = triggerData.data[model.snapeshot];
        }
        else if (typeof model.snapeshot === 'object' && model.snapeshot.length) {
            model.snapeshot.forEach(function (element) { return fieldDoc[element] = triggerData.data[element]; });
        }
        return fieldDoc;
    };
    EngageAnalytics.buildDatasetDoc = function (model, triggerData, analyticData) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldDoc, dest, dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldDoc = EngageAnalytics.getDataFromSnapshot(model, triggerData, analyticData);
                        return [4 /*yield*/, EngageAnalytics.createDestinationRef(triggerData, model)];
                    case 1:
                        dest = _a.sent();
                        dataset = __assign({}, fieldDoc, { $action: triggerData.action, $sourceRef: triggerData.source || '', $destinationRef: dest || '', $userId: triggerData.userId, $trigger: triggerData.trigger, $removed: false });
                        if (model.allowDuplicates) {
                            delete dataset['$id'];
                            delete dataset['id'];
                        }
                        return [2 /*return*/, dataset];
                }
            });
        });
    };
    EngageAnalytics.prototype.addAnalyticDoc = function (model, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var dest, dates, dayRef, totalDoc, dayDoc, justDocGroup, datasetDoc, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!model.allowDuplicates && (triggerData.action === 'update' || triggerData.action === 'write')) {
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, EngageAnalytics.createDestinationRef(triggerData, model)];
                    case 2:
                        dest = _a.sent();
                        dates = EngageAnalytics.getDates(triggerData.data);
                        dayRef = this.getAnalytics(dest);
                        return [4 /*yield*/, dayRef.get('total')];
                    case 3:
                        totalDoc = (_a.sent()) || { $id: 'total' };
                        return [4 /*yield*/, dayRef.getList(dayRef.ref
                                .where('$year', '==', dates.$year)
                                .where('$month', '==', dates.$month)
                                .where('$week', '==', dates.$week)
                                .where('$day', '==', dates.$day))];
                    case 4:
                        dayDoc = ((_a.sent()) || [])[0] || __assign({ $id: dates.$year + "_" + dates.$month + "_" + dates.$week + "_" + dates.$day }, dates);
                        this.getGroup(dayDoc, triggerData, model);
                        this.report('getGroup (dayDoc)', dayDoc);
                        return [4 /*yield*/, dayRef.save(dayDoc)];
                    case 5:
                        _a.sent();
                        this.getGroup(totalDoc, triggerData, model);
                        this.report('getGroup (totalDoc)', dayDoc);
                        return [4 /*yield*/, dayRef.save(totalDoc)];
                    case 6:
                        _a.sent();
                        justDocGroup = {};
                        this.getGroup(justDocGroup, triggerData, model);
                        return [4 /*yield*/, EngageAnalytics.buildDatasetDoc(model, triggerData, justDocGroup)];
                    case 7:
                        datasetDoc = _a.sent();
                        this.report('datasetDoc', datasetDoc);
                        return [4 /*yield*/, this.getDataset(dest).save(datasetDoc)];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9:
                        error_1 = _a.sent();
                        console.error("EngageAnalytics.addAnalyticDoc(" + triggerData.source + ")", error_1, model, triggerData);
                        return [2 /*return*/, null];
                    case 10: return [2 /*return*/];
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
        if (trigger === void 0) { trigger = ''; }
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
    EngageAnalytics.createSourceRef = function (triggerData, ref) {
        if (ref === void 0) { ref = false; }
        var path = '';
        var parent = '';
        var data = triggerData.data, trigger = triggerData.trigger;
        var _a = EngageAnalytics.triggerParser(trigger), collection = _a.collection, idField = _a.idField, subCollection = _a.subCollection, subIdField = _a.subIdField;
        if (data && data.$path) {
            path = data.$path;
        }
        else if (subCollection && triggerData[subIdField]) {
            parent = collection + "/" + triggerData[idField];
            path = collection + "/" + triggerData[idField] + "/" + subCollection + "/" + triggerData[subIdField];
        }
        else if (collection && triggerData[idField]) {
            path = collection + "/" + triggerData[idField];
        }
        return !ref ? [path, parent] : [EngageAnalytics.STORE.getInstance(path), EngageAnalytics.STORE.getInstance(parent)];
    };
    EngageAnalytics.createDestinationRef = function (triggerData, model, ref) {
        if (ref === void 0) { ref = false; }
        return __awaiter(this, void 0, void 0, function () {
            var data, path, parent, _a, collection, idField, subCollection, subIdField, baseCollection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = triggerData.data;
                        path = '';
                        _a = EngageAnalytics.triggerParser(model.destination), collection = _a.collection, idField = _a.idField, subCollection = _a.subCollection, subIdField = _a.subIdField;
                        if (!triggerData.sourceParent) return [3 /*break*/, 2];
                        baseCollection = EngageAnalytics.STORE.getInstance(triggerData.collection);
                        return [4 /*yield*/, baseCollection.get(triggerData.id)];
                    case 1:
                        parent = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (subCollection && parent && parent[idField]) {
                            path = collection + "/" + parent[idField] + "/" + subCollection + "/" + data.$id;
                        }
                        else if (collection && parent && parent[idField]) {
                            path = collection + "/" + parent[idField];
                        }
                        return [2 /*return*/, !ref ? path : EngageAnalytics.STORE.getInstance(path)];
                }
            });
        });
    };
    EngageAnalytics.restore = function (models, triggerData, startDate) {
        return __awaiter(this, void 0, void 0, function () {
            var groupDate, ref, docs, doc, _a, collection, id, subCollection, subId, docSpecific;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        groupDate = new Date(startDate);
                        ref = EngageAnalytics.STORE.getInstance(triggerData.subCollection || triggerData.collection).options({ collectionGroup: true });
                        return [4 /*yield*/, ref.getList(ref.ref.where('createdAt', '>', groupDate.getTime()))];
                    case 1:
                        docs = (_b.sent()) || [];
                        _b.label = 2;
                    case 2:
                        if (!docs.length) return [3 /*break*/, 4];
                        doc = docs.pop();
                        _a = doc.$getPath(), collection = _a[0], id = _a[1], subCollection = _a[2], subId = _a[3];
                        docSpecific = __assign({}, triggerData, { data: doc });
                        docSpecific.id = id;
                        docSpecific.id = subId;
                        return [4 /*yield*/, new EngageAnalytics(triggerData.trigger).triggerUpdate(models, docSpecific)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EngageAnalytics.ANALYTICS_PATH = '$analytics';
    EngageAnalytics.DATASET_PATH = '$dataset';
    EngageAnalytics.CREATEDAT_NAME = '$createAt';
    return EngageAnalytics;
}());
exports.EngageAnalytics = EngageAnalytics;
//# sourceMappingURL=analytics.js.map