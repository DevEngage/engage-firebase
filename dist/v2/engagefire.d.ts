import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
export default class EngageFire {
    protected config?: any;
    enablePersistence?: boolean;
    static FIRE_OPTIONS: any;
    static debug: any;
    private static instance;
    static firebase: firebase.app.App;
    static firestore: firebase.firestore.Firestore;
    static storage: firebase.storage.Storage;
    static auth: firebase.auth.Auth;
    static user: any;
    static initialized: boolean;
    static isAsync: boolean;
    static waiting: any;
    static error: any;
    private constructor();
    init(): Promise<void>;
    initFirestore(): Promise<firebase.firestore.Firestore>;
    static getFirebaseProjectId(): any;
    static access(): {
        user: any;
        firebase: firebase.app.App;
        firestore: firebase.firestore.Firestore;
        storage: firebase.storage.Storage;
        auth: firebase.auth.Auth;
        initialized: boolean;
    };
    static ready(config?: any, enablePersistence?: boolean): Promise<{
        user: any;
        firebase: firebase.app.App;
        firestore: firebase.firestore.Firestore;
        storage: firebase.storage.Storage;
        auth: firebase.auth.Auth;
        initialized: boolean;
    }>;
    static getInstance(config?: any, enablePersistence?: boolean): EngageFire;
}
