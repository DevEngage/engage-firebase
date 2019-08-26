import * as firebase from 'firebase/app';
import { firestore } from 'firebase';
import EngageFireDoc from '../doc/doc';
import { IEngageModel } from "../model/model";
export interface EngageICollection {
    name?: string;
    path?: string;
    subCollections?: EngageICollection[];
}
export default class EngageFirestore {
    path: firestore.CollectionReference | string;
    db?: firestore.Firestore | undefined;
    docWrapper: any;
    static fireOptions: any;
    ref: firestore.CollectionReference;
    auth: firebase.User | null;
    $loading: boolean;
    userId: string;
    id: any;
    state: any;
    ps: import("../pubsub/pubsub").EngagePubsub;
    firebaseReady: boolean;
    checkTime: number;
    checkLimit: number;
    debug: boolean;
    subCollections: string[];
    list: any[];
    private static instances;
    model: any;
    omitList: string[];
    sortedBy: string;
    constructor(path: firestore.CollectionReference | string, db?: firestore.Firestore | undefined, // admin, firebase
    docWrapper?: any);
    init(): Promise<void>;
    addSubCollections(collections: string[]): this;
    toggleDebug(): void;
    canSub(): boolean;
    publish(data: any, what: string | undefined): void;
    subscribe(what: string | undefined, listener: any): void;
    ready(): Promise<unknown>;
    watchUser(cb: {
        (user: any): void;
        (arg0: firebase.User | null): void;
    }): Promise<void>;
    appInitialized(): number;
    getUserId(): Promise<string>;
    getUserFromAuth(): firebase.User;
    getCollection(): firestore.CollectionReference;
    getDoc(id: string | undefined): firestore.DocumentReference;
    getSubCollection(id: string | undefined, collectionName: string): firestore.CollectionReference;
    getId(): any;
    setId(id: any): void;
    getAll(): Promise<firestore.QuerySnapshot>;
    options(options?: {
        loadList: boolean;
    }): this;
    getChildDocs(doc: any): Promise<any>;
    getList(ref?: any): Promise<any[]>;
    getOnce(docId?: any, pure?: boolean): Promise<any>;
    getWithChildern<T>(docId?: any, ref?: firestore.CollectionReference | undefined): Promise<EngageFireDoc | T | any>;
    get<T>(docId?: any, ref?: firestore.CollectionReference | undefined): Promise<EngageFireDoc | T | any>;
    add(newDoc: any, ref?: firestore.CollectionReference): Promise<any>;
    set(newDoc: any, docRef: firestore.DocumentReference): Promise<any>;
    setWithId(id: string | undefined, newDoc: any): Promise<any>;
    update(doc: any, ref?: firestore.CollectionReference | undefined): Promise<any>;
    save(newDoc: any, ref?: firestore.DocumentReference | firestore.CollectionReference | undefined): Promise<any>;
    saveWithId(id: string | undefined, newDoc: any): Promise<any>;
    remove(id: string | undefined, ref?: firestore.CollectionReference | undefined): Promise<void>;
    addFireList(collection: any): any;
    addFire(obj: any, id: any): any;
    omitFireList(list: any): any;
    omitFire(payload: any): Pick<any, number | symbol>;
    getFirebaseProjectId(): any;
    watch(id: string | undefined, cb: {
        (arg0: any, arg1: any): void;
        (arg0: null, arg1: any): void;
    }, ref?: firestore.CollectionReference | undefined): Promise<void>;
    watchList(cb: any, ref?: firestore.CollectionReference): Promise<void>;
    watchPromise(id: string | undefined, ref?: firestore.CollectionReference | undefined): Promise<unknown>;
    watchListPromise(ref?: firestore.CollectionReference): Promise<unknown>;
    watchState(name: string | number): void;
    setState(name: string | number): void;
    getState(name: string | number): void;
    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     */
    deleteCollection(collectionRef?: firestore.CollectionReference, batchSize?: number): Promise<unknown>;
    deleteQueryBatch(db: any, query: firestore.Query, batchSize: number, resolve: {
        (value?: unknown): void;
        (): void;
    }, reject: {
        (reason?: any): void;
        (arg0: any): void;
    }): Promise<void>;
    replaceId(oldId: string, newId: any, ref?: firestore.CollectionReference): Promise<void | "cant find record">;
    replaceIdOnCollection(oldId: string, newId: any, subRef?: firestore.CollectionReference): Promise<void | "cant find record">;
    moveRecord(oldPath: any, newPath: any): Promise<any>;
    copyRecord(oldPath: any, newPath: any, updateTimestamp?: boolean): Promise<void>;
    backupDoc(doc: {
        $path: string;
        $backupAt: number;
        $save: () => void;
    }, deep?: boolean, backupPath?: string): Promise<any>;
    restore(): Promise<void>;
    createFileInput(multi?: boolean, accept?: string): any;
    handleUpload(uploadTask: firebase.storage.UploadTask, doc: any, fileName?: any): any;
    _handleFileUpload(element: any): Promise<unknown>;
    uploadFiles(doc: any, files?: any, id?: string): Promise<any[]>;
    uploadImage(doc: any, id?: string, file?: any): Promise<unknown>;
    addModelField(field: any): Promise<any>;
    getModelField(field: string): IEngageModel[];
    getModel(): IEngageModel[];
    getModelFromDb(): Promise<any>;
    sortModel(): Promise<this>;
    deleteFile(doc: any, fileId: any): Promise<any>;
    deleteImage(doc: any): Promise<any>;
    downloadFile(fileUrl: string): Promise<unknown>;
    login(email: string, password: string): Promise<firebase.auth.UserCredential>;
    loginSocial(service: any, method: string, scope?: any, mobile?: boolean): Promise<void | firebase.auth.UserCredential>;
    signup(email: string, password: string): Promise<firebase.auth.UserCredential>;
    logout(): Promise<void>;
    sendEmailVerification(): Promise<any>;
    forgotPassword(email: string): Promise<void>;
    updatePassword(newPassword: any): Promise<any>;
    search(query?: string, filters?: string, debug?: boolean): any;
    setDocClass(docWrapper: any): void;
    static getInstance(path: string, options?: any): any;
    sortList(sortFunc: any, _list?: any): void;
    sortListByPosition(fresh?: boolean, reverse?: boolean, list?: any): this;
    getListByPosition(direction?: "desc" | "asc" | undefined): Promise<any[]>;
    buildListPositions(): Promise<void>;
}
export declare let engageFirestore: (path: string, options?: any) => any;
