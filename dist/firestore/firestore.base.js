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
var _ = require("lodash");
var pubsub_1 = require("../pubsub/pubsub");
var algolia_1 = require("../algolia/algolia");
/*
 * TODO:
 * [X] Show upload progress
 * [X] Handle file uploads better
 * [X] Add types (models) to doc in class
 * [X] Change doc methods to doc prototype methods. Maybe make a class?
 * [ ] Implement State Manage,
 * [ ] Create query system that can save query models
 * [ ] Fully test everything!
 * [ ] Add Model system
 * [ ] Integrate User name ($getUserName)
 * */
var EngageFirestoreBase = /** @class */ (function () {
    function EngageFirestoreBase(path) {
        this.path = path;
        this.$loading = true;
        this.userId = '';
        this.state = {};
        this.ps = pubsub_1.engagePubsub;
        this.firebaseReady = false;
        this.checkTime = 200;
        this.checkLimit = 50;
        this.debug = false;
        this.subCollections = [];
        this.list = [];
        this.model = [];
        this.omitList = [
            '$key',
            '$value',
            '$exists',
            '$params',
            '$ref',
            '$save',
            '$update',
            '$set',
            '$get',
            '$attachOwner',
            '$addFiles',
            '$setImage',
            '$removeImage',
            '$removeFile',
            '$downloadFile',
            '$remove',
            '$watch',
            '$watchPromise',
            '$isOwner',
            '$getFile',
            '$getFiles',
            '$path',
            '$backup',
            '$engageFireStore',
            '$owner',
            '$doc',
            '$collections',
            '$$difference',
            '$$updateDoc',
            '$$init',
            '$getProgress',
            '$omitList',
            '$collectionsList',
            '$loading',
            '$getSubCollection',
            '$$getSortedParentList',
            '$moveDown',
            '$moveUp',
            '$swapPosition',
            '$changeId',
            '$getModel',
        ];
        this.sortedBy = '';
        this.init();
    }
    EngageFirestoreBase.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(EngageFirestoreBase.ENGAGE_FIRE);
                        if (!EngageFirestoreBase.ENGAGE_FIRE) {
                            console.error('MISSING ENGAGE_FIRE class');
                        }
                        if (!EngageFirestoreBase.DOC) {
                            console.error('MISSING EngageDoc Class');
                        }
                        // if (!EngageFirestoreBase.FIRE_OPTIONS) {
                        //   console.error('MISSING FIRE_OPTIONS class');
                        // }
                        return [4 /*yield*/, EngageFirestoreBase.ENGAGE_FIRE(EngageFirestoreBase.FIRE_OPTIONS).ready()];
                    case 1:
                        // if (!EngageFirestoreBase.FIRE_OPTIONS) {
                        //   console.error('MISSING FIRE_OPTIONS class');
                        // }
                        _a.sent();
                        if (!this.db) {
                            this.db = EngageFirestoreBase.ENGAGE_FIRE(EngageFirestoreBase.FIRE_OPTIONS).firestore;
                        }
                        EngageFirestoreBase.STATE = EngageFirestoreBase.STATE || {};
                        if (!EngageFirestoreBase.STATE[this.path]) {
                            EngageFirestoreBase.STATE[this.path] = {};
                            this.state = EngageFirestoreBase.STATE[this.path];
                        }
                        if (_.isString(this.path)) {
                            this.ref = this.db.collection(this.path);
                        }
                        else {
                            this.ref = this.path;
                        }
                        if (this.appInitialized() && EngageFirestoreBase.ENGAGE_FIRE.auth && EngageFirestoreBase.ENGAGE_FIRE.auth.currentUser) {
                            this.$user = EngageFirestoreBase.ENGAGE_FIRE.auth.currentUser;
                            this.publish(this.$user, 'user');
                            if (this.$user) {
                                this.userId = this.$user.uid;
                                if (this.debug)
                                    console.log('userId', this.userId);
                            }
                        }
                        this.firebaseReady = true;
                        return [4 /*yield*/, this.getModelFromDb()];
                    case 2:
                        _a.sent();
                        this.$loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.addSubCollections = function (collections) {
        this.subCollections = this.subCollections.concat(collections);
        return this;
    };
    EngageFirestoreBase.prototype.toggleDebug = function () {
        this.debug = !this.debug;
    };
    EngageFirestoreBase.prototype.canSub = function () {
        return !!this.ps;
    };
    EngageFirestoreBase.prototype.publish = function (data, what) {
        return this.ps.publish(data, what);
    };
    EngageFirestoreBase.prototype.subscribe = function (what, listener) {
        return this.ps.subscribe(what, listener);
    };
    EngageFirestoreBase.prototype.ready = function () {
        var _this = this;
        var limit = this.checkLimit;
        var interval;
        if (this.firebaseReady)
            return Promise.resolve(this.userId);
        return new Promise(function (resolve, reject) {
            interval = setInterval(function () {
                limit--;
                if (_this.firebaseReady) {
                    clearInterval(interval);
                    resolve(_this.userId);
                }
                else if (limit < 0) {
                    clearInterval(interval);
                    reject('timed out');
                }
            }, _this.checkTime);
        });
    };
    EngageFirestoreBase.prototype.appInitialized = function () {
        return EngageFirestoreBase.ENGAGE_FIRE.initialized;
    };
    EngageFirestoreBase.prototype.getUserFromAuth = function () {
        return this.$user;
    };
    EngageFirestoreBase.prototype.getCollection = function () {
        return this.ref;
    };
    EngageFirestoreBase.prototype.getDoc = function (id) {
        return this.ref.doc(id);
    };
    EngageFirestoreBase.prototype.getSubCollection = function (id, collectionName) {
        return this.ref.doc(id).collection(collectionName);
    };
    EngageFirestoreBase.prototype.getId = function () {
        return this.id;
    };
    EngageFirestoreBase.prototype.setId = function (id) {
        this.id = id;
    };
    EngageFirestoreBase.prototype.getAll = function () {
        return this.ref.get();
    };
    EngageFirestoreBase.prototype.options = function (options) {
        if (options === void 0) { options = { loadList: true }; }
        if (options.loadList) {
            this.getList();
        }
        return this;
    };
    EngageFirestoreBase.prototype.getChildDocs = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, key, element, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = [];
                        for (_b in doc)
                            _a.push(_b);
                        _i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        if (!doc.hasOwnProperty(key)) return [3 /*break*/, 3];
                        element = doc[key];
                        if (!(element && element.$id && element.$collection)) return [3 /*break*/, 3];
                        _c = doc;
                        _d = key;
                        return [4 /*yield*/, EngageFirestoreBase.getInstance(element.$collection).get(element.$id)];
                    case 2:
                        _c[_d] = _e.sent();
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, doc];
                }
            });
        });
    };
    // get data with ids added
    EngageFirestoreBase.prototype.getList = function (ref) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$loading = true;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        return [4 /*yield*/, ref.get()];
                    case 2:
                        list = _a.sent();
                        this.list = this.addFireList(list);
                        this.$loading = false;
                        return [2 /*return*/, this.list];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.getOnce = function (docId, pure) {
        if (docId === void 0) { docId = this.id; }
        if (pure === void 0) { pure = false; }
        return __awaiter(this, void 0, void 0, function () {
            var doc, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$loading = true;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.ref.doc(docId).get()];
                    case 3:
                        doc = _a.sent();
                        this.$loading = false;
                        if (pure) {
                            return [2 /*return*/, doc];
                        }
                        else if (doc.exists) {
                            return [2 /*return*/, this.addFire(doc.data(), docId)];
                        }
                        return [2 /*return*/, null];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.getWithChildern = function (docId, ref) {
        if (docId === void 0) { docId = this.id; }
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.get(docId, ref)];
                    case 2:
                        doc = _a.sent();
                        if (!doc) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getChildDocs(doc)];
                    case 3:
                        doc = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, doc];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.get = function (docId, ref) {
        if (docId === void 0) { docId = this.id; }
        return __awaiter(this, void 0, void 0, function () {
            var doc, fireDoc_1, index, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$loading = true;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, ref.doc(docId).get()];
                    case 3:
                        doc = _a.sent();
                        this.$loading = false;
                        if (doc.exists) {
                            fireDoc_1 = this.addFire(doc.data(), docId);
                            index = this.list.findIndex(function (item) { return item.$id === fireDoc_1.$id; });
                            if (index > -1)
                                this.list[index] = fireDoc_1;
                            else
                                this.list.push(fireDoc_1);
                            return [2 /*return*/, fireDoc_1];
                        }
                        return [2 /*return*/, null];
                    case 4:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.add = function (newDoc, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var blank;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newDoc.$loading = true;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        if (newDoc && (newDoc.$key || newDoc.$id)) {
                            newDoc.$loading = false;
                            return [2 /*return*/, this.update(newDoc, ref)];
                        }
                        if (this.debug)
                            console.log("add", newDoc);
                        newDoc = this.omitFire(newDoc);
                        blank = ref.doc();
                        return [4 /*yield*/, blank.set(newDoc)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.addFire(newDoc, blank.id)];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.set = function (newDoc, docRef) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(docRef);
                        newDoc.$loading = true;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (this.debug)
                            console.log("set", newDoc);
                        newDoc = this.omitFire(newDoc);
                        return [4 /*yield*/, docRef.set(newDoc)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.addFire(newDoc, docRef.id)];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.setWithId = function (id, newDoc) {
        return this.set(newDoc, this.ref.doc(id));
    };
    EngageFirestoreBase.prototype.update = function (doc, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var docRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc.$loading = true;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        if (!doc.$id) return [3 /*break*/, 3];
                        docRef = ref.doc(doc.$id);
                        doc.$loading = false;
                        return [4 /*yield*/, docRef.get()];
                    case 2:
                        if (!(_a.sent()).exists)
                            return [2 /*return*/, this.set(doc, docRef)];
                        return [3 /*break*/, 6];
                    case 3:
                        if (!doc.$key) return [3 /*break*/, 5];
                        docRef = ref.doc(doc.$key);
                        doc.$loading = false;
                        return [4 /*yield*/, docRef.get()];
                    case 4:
                        if (!(_a.sent()).exists)
                            return [2 /*return*/, this.set(doc, docRef)];
                        return [3 /*break*/, 6];
                    case 5:
                        if (!ref.id) {
                            doc.$loading = false;
                            throw 'no id';
                        }
                        _a.label = 6;
                    case 6:
                        if (this.debug)
                            console.log("updated", doc);
                        doc = this.omitFire(doc);
                        return [4 /*yield*/, docRef.update(doc)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, this.addFire(doc, docRef.id)];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.save = function (newDoc, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        newDoc = this.omitFire(newDoc);
                        newDoc.updatedAt = Date.now();
                        if (!(newDoc && (newDoc.$key || newDoc.$id))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.update(newDoc, ref)];
                    case 2:
                        doc = _a.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(ref && ref.id)) return [3 /*break*/, 5];
                        newDoc.createdAt = Date.now();
                        return [4 /*yield*/, this.set(newDoc, ref)];
                    case 4:
                        doc = _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        newDoc.createdAt = Date.now();
                        return [4 /*yield*/, this.add(newDoc, ref)];
                    case 6:
                        doc = _a.sent();
                        this.list = this.list.concat([doc]);
                        _a.label = 7;
                    case 7:
                        doc.$loading = false;
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.saveWithId = function (id, newDoc) {
        return this.save(newDoc, this.ref.doc(id));
    };
    EngageFirestoreBase.prototype.remove = function (id, ref) {
        if (!ref)
            ref = this.ref;
        if (this.debug)
            console.log('removing: ', id);
        return ref.doc(id).delete();
    };
    EngageFirestoreBase.prototype.addFireList = function (collection) {
        var _this = this;
        var list = [];
        if (collection && collection.size) {
            collection.forEach(function (doc) {
                if (doc.exists) {
                    list.push(_this.addFire(doc.data(), doc.id));
                }
            });
        }
        return list;
    };
    EngageFirestoreBase.prototype.addFire = function (obj, id) {
        if (_.isObject(EngageFirestoreBase.DOC)) {
            obj.$id = id;
            return new EngageFirestoreBase.DOC(obj, this.path, this.subCollections);
        }
        return obj;
    };
    EngageFirestoreBase.prototype.omitFireList = function (list) {
        var _this = this;
        _.each(list, function (val, i) {
            list[i] = _this.omitFire(val);
        });
        return list;
    };
    EngageFirestoreBase.prototype.omitFire = function (payload) {
        var _this = this;
        if (payload && payload.$omitList) {
            payload = _.omit(payload, payload.$omitList);
        }
        var omitted = _.omit(payload, this.omitList);
        _.forIn(omitted, function (val, i) {
            if (_.isArray(val)) {
                omitted[i] = val.map(function (item) {
                    if (!_.isArray(val) && _.isObject(item)) {
                        _this.omitFire(item);
                    }
                    return item;
                });
            }
            else if (_.isObject(val)) {
                omitted[i] = _this.omitFire(val);
                if (val && val[i] && val[i].$id) {
                    omitted[i] = {
                        $id: val[i].$id,
                        $collection: val[i].$collection || i + 's',
                        $image: val[i].$image || '',
                        name: val[i].name || '',
                    };
                }
            }
        });
        return omitted;
    };
    EngageFirestoreBase.prototype.getFirebaseProjectId = function () {
        return EngageFirestoreBase.ENGAGE_FIRE.getFirebaseProjectId();
    };
    /*
     * Firestore Base
     */
    EngageFirestoreBase.prototype.watch = function (id, cb, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        ref.doc(id).onSnapshot(function (doc) {
                            if (doc && doc.data()) {
                                cb(_this.addFire(doc.data(), doc.id), doc);
                            }
                            else {
                                cb(null, doc);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.watchList = function (cb, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        ref.onSnapshot(function (snapshot) {
                            if (_.isArray(cb)) {
                                cb = _this.addFireList(snapshot);
                            }
                            else {
                                cb(_this.addFireList(snapshot));
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.watchPromise = function (id, ref) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        ref.doc(id).onSnapshot(function (doc) {
                            if (doc && doc.data()) {
                                resolve({ value: _this.addFire(doc.data(), doc.id), doc: doc });
                            }
                            else {
                                resolve({ value: null, doc: doc });
                            }
                        }, reject);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    EngageFirestoreBase.prototype.watchListPromise = function (ref) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        ref.onSnapshot(function (snapshot) {
                            resolve({ list: _this.addFireList(snapshot), snapshot: snapshot });
                        }, reject);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /* State Management */
    EngageFirestoreBase.prototype.watchState = function (name) {
        this.state[name];
    };
    EngageFirestoreBase.prototype.setState = function (name) {
        this.state[name];
    };
    EngageFirestoreBase.prototype.getState = function (name) {
        this.state[name];
    };
    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     */
    EngageFirestoreBase.prototype.deleteCollection = function (collectionRef, batchSize) {
        var _this = this;
        if (collectionRef === void 0) { collectionRef = this.ref; }
        if (batchSize === void 0) { batchSize = 50; }
        var query = collectionRef.limit(batchSize);
        return new Promise(function (resolve, reject) {
            _this.deleteQueryBatch(_this.db, query, batchSize, resolve, reject);
        });
    };
    EngageFirestoreBase.prototype.deleteQueryBatch = function (db, query, batchSize, resolve, reject) {
        return __awaiter(this, void 0, void 0, function () {
            var numDeleted, snapshot, batch_1, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        numDeleted = 0;
                        return [4 /*yield*/, query.get()];
                    case 1:
                        snapshot = _a.sent();
                        if (!(snapshot.size == 0)) return [3 /*break*/, 2];
                        numDeleted = 0;
                        return [3 /*break*/, 4];
                    case 2:
                        batch_1 = db.batch();
                        snapshot.docs.forEach(function (doc) {
                            batch_1.delete(doc.ref);
                        });
                        return [4 /*yield*/, batch_1.commit()];
                    case 3:
                        _a.sent();
                        numDeleted = snapshot.size;
                        _a.label = 4;
                    case 4:
                        if (numDeleted <= batchSize) {
                            resolve();
                            return [2 /*return*/];
                        }
                        // Recurse on the next process tick, to avoid
                        // exploding the stack.
                        process.nextTick(function () {
                            _this.deleteQueryBatch(db, query, batchSize, resolve, reject);
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        reject(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /*
     * UTILITIES
     */
    EngageFirestoreBase.prototype.replaceId = function (oldId, newId, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!ref)
                            ref = this.ref;
                        return [4 /*yield*/, this.get(oldId, ref)];
                    case 2:
                        data = _a.sent();
                        if (data === null) {
                            console.log('cant find record for: ' + oldId);
                            return [2 /*return*/, 'cant find record'];
                        }
                        data = this.addFire(data, newId);
                        return [4 /*yield*/, this.save(data)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.remove(oldId, ref)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.replaceIdOnCollection = function (oldId, newId, subRef) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (!subRef) {
                            subRef = this.ref;
                        }
                        return [4 /*yield*/, this.get(oldId, subRef)];
                    case 2:
                        data = _a.sent();
                        if (data === null) {
                            console.log('cant find record for: ' + oldId);
                            return [2 /*return*/, 'cant find record'];
                        }
                        data = this.addFire(data, newId);
                        return [4 /*yield*/, this.save(data, subRef)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.remove(oldId, subRef)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.moveRecord = function (oldPath, newPath) {
        return __awaiter(this, void 0, void 0, function () {
            var record, doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.db)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.db.doc(oldPath).get()];
                    case 1:
                        record = _a.sent();
                        record = record.data();
                        console.log('record move', record);
                        return [4 /*yield*/, this.db.doc(newPath).set(record)];
                    case 2:
                        _a.sent();
                        doc = this.db.doc(oldPath);
                        return [4 /*yield*/, doc.remove()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.copyRecord = function (oldPath, newPath, updateTimestamp) {
        if (updateTimestamp === void 0) { updateTimestamp = false; }
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.db)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.db.doc(oldPath).get()];
                    case 1:
                        record = _a.sent();
                        record = record.data();
                        if (updateTimestamp)
                            record.updatedAt = Date.now();
                        console.log('record move', record);
                        return [4 /*yield*/, this.db.doc(newPath).set(record)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.backupDoc = function (doc, deep, backupPath) {
        if (deep === void 0) { deep = true; }
        if (backupPath === void 0) { backupPath = '_backups'; }
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, ef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('deep', deep);
                        timestamp = Date.now();
                        if (!doc)
                            return [2 /*return*/, Promise.reject('Missing Doc')];
                        ef = EngageFirestoreBase.getInstance(backupPath + '/' + timestamp + '/' + doc.$path);
                        doc.$backupAt = timestamp;
                        return [4 /*yield*/, doc.$save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, ef.save(__assign({}, doc, { updatedAt: timestamp }))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // async backupCollection(collection, deep = true, backupPath = '_backups') {
    //   const ef = new EngageFirestore(collection.path);
    //   await Promise.all((await ef.getList()).map(async doc => {
    //     await this.backupDoc(doc, backupPath);
    //     doc.$subCollections
    //     if (collection && collection.subCollections.length) {
    //       return await Promise.all(collection.subCollections.map((subCollection: EngageICollection) => {
    //         subCollection.path = subCollection.path + '/' + doc.$id;
    //         return this.backupCollection(subCollection, backupPath);
    //       }));
    //     } else {
    //       return true;
    //     }
    //
    //     return await this.backupDoc(doc, backupPath);
    //   }));
    // }
    /* TODO: */
    EngageFirestoreBase.prototype.restore = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /*
      Model
    */
    EngageFirestoreBase.prototype.addModelField = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var model, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        model = {
                            $collection: this.path,
                            name: '',
                            label: _.capitalize(_.startCase(field))
                        };
                        if (typeof field === 'string') {
                            model.name = field;
                        }
                        else {
                            model = __assign({}, model, field);
                        }
                        _a = this;
                        _c = (_b = this.model).concat;
                        return [4 /*yield*/, EngageFirestoreBase.getInstance("$collections/" + this.path + "/$models").save(model)];
                    case 1:
                        _a.model = _c.apply(_b, [[
                                _d.sent()
                            ]]);
                        return [2 /*return*/, this.model];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.getModelField = function (field) {
        return EngageFirestoreBase.getInstance("$collections/" + this.path + "/$models").get(field);
    };
    EngageFirestoreBase.prototype.getModel = function () {
        return this.model;
    };
    EngageFirestoreBase.prototype.getModelFromDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.path.includes('$collections')) {
                            return [2 /*return*/, this.model = []];
                        }
                        _a = this;
                        return [4 /*yield*/, EngageFirestoreBase.getInstance("$collections/" + this.path + "/$models").getList()];
                    case 1:
                        _a.model = _b.sent();
                        this.sortModel();
                        return [2 /*return*/, this.model];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.sortModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.sortListByPosition(false, false, this.model);
                return [2 /*return*/, this];
            });
        });
    };
    /*
      Files
    */
    EngageFirestoreBase.prototype.deleteFile = function (doc, fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var fileDoc, desertRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, doc.$getSubCollection('files').get(fileId)];
                    case 1:
                        fileDoc = _a.sent();
                        desertRef = EngageFirestoreBase.ENGAGE_FIRE(EngageFirestoreBase.FIRE_OPTIONS).storage.child(fileDoc.meta.storagePath);
                        return [4 /*yield*/, desertRef.delete().then(function () { return fileDoc.$remove(); })];
                    case 2: 
                    // Delete the file
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.deleteImage = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var desertRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        desertRef = EngageFirestoreBase.ENGAGE_FIRE(EngageFirestoreBase.FIRE_OPTIONS).storage.child(doc.$imageMeta.storagePath);
                        return [4 /*yield*/, desertRef.delete().then(function () {
                                doc.$image = null;
                                doc.$thumbnail = null;
                                doc.$imageOrginal = null;
                                doc.$imageMeta = null;
                            })];
                    case 1: 
                    // Delete the file
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // async secureDoc(doc, allowedPermissions) {
    //   doc.$$secure = true;
    //   doc.$$allowed = allowedPermissions;
    //   return await this.save(doc);
    // }
    //
    // async allowUserAccess(doc, id, permission) {
    //   return await doc.$collection('_permission').save({
    //     $id: id,
    //     permission: permission
    //   });
    // }
    //
    // async addPermission(id, permission) {
    //   const users = new EngageFirestore('_users/' + id + '/permissions');
    //   const permissions = new EngageFirestore('_permissions/' + permission.$id + '/routes');
    //   await users.save({
    //     $id: id,
    //     permission: permission
    //   });
    //   return await permissions.save({
    //     $id: id,
    //     permission: permission
    //   });
    // }
    //
    // async removePermission() {
    //
    // }
    //
    // async checkPermission() {
    //
    // }
    EngageFirestoreBase.prototype.search = function (query, filters, debug) {
        if (debug === void 0) { debug = false; }
        var index = algolia_1.EngageAlgolia.getIndex(this.path);
        return index.search(query, filters, debug);
    };
    EngageFirestoreBase.prototype.setDocClass = function (docWrapper) {
        EngageFirestoreBase.DOC = docWrapper;
    };
    EngageFirestoreBase.getInstance = function (path, options) {
        if (!EngageFirestoreBase.instances[path]) {
            EngageFirestoreBase.instances[path] = new EngageFirestoreBase(path);
        }
        if (options) {
            return EngageFirestoreBase.instances[path].options(options);
        }
        return EngageFirestoreBase.instances[path];
    };
    /* List */
    EngageFirestoreBase.prototype.sortList = function (sortFunc, _list) {
        (_list || this.list).sort(sortFunc);
    };
    EngageFirestoreBase.prototype.sortListByPosition = function (fresh, reverse, list) {
        if (fresh === void 0) { fresh = false; }
        if (reverse === void 0) { reverse = false; }
        this.sortedBy = 'position';
        if (fresh) {
            this.getListByPosition(reverse ? 'asc' : 'desc');
        }
        else {
            this.sortList(function (x, y) {
                if (reverse) {
                    return y.position - x.position;
                }
                return x.position - y.position;
            }, list);
        }
        return this;
    };
    EngageFirestoreBase.prototype.getListByPosition = function (direction) {
        if (direction === void 0) { direction = 'asc'; }
        return __awaiter(this, void 0, void 0, function () {
            var ref;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        ref = this.ref.orderBy('position', direction);
                        return [4 /*yield*/, this.getList(ref)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestoreBase.prototype.buildListPositions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getList()];
                    case 2:
                        _a.sent();
                        console.log('Started Building positions...');
                        this.sortListByPosition();
                        promises = this.list.map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                item.position = index + 1;
                                return [2 /*return*/, item.$save()];
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 3:
                        _a.sent();
                        console.log('Finished Building positions...');
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(EngageFirestoreBase, "__DOC__", {
        /*
         * STATIC SETUP
         * */
        set: function (doc) {
            EngageFirestoreBase.DOC = doc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngageFirestoreBase, "__ENGAGE_FIRE__", {
        set: function (engageFire) {
            EngageFirestoreBase.ENGAGE_FIRE = engageFire;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngageFirestoreBase, "__FIRE_OPTIONS__", {
        set: function (options) {
            EngageFirestoreBase.FIRE_OPTIONS = options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngageFirestoreBase, "__STATE__", {
        set: function (state) {
            EngageFirestoreBase.STATE = state;
        },
        enumerable: true,
        configurable: true
    });
    EngageFirestoreBase.instances = {};
    return EngageFirestoreBase;
}());
exports.default = EngageFirestoreBase;
//# sourceMappingURL=firestore.base.js.map