import { IEngageModel } from '../model/model';
export declare class EngageFirestoreBase {
    path: string;
    static STATE: any;
    private static instances;
    model: any;
    db: any;
    ref: any;
    $user: any;
    $loading: boolean;
    userId: string;
    id: any;
    state: {};
    ps: import("./pubsub").EngagePubsub;
    firebaseReady: boolean;
    checkTime: number;
    checkLimit: number;
    debug: boolean;
    subCollections: string[];
    list: any[];
    sortedBy: string;
    constructor(path: string);
    init(): Promise<void>;
    linkFireCollection(value: any): any;
    addSubCollections(collections: string[]): this;
    toggleDebug(): void;
    canSub(): boolean;
    publish(data: any, what: string | undefined): void;
    subscribe(what: string | undefined, listener: any): void;
    ready(): Promise<unknown>;
    appInitialized(): boolean;
    getUserFromAuth(): any;
    getCollection(): any;
    getDoc(id: string | undefined): any;
    getSubCollection(id: string | undefined, collectionName: string): any;
    getId(): any;
    setId(id: any): void;
    getAll(): any;
    options(options?: {
        loadList: boolean;
        collectionGroup: boolean;
        loadModal: boolean;
    }): this;
    getChildDocs(doc: any): Promise<any>;
    getStringVar(what: any, replaceWith?: any): any;
    getList({ listRef, filter, limit }: {
        listRef?: any;
        filter?: any;
        limit?: any;
    }): Promise<any[]>;
    getOnce(docId?: any, pure?: boolean): Promise<any>;
    getWithChildern<T>(docId?: any, ref?: any): Promise<T | any>;
    get<T>(docId?: any, ref?: any): Promise<T | any>;
    getFirst({ listRef, filter }: {
        listRef?: any;
        filter: any;
    }): Promise<any>;
    getOrCreate<T>({ defaultData, filter }: {
        defaultData: any;
        filter: any;
    }): Promise<T>;
    add(newDoc: any, ref?: any): Promise<any>;
    set(newDoc: any, docRef: any): Promise<any>;
    setWithId(id: string | undefined, newDoc: any): Promise<any>;
    update(doc: any, ref?: any): Promise<any>;
    save(newDoc: any, ref?: any): Promise<any>;
    saveWithId(id: string | undefined, newDoc: any): Promise<any>;
    remove(id: string | undefined, ref?: any): any;
    addFireList(collection: any): any;
    addFire(obj: any, id: any): any;
    omitFireList(list: any): any;
    omitFire(payload: any): any;
    getFirebaseProjectId(): any;
    watch(id: string | undefined, cb: any, ref?: any): Promise<void>;
    watchList(cb: any, ref?: any): Promise<void>;
    watchPromise(id: string | undefined, ref?: any): Promise<unknown>;
    watchListPromise(ref?: any): Promise<unknown>;
    watchState(name: string | number): void;
    setState(name: string | number): void;
    getState(name: string | number): void;
    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     */
    deleteCollection(collectionRef?: any, batchSize?: number): Promise<unknown>;
    deleteQueryBatch(db: any, query: any, batchSize: number, resolve: any, reject: any): Promise<void>;
    replaceId(oldId: string, newId: any, ref?: any): Promise<any>;
    replaceIdOnCollection(oldId: string, newId: any, subRef?: any): Promise<any>;
    moveRecord(oldPath: any, newPath: any): Promise<any>;
    copyRecord(oldPath: any, newPath: any, updateTimestamp?: boolean): Promise<any>;
    backupDoc(doc: {
        $path: string;
        $backupAt: number;
        $save: () => void;
    }, deep?: boolean, backupPath?: string): Promise<any>;
    restore(): Promise<void>;
    addModelField(field: any): Promise<any>;
    getModelField(field: string): Promise<IEngageModel[]>;
    getModel(): IEngageModel[];
    getModelFromDb(): Promise<any>;
    sortModel(): Promise<this>;
    deleteFile(doc: any, fileId: any): Promise<any>;
    deleteImage(doc: any): Promise<any>;
    search(query?: string, filters?: string, debug?: boolean): any;
    static getInstance(path: string, options?: any): EngageFirestore;
    sortList(sortFunc: any, _list?: any): void;
    sortListByPosition(fresh?: boolean, reverse?: boolean, list?: any): this;
    getListByPosition(direction?: "desc" | "asc" | undefined): Promise<any[]>;
    buildListPositions(): Promise<void>;
    static getTimezoneOffset(): number;
}
export declare class EngageFirestoreFunction extends EngageFirestoreBase {
    path: string;
    constructor(path: string);
    static __DOC__: any;
    static __STATE__: any;
}
export default class EngageFirestore extends EngageFirestoreBase {
    path: string;
    constructor(path: string);
    static __DOC__: any;
    static __STATE__: any;
}
export declare let engageFirestore: (path: any, options?: any) => EngageFirestore;
