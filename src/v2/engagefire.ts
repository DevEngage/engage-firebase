import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

export default class EngageFire {
    static FIRE_OPTIONS: any;
    static debug: any = false;
    private static instance: EngageFire;
    static firebase: firebase.app.App;
    static firestore: firebase.firestore.Firestore;
    static storage: firebase.storage.Storage;
    static auth: firebase.auth.Auth;
    static user: any;
    static initialized: boolean = false;
    static isAsync = true;
    static waiting;
    static error;

    private constructor(
        protected config?: any,
        public enablePersistence?: boolean
    ) {
        if (this.config === undefined) {
            this.config = EngageFire.FIRE_OPTIONS;
        } else if (EngageFire.FIRE_OPTIONS === undefined) {
            EngageFire.FIRE_OPTIONS = this.config;
        }
        if (this.enablePersistence === undefined) {
            this.enablePersistence = true;
        }
        if (firebase.apps[0]) {
            EngageFire.firebase = firebase.apps[0];
        } else if (config) {
            EngageFire.firebase = firebase.initializeApp(config);
        }
        if (!EngageFire.initialized) {
            EngageFire.waiting = this.init();
        }
    }

    async init() {
        await this.initFirestore();
        EngageFire.initialized = true;
        console.log('INITIALIZING ENGAGE FIREBASE');
        EngageFire.auth = firebase.auth();
        EngageFire.storage = firebase.storage();
        firebase.auth().onAuthStateChanged((user) => {
            EngageFire.user = user;
        });
    }

    async initFirestore() {
        if (EngageFire.firestore) {
            return EngageFire.firestore;
        }
        EngageFire.firestore = firebase.firestore();
        if (EngageFire.firestore.app) {
            return EngageFire.firestore;
        }
        // this.firestore.settings({ timestampsInSnapshots: true });
        if (this.enablePersistence) {
            try {
                await firebase.firestore().enablePersistence()
                return EngageFire.firestore;    
            } catch(error) {
                EngageFire.error = error;
                console.error('ENGAGE FS ERROR', error);
                return EngageFire.firestore;
            }
        }
    }

    static getFirebaseProjectId() {
        if (!firebase.app().options) return null;
        return (<any>firebase.app().options)['authDomain'].split('.')[0];
    }

    static access() {
        return {
            user: EngageFire.user,
            firebase: EngageFire.firebase,
            firestore: EngageFire.firestore,
            storage: EngageFire.storage,
            auth: EngageFire.auth,
            initialized: EngageFire.initialized
        };
    }

    static async ready(config?: any, enablePersistence?: boolean) {
        if (EngageFire.initialized) {
            return this.access();
        }
        EngageFire.getInstance(config, enablePersistence);
        await EngageFire.waiting;
        return this.access();
    }

    // Create a Singleton to help prevent initializing firebase more than once.
    static getInstance(config?: any, enablePersistence?: boolean) {
        if (!EngageFire.instance) {
            EngageFire.instance = new EngageFire(config, enablePersistence);
        }
        return EngageFire.instance;
    }
}