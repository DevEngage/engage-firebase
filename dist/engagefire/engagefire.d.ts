import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
export declare class Engagefire {
    protected config?: any;
    enablePersistence?: boolean;
    static FIRE_OPTIONS: any;
    private static instance;
    user: any;
    firebase: firebase.app.App;
    firestore: firebase.firestore.Firestore;
    storage: firebase.storage.Storage;
    auth: firebase.auth.Auth;
    initialized: boolean;
    isAsync: boolean;
    private constructor();
    init(): Promise<void>;
    getFirebaseProjectId(): any;
    initFirestore(): Promise<unknown>;
    access(): {
        user: any;
        firebase: firebase.app.App;
        firestore: firebase.firestore.Firestore;
        storage: firebase.storage.Storage;
        auth: firebase.auth.Auth;
        initialized: boolean;
    };
    ready(): Promise<{
        user: any;
        firebase: firebase.app.App;
        firestore: firebase.firestore.Firestore;
        storage: firebase.storage.Storage;
        auth: firebase.auth.Auth;
        initialized: boolean;
    }>;
    static getInstance(config: any, enablePersistence: boolean): Engagefire;
}
export declare let engageFireInit: (fireOptions?: any) => Engagefire;
