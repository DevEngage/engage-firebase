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
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/storage");
require("firebase/firestore");
var Engagefire = /** @class */ (function () {
    function Engagefire(config, enablePersistence) {
        this.config = config;
        this.enablePersistence = enablePersistence;
        this.initialized = false;
        if (this.enablePersistence === undefined) {
            this.enablePersistence = true;
        }
        if (firebase.apps[0]) {
            this.firebase = firebase.apps[0];
        }
        else {
            this.firebase = firebase.initializeApp(config);
        }
    }
    Engagefire.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initFirestore()];
                    case 1:
                        _a.sent();
                        this.initialized = true;
                        console.log('INITIALIZING ENGAGE FIREBASE');
                        this.auth = firebase.auth();
                        this.storage = firebase.storage();
                        firebase.auth().onAuthStateChanged(function (user) {
                            _this.user = user;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Engagefire.prototype.initFirestore = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.firestore = firebase.firestore();
            if (_this.firestore.app) {
                return resolve();
            }
            // this.firestore.settings({ timestampsInSnapshots: true });
            if (_this.enablePersistence) {
                firebase.firestore().enablePersistence()
                    .then(function () {
                    // Initialize Cloud Firestore through firebase
                    _this.initialized = true;
                    resolve();
                })
                    .catch(function (err) {
                    console.error('ENGAGE FS ERROR', err);
                    // this.firestore.settings({ timestampsInSnapshots: true });
                    resolve();
                    reject(err);
                    if (err.code == 'failed-precondition') {
                        // Multiple tabs open, persistence can only be enabled
                        // in one tab at a a time.
                        // ...
                    }
                    else if (err.code == 'unimplemented') {
                        // The current browser does not support all of the
                        // features required to enable persistence
                        // ...
                    }
                });
            }
            else {
                resolve();
            }
        });
    };
    Engagefire.prototype.access = function () {
        return {
            user: this.user,
            firebase: this.firebase,
            firestore: this.firestore,
            storage: this.storage,
            auth: this.auth,
            initialized: this.initialized
        };
    };
    Engagefire.prototype.ready = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.initialized) {
                            return [2 /*return*/, this.access()];
                        }
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.access()];
                }
            });
        });
    };
    // Create a Singleton to help prevent initializing firebase more than once.
    Engagefire.getInstance = function (config, enablePersistence) {
        if (!Engagefire.instance) {
            Engagefire.instance = new Engagefire(config, enablePersistence);
        }
        return Engagefire.instance;
    };
    return Engagefire;
}());
exports.engageFire = Engagefire.getInstance(undefined, true);
//# sourceMappingURL=engagefire.js.map