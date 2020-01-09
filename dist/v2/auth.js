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
var engagefire_1 = require("./engagefire");
var firebase = require("firebase/app");
var firestore_1 = require("./firestore");
var EngageAuth = /** @class */ (function () {
    function EngageAuth() {
        this._auth = engagefire_1.default.auth;
    }
    EngageAuth.init = function () {
        if (engagefire_1.default.auth && engagefire_1.default.auth.currentUser) {
            EngageAuth.user = engagefire_1.default.auth.currentUser;
        }
        else {
            EngageAuth.user = engagefire_1.default.user;
        }
    };
    EngageAuth.getInstance = function (config, enablePersistence) {
        if (!EngageAuth.instance) {
            EngageAuth.instance = new EngageAuth();
            EngageAuth.init();
        }
        return EngageAuth.instance;
    };
    EngageAuth.currentUser = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, EngageAuth.user || engagefire_1.default.auth.currentUser];
        }); });
    };
    EngageAuth.currentUserId = function () {
        return __awaiter(this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!EngageAuth.user) return [3 /*break*/, 1];
                    _a = EngageAuth.user.uid;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, EngageAuth.currentUser()];
                case 2:
                    _a = (_b.sent()).uid;
                    _b.label = 3;
                case 3: return [2 /*return*/, _a];
            }
        }); });
    };
    /*
      AUTH (FrontEnd)
    */
    EngageAuth.prototype.watchUser = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.ready()];
                    case 1:
                        _a.sent();
                        engagefire_1.default.auth.onAuthStateChanged(function (user) {
                            if (cb)
                                cb(user || null);
                            EngageAuth.user = user;
                            if (user && user.uid) {
                                EngageAuth.userId = user.uid;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EngageAuth.prototype.getUserId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.ready()];
                    case 1:
                        _a.sent();
                        if (EngageAuth.userId) {
                            return [2 /*return*/, EngageAuth.userId];
                        }
                        if (engagefire_1.default.user && engagefire_1.default.user.uid) {
                            return [2 /*return*/, engagefire_1.default.user.uid];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    EngageAuth.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.auth.signInWithEmailAndPassword(email, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.loginSocial = function (service, method, scope, mobile) {
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
                        return [4 /*yield*/, engagefire_1.default.auth.signInWithPopup(provider)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, engagefire_1.default.auth.signInWithRedirect(provider)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.signup = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.auth.createUserWithEmailAndPassword(email, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.auth.signOut()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.sendEmailVerification = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.auth.sendEmailVerification()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.auth.sendPasswordResetEmail(email)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.updatePassword = function (newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, engagefire_1.default.auth.updatePassword(newPassword)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EngageAuth.prototype.anonLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._auth.signInAnonymously()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.updateUserData(user.user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, user.user];
                }
            });
        });
    };
    EngageAuth.prototype.updateUserData = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, firestore_1.default.getInstance('reports').save({
                        '$id': user.uid,
                        'lastActivity': Date.now()
                    })];
            });
        });
    };
    EngageAuth.prototype.updateProfile = function (_a) {
        var firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
        return __awaiter(this, void 0, void 0, function () {
            var user, reportRef;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, EngageAuth.currentUser()];
                    case 1:
                        user = _b.sent();
                        return [4 /*yield*/, firestore_1.default.getInstance('profile').get(user.uid)];
                    case 2:
                        reportRef = _b.sent();
                        reportRef.$doc = {
                            'firstName': firstName,
                            'lastName': lastName,
                            'email': email,
                            '$updatedAt': Date.now()
                        };
                        return [2 /*return*/, reportRef.$save()];
                }
            });
        });
    };
    EngageAuth.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, EngageAuth.currentUser()];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, firestore_1.default.getInstance('profile').get(user.uid)];
                }
            });
        });
    };
    return EngageAuth;
}());
exports.default = EngageAuth;
//# sourceMappingURL=auth.js.map