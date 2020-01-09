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
var EngageFire = /** @class */ (function () {
    function EngageFire(config, enablePersistence) {
        this.config = config;
        this.enablePersistence = enablePersistence;
        if (this.config === undefined) {
            this.config = EngageFire.FIRE_OPTIONS;
        }
        else if (EngageFire.FIRE_OPTIONS === undefined) {
            EngageFire.FIRE_OPTIONS = this.config;
        }
        if (this.enablePersistence === undefined) {
            this.enablePersistence = true;
        }
        if (firebase.apps[0]) {
            EngageFire.firebase = firebase.apps[0];
        }
        else if (config) {
            EngageFire.firebase = firebase.initializeApp(config);
        }
        if (!EngageFire.initialized) {
            EngageFire.waiting = this.init();
        }
    }
    EngageFire.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initFirestore()];
                    case 1:
                        _a.sent();
                        EngageFire.initialized = true;
                        console.log('INITIALIZING ENGAGE FIREBASE');
                        EngageFire.auth = firebase.auth();
                        EngageFire.storage = firebase.storage();
                        firebase.auth().onAuthStateChanged(function (user) {
                            EngageFire.user = user;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageFire.prototype.initFirestore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (EngageFire.firestore) {
                            return [2 /*return*/, EngageFire.firestore];
                        }
                        EngageFire.firestore = firebase.firestore();
                        if (EngageFire.firestore.app) {
                            return [2 /*return*/, EngageFire.firestore];
                        }
                        if (!this.enablePersistence) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, firebase.firestore().enablePersistence()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, EngageFire.firestore];
                    case 3:
                        error_1 = _a.sent();
                        EngageFire.error = error_1;
                        console.error('ENGAGE FS ERROR', error_1);
                        return [2 /*return*/, EngageFire.firestore];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EngageFire.getFirebaseProjectId = function () {
        if (!firebase.app().options)
            return null;
        return firebase.app().options['authDomain'].split('.')[0];
    };
    EngageFire.access = function () {
        return {
            user: EngageFire.user,
            firebase: EngageFire.firebase,
            firestore: EngageFire.firestore,
            storage: EngageFire.storage,
            auth: EngageFire.auth,
            initialized: EngageFire.initialized
        };
    };
    EngageFire.ready = function (config, enablePersistence) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (EngageFire.initialized) {
                            return [2 /*return*/, this.access()];
                        }
                        EngageFire.getInstance(config, enablePersistence);
                        return [4 /*yield*/, EngageFire.waiting];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.access()];
                }
            });
        });
    };
    // Create a Singleton to help prevent initializing firebase more than once.
    EngageFire.getInstance = function (config, enablePersistence) {
        if (!EngageFire.instance) {
            EngageFire.instance = new EngageFire(config, enablePersistence);
        }
        return EngageFire.instance;
    };
    EngageFire.debug = false;
    EngageFire.initialized = false;
    EngageFire.isAsync = true;
    return EngageFire;
}());
exports.default = EngageFire;
//# sourceMappingURL=engagefire.js.map