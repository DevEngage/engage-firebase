import { IEngageModel } from "../model/model";
export default class EngageFirestoreBase {
    path: string;
    static DOC: any;
    static STATE: any;
    static ENGAGE_FIRE: any;
    static FIRE_OPTIONS: any;
    ref: any;
    $user: any;
    $loading: boolean;
    userId: string;
    id: any;
    state: {};
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
    db: any;
    constructor(path: string);
    init(): Promise<void>;
    addSubCollections(collections: string[]): this;
    toggleDebug(): void;
    canSub(): boolean;
    publish(data: any, what: string | undefined): void;
    subscribe(what: string | undefined, listener: any): void;
    ready(): Promise<unknown>;
    appInitialized(): any;
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
    getList(ref?: any): Promise<any[]>;
    getOnce(docId?: any, pure?: boolean): Promise<any>;
    getWithChildern<T>(docId?: any, ref?: any): Promise<T | any>;
    get<T>(docId?: any, ref?: any): Promise<T | any>;
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
    omitFire(payload: any): Pick<any, number | symbol>;
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
    getModelField(field: string): IEngageModel[];
    getModel(): IEngageModel[];
    getModelFromDb(): Promise<any>;
    sortModel(): Promise<this>;
    deleteFile(doc: any, fileId: any): Promise<any>;
    deleteImage(doc: any): Promise<any>;
    search(query?: string, filters?: string, debug?: boolean): any;
    setDocClass(docWrapper: any): void;
    static getInstance(path: string, options?: any): any;
    sortList(sortFunc: any, _list?: any): void;
    sortListByPosition(fresh?: boolean, reverse?: boolean, list?: any): this;
    getListByPosition(direction?: "desc" | "asc" | undefined): Promise<any[]>;
    buildListPositions(): Promise<void>;
    static getTimezoneOffset(): number;
    static __DOC__: any;
    static __ENGAGE_FIRE__: any;
    static __FIRE_OPTIONS__: any;
    static __STATE__: any;
}
