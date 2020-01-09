"use strict";
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
var _ = require("lodash");
var EngageFireDoc = /** @class */ (function () {
    function EngageFireDoc($doc, collection, collections) {
        if (collections === void 0) { collections = []; }
        this.$doc = $doc;
        this.$loading = true;
        this.$collection = '';
        this.$collections = {};
        this.$collectionsList = [];
        this.$omitList = [];
        this.relations = [];
        this.$engageFireStore = EngageFireDoc.STORE.getInstance(collection);
        this.$collectionsList = collections;
        if (!_.isEmpty($doc) && ($doc.$id || $doc.id || this.$id)) {
            _.assign(this, $doc);
            this.$$init();
        }
    }
    EngageFireDoc.prototype.$$init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$engageFireStore.ready()];
                    case 1:
                        _a.sent();
                        this.$id = this.$doc.$id || this.$doc.id || this.$id;
                        this.$ref = this.$engageFireStore.ref;
                        this.$path = this.$ref.path + "/" + this.$id;
                        this.$collection = this.$ref.path;
                        if (this.$collectionsList && !this.$collectionsList.forEach)
                            return [2 /*return*/];
                        (this.$collectionsList || []).forEach(function (element) {
                            var _a = element.split('.'), sub = _a[0], preFetch = _a[1];
                            _this.$collections[sub + "_"] = EngageFireDoc.STORE.getInstance(_this.$path + "/" + sub);
                            _this.$omitList.push(sub + "_");
                            if (preFetch === 'list')
                                _this.$collections[sub + "_"].getList();
                            _.assign(_this, _this.$collections);
                        });
                        this.$loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFireDoc.prototype.$save = function () {
        this.$$updateDoc();
        return this.$engageFireStore.save(this.$doc);
    };
    EngageFireDoc.prototype.$update = function () {
        this.$$updateDoc();
        return this.$engageFireStore.update(this.$doc);
    };
    EngageFireDoc.prototype.$set = function () {
        this.$$updateDoc();
        return this.$engageFireStore.update(this.$doc);
    };
    EngageFireDoc.prototype.$get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.$engageFireStore.get(this.$id)];
                    case 1:
                        _a.$doc = _b.sent();
                        return [2 /*return*/, this.$doc];
                }
            });
        });
    };
    EngageFireDoc.prototype.$attachOwner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.$engageFireStore.getUserId()];
                    case 1:
                        _a.$owner = _c.sent();
                        this.$doc.$owner = this.$owner;
                        this.$$updateDoc();
                        _b = this;
                        return [4 /*yield*/, this.$engageFireStore.save(this.$doc)];
                    case 2:
                        _b.$doc = _c.sent();
                        return [2 /*return*/, this.$doc];
                }
            });
        });
    };
    EngageFireDoc.prototype.$isOwner = function (userId) {
        if (userId === void 0) { userId = this.$doc.$owner; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$attachOwner()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this.$owner;
                        return [4 /*yield*/, this.$engageFireStore.getUserId()];
                    case 3: return [2 /*return*/, _a === (_b.sent())];
                }
            });
        });
    };
    EngageFireDoc.prototype.$addFiles = function (elements, inputId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$$updateDoc();
                        return [4 /*yield*/, this.$engageFireStore.uploadFiles(this, elements, inputId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFireDoc.prototype.$setImage = function (options, inputId, file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$$updateDoc();
                        return [4 /*yield*/, this.$engageFireStore.uploadImage(this, inputId, file)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFireDoc.prototype.$removeImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$$updateDoc();
                        return [4 /*yield*/, this.$engageFireStore.deleteImage(this.$doc)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.$save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.$doc];
                }
            });
        });
    };
    EngageFireDoc.prototype.$removeFile = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$$updateDoc();
                        return [4 /*yield*/, this.$engageFireStore.deleteFile(this.$doc, fileId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.$doc];
                }
            });
        });
    };
    EngageFireDoc.prototype.$getFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$getSubCollection('$files')];
                    case 1: return [2 /*return*/, (_a.sent()).getList()];
                }
            });
        });
    };
    EngageFireDoc.prototype.$getFile = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$getSubCollection('$files')];
                    case 1: return [2 /*return*/, (_a.sent()).get(fileId)];
                }
            });
        });
    };
    EngageFireDoc.prototype.$downloadFile = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var fileDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$getSubCollection('$files')];
                    case 1:
                        fileDoc = (_a.sent()).get(fileId);
                        return [4 /*yield*/, this.$engageFireStore.downloadFile(fileDoc.url)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFireDoc.prototype.$remove = function (showConfirm) {
        if (showConfirm === void 0) { showConfirm = false; }
        return __awaiter(this, void 0, void 0, function () {
            var r, result;
            var _this = this;
            return __generator(this, function (_a) {
                if (showConfirm) {
                    r = confirm('Are you sure?');
                    if (!r)
                        return [2 /*return*/];
                }
                result = this.$engageFireStore.remove(this.$id);
                this.$engageFireStore.list = this.$engageFireStore.list.filter(function (item) { return item.$id !== _this.$id; });
                return [2 /*return*/, result];
            });
        });
    };
    EngageFireDoc.prototype.$getSubCollection = function (collection, db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, EngageFireDoc.STORE.getInstance(this.$path + "/" + this.$id + "/" + collection, db)];
            });
        });
    };
    EngageFireDoc.prototype.$watch = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$engageFireStore.watch(this.$id, cb)];
            });
        });
    };
    EngageFireDoc.prototype.$watchPromise = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$engageFireStore.watchPromise(this.$id)];
            });
        });
    };
    EngageFireDoc.prototype.$backup = function (deep, backupPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$$updateDoc();
                        return [4 /*yield*/, this.$engageFireStore.backupDoc(this.$doc, deep, backupPath)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFireDoc.prototype.$exists = function () {
        this.$$updateDoc();
        return !!this.$doc;
    };
    EngageFireDoc.prototype.$getModel = function () {
        return this.$engageFireStore.getModel();
    };
    EngageFireDoc.prototype.$changeId = function (newId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$engageFireStore.replaceIdOnCollection(this.$id, newId)];
                    case 1:
                        _a.sent();
                        this.$id = newId;
                        this.$$updateDoc();
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFireDoc.prototype.$swapPosition = function (x, y, list) {
        return __awaiter(this, void 0, void 0, function () {
            var itemX, itemY, itemXPos, itemYPos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = list || this.$$getSortedParentList();
                        if (!list.some(function (item) { return item.position === undefined; })) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$engageFireStore.buildListPositions()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        itemX = list[x];
                        itemY = list[y];
                        itemXPos = itemX.position || x + 1;
                        itemYPos = itemY.position || y + 1;
                        itemX.position = itemYPos;
                        itemY.position = itemXPos;
                        this.$engageFireStore.list[y] = itemX;
                        this.$engageFireStore.list[x] = itemY;
                        return [4 /*yield*/, itemX.$save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, itemY.$save()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFireDoc.prototype.$moveUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = this.$$getSortedParentList();
                        index = list.findIndex(function (item) { return item.position === _this.position; });
                        if (index <= 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.$swapPosition(index, index - 1, list)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFireDoc.prototype.$moveDown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = this.$$getSortedParentList();
                        index = list.findIndex(function (item) { return item.position === _this.position; });
                        if (index >= list.length - 1) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.$swapPosition(index, index + 1, list)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
      RELATIONS
    */
    EngageFireDoc.prototype.$addRelation = function (relation, relationId, save) {
        if (save === void 0) { save = true; }
        if (relation && relation[relation.length - 1].toLowerCase() === 's') {
            relation = relation.slice(0, -1);
        }
        var newDoc = {};
        newDoc[relation + "Id"] = relationId;
        _.assign(this, newDoc);
        this.$$updateDoc();
        if (save)
            this.$save();
    };
    EngageFireDoc.prototype.$getRelations = function () {
        return Object
            .keys(this.$doc)
            .map(function (key) { return (key || '').length > 2 && (key || '').includes('Id') ? key.replace('Id', '') : ''; })
            .filter(function (item) { return item !== ''; });
    };
    // https://stackoverflow.com/questions/46568850/what-is-firestore-reference-data-type-good-for
    EngageFireDoc.prototype.$addReference = function (ref, name, save) {
        if (save === void 0) { save = true; }
        var newDoc = {};
        newDoc[name + "Ref"] = ref;
        _.assign(this, newDoc);
        this.$$updateDoc();
        if (save)
            this.$save();
    };
    EngageFireDoc.prototype.$getReferences = function () {
        return Object
            .keys(this.$doc)
            .map(function (key) { return (key || '').length > 2 && (key || '').includes('Ref') ? key.replace('Ref', '') : ''; })
            .filter(function (item) { return item !== ''; });
    };
    /*  */
    EngageFireDoc.prototype.$getPath = function () {
        return (this.$path || '').split('/');
    };
    /*  */
    EngageFireDoc.prototype.$$getSortedParentList = function () {
        return this.$engageFireStore.sortListByPosition().list;
    };
    EngageFireDoc.prototype.$$updateDoc = function (doc) {
        if (doc === void 0) { doc = this; }
        this.$doc = this.$engageFireStore.omitFire(_.cloneDeep(doc));
        return this.$doc;
    };
    EngageFireDoc.prototype.$$difference = function (object, base) {
        function changes(object, base) {
            return _.transform(object, function (result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    };
    return EngageFireDoc;
}());
exports.default = EngageFireDoc;
//# sourceMappingURL=doc.js.map