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
var firebase = require("firebase/app");
var _ = require("lodash");
var engagefire_1 = require("../engagefire/engagefire");
var pubsub_1 = require("../pubsub/pubsub");
var doc_1 = require("../doc/doc");
var algolia_1 = require("../algolia/algolia");
var image_1 = require("../image/image");
/*
 * TODO:
 * [ ] Implement State Manage,
 * [ ] Create query system that can save query models
 * [X] Show upload progress
 * [X] Handle file uploads better
 * [ ] Fully test everything!
 * [X] Add types (models) to doc in class
 * [ ] Add Model system
 * [ ] Integrate User name ($getUserName)
 * [ ] Change doc methods to doc prototype methods. Maybe make a class?
 * */
var EngageFirestore = /** @class */ (function () {
    function EngageFirestore(path, db, // admin, firebase
    docWrapper) {
        if (docWrapper === void 0) { docWrapper = doc_1.default; }
        this.path = path;
        this.db = db;
        this.docWrapper = docWrapper;
        this.$loading = true;
        this.userId = '';
        this.state = window.ENGAGE_STATE;
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
    EngageFirestore.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).ready()];
                    case 1:
                        _a.sent();
                        if (!this.db) {
                            this.db = engagefire_1.engageFireInit(EngageFirestore.fireOptions).firestore;
                        }
                        if (!window.ENGAGE_STATE) {
                            window.ENGAGE_STATE = {};
                            this.state = window.ENGAGE_STATE;
                        }
                        if (_.isString(this.path)) {
                            this.ref = this.db.collection(this.path);
                        }
                        else {
                            this.ref = this.path;
                        }
                        if (this.appInitialized() && firebase && firebase.auth() && firebase.auth().currentUser) {
                            this.auth = firebase.auth().currentUser;
                            this.publish(this.auth, 'user');
                            if (this.auth) {
                                this.userId = this.auth.uid;
                                if (this.debug)
                                    console.log('userId', this.userId);
                            }
                        }
                        this.watchUser(function (user) {
                            _this.publish(user, 'user');
                        });
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
    EngageFirestore.prototype.addSubCollections = function (collections) {
        this.subCollections = this.subCollections.concat(collections);
        return this;
    };
    EngageFirestore.prototype.toggleDebug = function () {
        this.debug = !this.debug;
    };
    EngageFirestore.prototype.canSub = function () {
        return !!this.ps;
    };
    EngageFirestore.prototype.publish = function (data, what) {
        return this.ps.publish(data, what);
    };
    EngageFirestore.prototype.subscribe = function (what, listener) {
        return this.ps.subscribe(what, listener);
    };
    EngageFirestore.prototype.ready = function () {
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
    EngageFirestore.prototype.watchUser = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.onAuthStateChanged(function (user) {
                            if (cb)
                                cb(user || null);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestore.prototype.appInitialized = function () {
        return firebase.apps.length;
    };
    EngageFirestore.prototype.getUserId = function () {
        if (this.userId) {
            return Promise.resolve(this.userId);
        }
        else if (this.appInitialized()) {
            return new Promise(function (resolve) {
                return firebase.auth().onAuthStateChanged(function (user) {
                    if (user && user.uid) {
                        resolve(user.uid);
                    }
                    else {
                        resolve('');
                    }
                });
            });
        }
        else {
            return Promise.resolve('');
        }
    };
    EngageFirestore.prototype.getUserFromAuth = function () {
        return this.auth;
    };
    EngageFirestore.prototype.getCollection = function () {
        return this.ref;
    };
    EngageFirestore.prototype.getDoc = function (id) {
        return this.ref.doc(id);
    };
    EngageFirestore.prototype.getSubCollection = function (id, collectionName) {
        return this.ref.doc(id).collection(collectionName);
    };
    EngageFirestore.prototype.getId = function () {
        return this.id;
    };
    EngageFirestore.prototype.setId = function (id) {
        this.id = id;
    };
    EngageFirestore.prototype.getAll = function () {
        return this.ref.get();
    };
    EngageFirestore.prototype.options = function (options) {
        if (options === void 0) { options = { loadList: true }; }
        if (options.loadList) {
            this.getList();
        }
        return this;
    };
    EngageFirestore.prototype.getChildDocs = function (doc) {
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
                        return [4 /*yield*/, exports.engageFirestore(element.$collection).get(element.$id)];
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
    EngageFirestore.prototype.getList = function (ref) {
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
    EngageFirestore.prototype.getOnce = function (docId, pure) {
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
    EngageFirestore.prototype.getWithChildern = function (docId, ref) {
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
    EngageFirestore.prototype.get = function (docId, ref) {
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
    EngageFirestore.prototype.add = function (newDoc, ref) {
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
    EngageFirestore.prototype.set = function (newDoc, docRef) {
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
    EngageFirestore.prototype.setWithId = function (id, newDoc) {
        return this.set(newDoc, this.ref.doc(id));
    };
    EngageFirestore.prototype.update = function (doc, ref) {
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
    EngageFirestore.prototype.save = function (newDoc, ref) {
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
    EngageFirestore.prototype.saveWithId = function (id, newDoc) {
        return this.save(newDoc, this.ref.doc(id));
    };
    EngageFirestore.prototype.remove = function (id, ref) {
        if (!ref)
            ref = this.ref;
        if (this.debug)
            console.log('removing: ', id);
        return ref.doc(id).delete();
    };
    EngageFirestore.prototype.addFireList = function (collection) {
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
    EngageFirestore.prototype.addFire = function (obj, id) {
        if (_.isObject(this.docWrapper)) {
            obj.$id = id;
            return new this.docWrapper(obj, this.path, this.subCollections);
        }
        return obj;
    };
    EngageFirestore.prototype.omitFireList = function (list) {
        var _this = this;
        _.each(list, function (val, i) {
            list[i] = _this.omitFire(val);
        });
        return list;
    };
    EngageFirestore.prototype.omitFire = function (payload) {
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
    EngageFirestore.prototype.getFirebaseProjectId = function () {
        if (!firebase.app().options)
            return null;
        return firebase.app().options['authDomain'].split('.')[0];
    };
    /*
     * Firestore Base
     */
    EngageFirestore.prototype.watch = function (id, cb, ref) {
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
    EngageFirestore.prototype.watchList = function (cb, ref) {
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
    EngageFirestore.prototype.watchPromise = function (id, ref) {
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
    EngageFirestore.prototype.watchListPromise = function (ref) {
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
    EngageFirestore.prototype.watchState = function (name) {
        this.state[name];
    };
    EngageFirestore.prototype.setState = function (name) {
        this.state[name];
    };
    EngageFirestore.prototype.getState = function (name) {
        this.state[name];
    };
    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     */
    EngageFirestore.prototype.deleteCollection = function (collectionRef, batchSize) {
        var _this = this;
        if (collectionRef === void 0) { collectionRef = this.ref; }
        if (batchSize === void 0) { batchSize = 50; }
        var query = collectionRef.limit(batchSize);
        return new Promise(function (resolve, reject) {
            _this.deleteQueryBatch(_this.db, query, batchSize, resolve, reject);
        });
    };
    EngageFirestore.prototype.deleteQueryBatch = function (db, query, batchSize, resolve, reject) {
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
    EngageFirestore.prototype.replaceId = function (oldId, newId, ref) {
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
    EngageFirestore.prototype.replaceIdOnCollection = function (oldId, newId, subRef) {
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
    EngageFirestore.prototype.moveRecord = function (oldPath, newPath) {
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
    EngageFirestore.prototype.copyRecord = function (oldPath, newPath, updateTimestamp) {
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
    EngageFirestore.prototype.backupDoc = function (doc, deep, backupPath) {
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
                        ef = new EngageFirestore(backupPath + '/' + timestamp + '/' + doc.$path);
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
    EngageFirestore.prototype.restore = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /*
     * FILES
     * */
    EngageFirestore.prototype.createFileInput = function (multi, accept) {
        if (multi === void 0) { multi = false; }
        var id = 'eng-files';
        var input = document.getElementById(id);
        if (!input) {
            input = document.createElement("input");
        }
        input.setAttribute("style", "display: none;");
        input.setAttribute("type", "file");
        if (accept) {
            input.setAttribute("accept", "file");
        }
        if (multi) {
            input.setAttribute("multiple", "true");
        }
        input.setAttribute("name", "engage-files");
        input.setAttribute("id", "eng-files");
        //append to form element that you want .
        document.body.appendChild(input);
        return input;
    };
    EngageFirestore.prototype.handleUpload = function (uploadTask, doc, fileName) {
        var _this = this;
        var uploadProgress = 0;
        var uploadState;
        var listeners = [];
        var notify = function () {
            listeners.forEach(function (item) {
                item({
                    uploadProgress: uploadProgress,
                    uploadState: uploadState,
                    fileName: fileName
                });
            });
        };
        if (doc && fileName) {
            doc.$getProgress = function (cb) {
                listeners.push(cb);
            };
        }
        uploadTask.on('state_changed', function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            uploadProgress = progress;
            uploadState = snapshot.state;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
            if (fileName)
                notify();
        }, function (error) {
            console.error(error);
            // Handle unsuccessful uploads
        }, function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, state, metadata, name, size, downloadURL;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = uploadTask.snapshot, state = _a.state, metadata = _a.metadata;
                        name = metadata.name, size = metadata.size;
                        if (!doc) return [3 /*break*/, 6];
                        return [4 /*yield*/, uploadTask.snapshot.ref.getDownloadURL()];
                    case 1:
                        downloadURL = _b.sent();
                        if (doc.$image === undefined) {
                            delete doc.$image;
                        }
                        if (!downloadURL) return [3 /*break*/, 4];
                        if (!!fileName) return [3 /*break*/, 3];
                        doc.$thumb = downloadURL;
                        return [4 /*yield*/, doc.$save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                    case 3:
                        doc.$image = downloadURL;
                        _b.label = 4;
                    case 4:
                        // doc.$thumbnail = snapshot.downloadURL;
                        doc.$imageMeta = {
                            name: name,
                            storagePath: doc.$path + '$image' + name,
                            original: downloadURL,
                            state: state,
                            size: size,
                        };
                        if (doc.$imageMeta && doc.$imageMeta.original === undefined) {
                            delete doc.$imageMeta.original;
                        }
                        return [4 /*yield*/, doc.$save()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        return doc;
    };
    EngageFirestore.prototype._handleFileUpload = function (element) {
        var _this = this;
        element.click();
        return new Promise(function (resolve) {
            element.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (element && element.files && element.files.length) {
                        resolve(element.files || []);
                    }
                    else {
                        resolve([]);
                    }
                    return [2 /*return*/];
                });
            }); });
        });
    };
    EngageFirestore.prototype.uploadFiles = function (doc, files, id) {
        if (files === void 0) { files = []; }
        if (id === void 0) { id = 'eng-files'; }
        return __awaiter(this, void 0, void 0, function () {
            var storageRef, element, uploaded, docFileCollection, i, file, preFile, error_4, snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.debug)
                            console.log('File Upload:', files);
                        storageRef = engagefire_1.engageFireInit(EngageFirestore.fireOptions).storage.ref().child(doc.$path);
                        element = id ? document.getElementById(id) : this.createFileInput();
                        uploaded = [];
                        if (!doc)
                            return [2 /*return*/];
                        docFileCollection = doc.$getSubCollection('files');
                        return [4 /*yield*/, docFileCollection.ready()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._handleFileUpload(element)];
                    case 2:
                        files = _a.sent();
                        if (!(files && files.length)) return [3 /*break*/, 12];
                        files = files || element.files;
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < files.length)) return [3 /*break*/, 11];
                        file = files[i];
                        if (!('name' in file)) return [3 /*break*/, 10];
                        preFile = void 0;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, docFileCollection.save({
                                name: file.name
                            })];
                    case 5:
                        preFile = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        console.error('Engage file upload:', error_4);
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, storageRef
                            .child('files')
                            .child(preFile.$id)
                            .child(file.name)
                            .put(file)];
                    case 8:
                        snapshot = _a.sent();
                        if (!(doc && snapshot)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.handleUpload(snapshot, doc, file.name)];
                    case 9:
                        doc = _a.sent();
                        preFile = __assign({}, preFile, { url: snapshot.downloadURL, meta: {
                                storagePath: doc.$path + '/files/' + preFile.$id + '/' + file.name,
                                state: snapshot.state
                            } });
                        uploaded.push(snapshot);
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 3];
                    case 11: return [2 /*return*/, uploaded];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    EngageFirestore.prototype.uploadImage = function (doc, id, file) {
        return __awaiter(this, void 0, void 0, function () {
            var storageRef, element;
            var _this = this;
            return __generator(this, function (_a) {
                storageRef = engagefire_1.engageFireInit(EngageFirestore.fireOptions).storage.ref().child(doc.$path);
                element = id ? document.getElementById(id) : this.createFileInput();
                element.click();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        element.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
                            var _file, _a, blob, thumbBlob, snapshot, snapshotThumb;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!((element && element.files && element.files.length) || file)) return [3 /*break*/, 5];
                                        _file = file || element.files[0];
                                        return [4 /*yield*/, new image_1.EngageImage().rezieImageWithThumb(_file, doc)];
                                    case 1:
                                        _a = _b.sent(), blob = _a[0], thumbBlob = _a[1];
                                        if (!('name' in _file)) return [3 /*break*/, 4];
                                        snapshot = storageRef
                                            .child('$image')
                                            .child(_file.name)
                                            .put(blob);
                                        snapshotThumb = storageRef
                                            .child('$thumb')
                                            .child(_file.name)
                                            .put(thumbBlob);
                                        return [4 /*yield*/, this.handleUpload(snapshot, doc, _file.name)];
                                    case 2:
                                        doc = _b.sent();
                                        return [4 /*yield*/, this.handleUpload(snapshotThumb, doc)];
                                    case 3:
                                        doc = _b.sent();
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        reject('Missing File(s)');
                                        _b.label = 6;
                                    case 6:
                                        resolve(doc);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    /*
      Model
    */
    EngageFirestore.prototype.addModelField = function (field) {
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
                        return [4 /*yield*/, exports.engageFirestore("$collections/" + this.path + "/$models").save(model)];
                    case 1:
                        _a.model = _c.apply(_b, [[
                                _d.sent()
                            ]]);
                        return [2 /*return*/, this.model];
                }
            });
        });
    };
    EngageFirestore.prototype.getModelField = function (field) {
        return exports.engageFirestore("$collections/" + this.path + "/$models").get(field);
    };
    EngageFirestore.prototype.getModel = function () {
        return this.model;
    };
    EngageFirestore.prototype.getModelFromDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.path.includes('$collections')) {
                            return [2 /*return*/, this.model = []];
                        }
                        _a = this;
                        return [4 /*yield*/, exports.engageFirestore("$collections/" + this.path + "/$models").getList()];
                    case 1:
                        _a.model = _b.sent();
                        this.sortModel();
                        return [2 /*return*/, this.model];
                }
            });
        });
    };
    EngageFirestore.prototype.sortModel = function () {
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
    EngageFirestore.prototype.deleteFile = function (doc, fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var fileDoc, desertRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, doc.$getSubCollection('files').get(fileId)];
                    case 1:
                        fileDoc = _a.sent();
                        desertRef = engagefire_1.engageFireInit(EngageFirestore.fireOptions).storage.child(fileDoc.meta.storagePath);
                        return [4 /*yield*/, desertRef.delete().then(function () { return fileDoc.$remove(); })];
                    case 2: 
                    // Delete the file
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.deleteImage = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var desertRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        desertRef = engagefire_1.engageFireInit(EngageFirestore.fireOptions).storage.child(doc.$imageMeta.storagePath);
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
    EngageFirestore.prototype.downloadFile = function (fileUrl) {
        return new Promise(function (resolve) {
            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                var blob = xhr.response;
                resolve(blob);
            };
            xhr.open('GET', fileUrl);
            xhr.send();
        });
    };
    /* AUTH */
    EngageFirestore.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.signInWithEmailAndPassword(email, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.loginSocial = function (service, method, scope, mobile) {
        if (mobile === void 0) { mobile = false; }
        return __awaiter(this, void 0, void 0, function () {
            var provider;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('isMobile', mobile);
                        switch (service) {
                            case 'google':
                                provider = new firebase.auth.GoogleAuthProvider();
                                break;
                            case 'twitter':
                                provider = new firebase.auth.TwitterAuthProvider();
                                break;
                            case 'facebook':
                                provider = new firebase.auth.FacebookAuthProvider();
                                break;
                            case 'github':
                                provider = new firebase.auth.GithubAuthProvider();
                                break;
                            default:
                                provider = new firebase.auth.GoogleAuthProvider();
                        }
                        if (provider)
                            provider.addScope(scope);
                        if (!(method === 'popup')) return [3 /*break*/, 2];
                        return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.signInWithPopup(provider)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.signInWithRedirect(provider)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.signup = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.createUserWithEmailAndPassword(email, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.signOut()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.sendEmailVerification = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.sendEmailVerification()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.sendPasswordResetEmail(email)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageFirestore.prototype.updatePassword = function (newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.engageFireInit(EngageFirestore.fireOptions).auth.updatePassword(newPassword)];
                    case 1: return [2 /*return*/, _a.sent()];
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
    EngageFirestore.prototype.search = function (query, filters, debug) {
        if (debug === void 0) { debug = false; }
        var index = algolia_1.EngageAlgolia.getIndex(this.path);
        return index.search(query, filters, debug);
    };
    EngageFirestore.prototype.setDocClass = function (docWrapper) {
        this.docWrapper = docWrapper;
    };
    EngageFirestore.getInstance = function (path, options) {
        if (!EngageFirestore.instances[path]) {
            EngageFirestore.instances[path] = new EngageFirestore(path);
        }
        if (options) {
            return EngageFirestore.instances[path].options(options);
        }
        return EngageFirestore.instances[path];
    };
    /* List */
    EngageFirestore.prototype.sortList = function (sortFunc, _list) {
        (_list || this.list).sort(sortFunc);
    };
    EngageFirestore.prototype.sortListByPosition = function (fresh, reverse, list) {
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
    EngageFirestore.prototype.getListByPosition = function (direction) {
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
    EngageFirestore.prototype.buildListPositions = function () {
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
    EngageFirestore.instances = {};
    return EngageFirestore;
}());
exports.default = EngageFirestore;
// export EngageFirestore
exports.engageFirestore = function (path, options) { return EngageFirestore.getInstance(path, options); };
//# sourceMappingURL=firestore.js.map