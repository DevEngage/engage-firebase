"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/storage");
require("firebase/firestore");
class Engagefire {
    constructor(config, enablePersistence) {
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initFirestore();
            this.initialized = true;
            console.log('INITIALIZING ENGAGE FIREBASE');
            this.auth = firebase.auth();
            this.storage = firebase.storage();
            firebase.auth().onAuthStateChanged((user) => {
                this.user = user;
            });
        });
    }
    initFirestore() {
        return new Promise((resolve, reject) => {
            this.firestore = firebase.firestore();
            if (this.firestore.app) {
                return resolve();
            }
            // this.firestore.settings({ timestampsInSnapshots: true });
            if (this.enablePersistence) {
                firebase.firestore().enablePersistence()
                    .then(() => {
                    // Initialize Cloud Firestore through firebase
                    this.initialized = true;
                    resolve();
                })
                    .catch((err) => {
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
    }
    access() {
        return {
            user: this.user,
            firebase: this.firebase,
            firestore: this.firestore,
            storage: this.storage,
            auth: this.auth,
            initialized: this.initialized
        };
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return this.access();
            }
            yield this.init();
            return this.access();
        });
    }
    // Create a Singleton to help prevent initializing firebase more than once.
    static getInstance(config, enablePersistence) {
        if (!Engagefire.instance) {
            Engagefire.instance = new Engagefire(config, enablePersistence);
        }
        return Engagefire.instance;
    }
}
exports.engageFire = Engagefire.getInstance(undefined, true);
//# sourceMappingURL=engagefire.js.map