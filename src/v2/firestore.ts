import * as _ from 'lodash';
import { IEngageModel } from '../model/model';
import { engagePubsub } from './pubsub';
import { EngageAlgolia } from './algolia';
import EngageFire from './engagefire';
import EngageDoc from './doc';

declare let process: any;

export class EngageFirestoreBase {
    static STATE: any;
    private static instances: any = {};
    public model: any = [];
    public db!: any;
    ref!: any;
    $user!: any;
    $loading = true;
    userId: string = '';
    id: any;
    state = {};
    ps = engagePubsub;
    firebaseReady: boolean = false;
    checkTime: number = 200;
    checkLimit: number = 50;
    debug: boolean = EngageFire.debug || false;
    subCollections: string[] = [];
    list: any[] = [];
    sortedBy: string = '';

    constructor(
        public path: string
    ) {
        this.init();
    }

    async init() {
        if (EngageFire.isAsync) {
            await EngageFire.ready();
        }
        if (!this.db) {
            this.db = EngageFire.firestore;
        }
        EngageFirestoreBase.STATE = EngageFirestoreBase.STATE || {};
        if (!EngageFirestoreBase.STATE[this.path]) {
            EngageFirestoreBase.STATE[this.path] = {};
            this.state = EngageFirestoreBase.STATE[this.path];
        }
        if (_.isString(this.path)) {
            this.ref = this.db.collection(<string>this.path);
        } else {
            this.ref = <any>this.path;
        }
        if (this.appInitialized() && EngageFire.auth && EngageFire.auth.currentUser) {
            this.$user = EngageFire.auth.currentUser;
            this.publish(this.$user, 'user');
            if (this.$user) {
                this.userId = this.$user.uid;
                if (this.debug) console.log('userId', this.userId);
            }
        }
        this.firebaseReady = true;
        this.$loading = false;
    }

    addSubCollections(collections: string[]) {
        this.subCollections = [...this.subCollections, ...collections];
        return this;
    }

    toggleDebug() {
        this.debug = !this.debug;
    }

    canSub() {
        return !!this.ps;
    }

    publish(data: any, what: string | undefined) {
        return this.ps.publish(data, what);
    }

    subscribe(what: string | undefined, listener: any) {
        return this.ps.subscribe(what, listener);
    }

    ready() {
        let limit = this.checkLimit;
        let interval: number | any;
        if (this.firebaseReady) return Promise.resolve(this.userId);
        return new Promise((resolve, reject) => {
            interval = setInterval(() => {
                limit--;
                if (this.firebaseReady) {
                    clearInterval(interval);
                    resolve(this.userId);
                } else if (limit < 0) {
                    clearInterval(interval);
                    reject('timed out');
                }
            }, this.checkTime);
        });
    }

    appInitialized() {
        return EngageFire.initialized;
    }

    getUserFromAuth() {
        return this.$user;
    }

    getCollection() {
        return this.ref;
    }

    getDoc(id: string | undefined) {
        return this.ref.doc(id);
    }

    getSubCollection(id: string | undefined, collectionName: string) {
        return this.ref.doc(id).collection(collectionName);
    }

    getId() {
        return this.id;
    }

    setId(id: any) {
        this.id = id;
    }

    getAll() {
        return this.ref.get();
    }

    options(options = { loadList: true, collectionGroup: false, loadModal: true }) {
        if (options.collectionGroup) {
            this.ref = this.db.collectionGroup(<string>this.path);
        }
        if (options.loadModal) {
            this.getModelFromDb();
        }
        if (options.loadList) {
            this.getList()
        }
        return this;
    }

    async getChildDocs(doc: any) {
        for (const key in doc) {
            if (doc.hasOwnProperty(key)) {
                const element = doc[key];
                if (element && element.$id && element.$collection) {
                    doc[key] = await EngageFirestoreBase.getInstance(element.$collection).get(element.$id);
                }
            }
        }
        return doc;
    }

    // get data with ids added
    async getList(ref?: any) {
        this.$loading = true;
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        const list = await ref.get();
        this.list = this.addFireList(list);
        this.$loading = false;
        return this.list;
    }

    async getOnce(docId = this.id, pure = false) {
        this.$loading = true;
        await EngageFire.ready();
        try {
            const doc = await this.ref.doc(docId).get();
            this.$loading = false;
            if (pure) {
                return doc;
            } else if (doc.exists) {
                return this.addFire(doc.data(), docId);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async getWithChildern<T>(docId = this.id, ref?: any): Promise<T | any> {
        await EngageFire.ready();
        let doc: T | any = await this.get<T>(docId, ref);
        if (doc) {
            doc = await this.getChildDocs(doc);
        }
        return doc;
    }

    async get<T>(docId = this.id, ref?: any): Promise<T | any> {
        this.$loading = true;
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        try {
            const doc = await ref.doc(docId).get();
            this.$loading = false;
            if (doc.exists) {
                const fireDoc = this.addFire(doc.data(), docId);
                const index = this.list.findIndex(item => item.$id === fireDoc.$id);
                if (index > -1) this.list[index] = fireDoc;
                else this.list.push(fireDoc);
                return fireDoc;
            }
            return null;
        } catch (error) {
            console.error(`EngageFirestoreBase.get(${docId}):`, error);
            return null;
        }
    }

    async add(newDoc: any, ref?: any) {
        newDoc.$loading = true;
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        if (newDoc && (newDoc.$key || newDoc.$id)) {
            newDoc.$loading = false;
            return this.update(newDoc, ref);
        }
        if (this.debug) console.log(`add`, newDoc);
        newDoc = this.omitFire(newDoc);
        const blank = ref.doc();
        await blank.set(newDoc);
        return this.addFire(newDoc, blank.id);;
    }

    async set(newDoc: any, docRef: any) {
        console.log(docRef)
        newDoc.$loading = true;
        await EngageFire.ready();
        if (this.debug) console.log(`set`, newDoc);
        newDoc = this.omitFire(newDoc);
        await docRef.set(newDoc);
        return this.addFire(newDoc, docRef.id);
    }

    setWithId(id: string | undefined, newDoc: any) {
        return this.set(newDoc, this.ref.doc(id));
    }

    async update(doc: any, ref?: any) {
        doc.$loading = true;
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        let docRef: any;
        if (doc.$id) {
            docRef = ref.doc(doc.$id);
            doc.$loading = false;
            if (!(await docRef.get()).exists) return this.set(doc, docRef);
        } else if (doc.$key) {
            docRef = ref.doc(doc.$key);
            doc.$loading = false;
            if (!(await docRef.get()).exists) return this.set(doc, docRef);
        } else if (!ref.id) {
            doc.$loading = false;
            throw 'no id';
        }
        if (this.debug) console.log(`updated`, doc);
        doc = this.omitFire(doc);
        await docRef.update(doc);
        return this.addFire(doc, docRef.id);;
    }

    async save(newDoc: any, ref?: any) {
        Object.keys(newDoc || {}).forEach(value => newDoc[value] = newDoc[value] === undefined ? null : newDoc[value]);
        await EngageFire.ready();
        newDoc = this.omitFire(newDoc);
        newDoc.$updatedAt = Date.now();
        let doc;
        try {
            if (newDoc && (newDoc.$key || newDoc.$id)) {
                doc = await this.update(newDoc, <any>ref);
            } else if (ref && ref.id) {
                newDoc.$createdAt = Date.now();
                newDoc.$timezoneOffset = new Date().getTimezoneOffset();
                doc = await this.set(newDoc, <any>ref);
            } else {
                newDoc.$createdAt = Date.now();
                newDoc.$timezoneOffset = new Date().getTimezoneOffset();
                doc = await this.add(newDoc, <any>ref);
                this.list = [...this.list, doc];
            }
        } catch (error) {
            console.error(`EngageFirestoreBase.save(${(newDoc || {}).$id}):`, error, newDoc);

        }
        doc.$loading = false;
        return doc;
    }

    saveWithId(id: string | undefined, newDoc: any) {
        return this.save(newDoc, this.ref.doc(id));
    }

    remove(id: string | undefined, ref?: any) {
        if (!ref) ref = this.ref;
        if (this.debug) console.log('removing: ', id);
        return ref.doc(id).delete();
    }

    addFireList(collection: any): any {
        let list: any[] = [];
        if (collection && collection.size) {
            collection.forEach((doc: { exists: any; data: () => void; id: any; }) => {
                if (doc.exists) {
                    list.push(this.addFire(doc.data(), doc.id));
                }
            });
        }
        return list;
    }

    addFire(obj: any, id: any) {
        if (_.isObject(EngageDoc)) {
            obj.$id = id;
            return new (<any>EngageDoc)(obj, this.path, this.subCollections);
        }
        return obj;
    }

    omitFireList(list: any) {
        _.each(list, (val: any, i: any) => {
            list[i] = this.omitFire(val);
        });
        return list;
    }

    omitFire(payload: any) {
        if (payload && payload.$omitList) {
            payload = _.omit(payload, payload.$omitList);
        }
        _.forIn(payload, (val: any, i: any) => {
            if (_.isArray(val)) {
                payload[i] = val.map((item: any) => {
                    if (!_.isArray(val) && _.isObject(item)) {
                        this.omitFire(item);
                    }
                    return item;
                });
            } else if (_.isObject(val)) {
                payload[i] = this.omitFire(val);
                if (val && (<any>val)[i] && (<any>val)[i].$id) {
                    payload[i] = {
                        $id: (<any>val)[i].$id,
                        $collection: (<any>val)[i].$collection || i + 's',
                        $image: (<any>val)[i].$image || '',
                        name: (<any>val)[i].name || '',
                    };
                }
            }
        });
        return payload;
    }

    getFirebaseProjectId() {
        return EngageFire.getFirebaseProjectId();
    }

    /*
     * Firestore Base
     */
    async watch(id: string | undefined, cb: any, ref?: any) {
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        ref.doc(id).onSnapshot((doc: any) => {
            if (doc && doc.data()) {
                cb(this.addFire(doc.data(), doc.id), doc);
            } else {
                cb(null, doc);
            }
        });
    }

    async watchList(cb: any, ref?: any) {
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        ref.onSnapshot((snapshot: any) => {
            if (_.isArray(cb)) {
                cb = this.addFireList(snapshot);
            } else {
                cb(this.addFireList(snapshot));
            }
        });
    }

    watchPromise(id: string | undefined, ref?: any) {
        return new Promise(async (resolve, reject) => {
            await EngageFire.ready();
            if (!ref) ref = this.ref;
            ref.doc(id).onSnapshot((doc: any) => {
                if (doc && doc.data()) {
                    resolve({ value: this.addFire(doc.data(), doc.id), doc });
                } else {
                    resolve({ value: null, doc });
                }
            }, reject);
        });
    }

    watchListPromise(ref?: any) {
        return new Promise(async (resolve, reject) => {
            await EngageFire.ready();
            if (!ref) ref = this.ref;
            ref.onSnapshot((snapshot: any) => {
                resolve({ list: this.addFireList(snapshot), snapshot });
            }, reject);
        });
    }

    /* State Management */
    watchState(name: string | number) {
        this.state[name];
    }

    setState(name: string | number) {
        this.state[name];
    }

    getState(name: string | number) {
        this.state[name];
    }

    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     */
    deleteCollection(collectionRef = this.ref, batchSize = 50) {
        const query = collectionRef.limit(batchSize);
        return new Promise((resolve, reject) => {
            this.deleteQueryBatch(this.db, query, batchSize, resolve, reject);
        });
    }

    async deleteQueryBatch(db: any, query: any, batchSize: number, resolve: any, reject: any) {
        try {
            let numDeleted = 0;
            const snapshot = await query.get();
            // When there are no documents left, we are done
            if (snapshot.size == 0) {
                numDeleted = 0;
            } else {
                const batch = db.batch();
                snapshot.docs.forEach((doc: { ref: any; }) => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                numDeleted = snapshot.size;
            }
            if (numDeleted <= batchSize) {
                resolve();
                return;
            }
            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                this.deleteQueryBatch(db, query, batchSize, resolve, reject);
            });
        } catch (error) {
            reject(error);
        }
    }

    /*
     * UTILITIES
     */

    async replaceId(oldId: string, newId: any, ref?: any) {
        await EngageFire.ready();
        if (!ref) ref = this.ref;
        let data = await this.get(oldId, ref);
        if (data === null) {
            console.log('cant find record for: ' + oldId);
            return 'cant find record';
        }
        data = this.addFire(data, newId);
        await this.save(data);
        return await this.remove(oldId, ref);
    }

    async replaceIdOnCollection(oldId: string, newId: any, subRef?: any) {
        await EngageFire.ready();
        if (!subRef) {
            subRef = this.ref;
        }
        let data = await this.get(oldId, subRef);
        if (data === null) {
            console.log('cant find record for: ' + oldId);
            return 'cant find record';
        }
        data = this.addFire(data, newId);
        await this.save(data, subRef);
        return await this.remove(oldId, subRef);
    }

    async moveRecord(oldPath: any, newPath: any) {
        if (!this.db) return null;
        let record: any = await this.db.doc(oldPath).get();
        record = record.data();
        console.log('record move', record);
        await this.db.doc(newPath).set(record);
        const doc: any = this.db.doc(oldPath);
        return await doc.remove();
    }

    async copyRecord(oldPath: any, newPath: any, updateTimestamp = false) {
        if (!this.db) return null;
        let record: any = await this.db.doc(oldPath).get();
        record = record.data();
        if (updateTimestamp) record.$updatedAt = Date.now();
        console.log('record move', record);
        return await this.db.doc(newPath).set(record);
    }

    async backupDoc(doc: { $path: string; $backupAt: number; $save: () => void; }, deep = true, backupPath = '_backups') {
        console.log('deep', deep);
        const timestamp = Date.now();
        if (!doc) return Promise.reject('Missing Doc');
        const ef = EngageFirestoreBase.getInstance(backupPath + '/' + timestamp + '/' + doc.$path);
        doc.$backupAt = timestamp;
        await doc.$save();
        return await ef.save({
            ...doc,
            $updatedAt: timestamp
        });
        // if (deep) {
        //   return await doc.$subCollections.map(collection = this.backupCollection()
        // }
    }

    /* TODO: */
    async restore() { }

    /*
      Model
    */
    async addModelField(field: any) {
        let model: any = {
            $collection: this.path,
            name: '',
            label: _.capitalize(_.startCase(field))
        };
        if (typeof field === 'string') {
            model.name = field;
        } else {
            model = {
                ...model,
                ...field
            }
        }
        this.model = [
            ...this.model,
            await EngageFirestoreBase.getInstance(`$collections/${this.path}/$models`).save(model)
        ]
        return this.model;
    }

    getModelField(field: string): IEngageModel[] {
        return EngageFirestoreBase.getInstance(`$collections/${this.path}/$models`).get(field);
    }

    getModel(): IEngageModel[] {
        return this.model;
    }

    async getModelFromDb() {
        if ((<any>this.path).includes('$collections')) {
            return this.model = [];
        }
        this.model = await EngageFirestoreBase.getInstance(`$collections/${this.path}/$models`).getList();
        this.sortModel();
        return this.model;
    }

    async sortModel() {
        this.sortListByPosition(false, false, this.model);
        return this;
    }

    /* 
      Files
    */

    async deleteFile(doc: any, fileId: any) {
        const fileDoc = await doc.$getSubCollection('files').get(fileId);
        const desertRef = (<any>EngageFire.storage).child(fileDoc.meta.storagePath);

        // Delete the file
        return await desertRef.delete().then(() => fileDoc.$remove());
    }

    async deleteImage(doc: any) {
        const desertRef = (<any>EngageFire.storage).child(doc.$imageMeta.storagePath);

        // Delete the file
        return await desertRef.delete().then(() => {
            doc.$image = null;
            doc.$thumb = null;
            doc.$imageOrginal = null;
            doc.$imageMeta = null;
        });
    }

    // async secureDoc(doc, allowedPermissions) {
    //   doc.$$secure = true;
    //   doc.$$allowed = allowedPermissions;
    //   return await this.save(doc);
    // }
    //
    // async allowUserAccess(doc, id, permission) {
    //   return await doc.$collection('_permission').save({
    //     $id: id,
    //     permission: permission
    //   });
    // }
    //
    // async addPermission(id, permission) {
    //   const users = new EngageFirestore('_users/' + id + '/permissions');
    //   const permissions = new EngageFirestore('_permissions/' + permission.$id + '/routes');
    //   await users.save({
    //     $id: id,
    //     permission: permission
    //   });
    //   return await permissions.save({
    //     $id: id,
    //     permission: permission
    //   });
    // }
    //
    // async removePermission() {
    //
    // }
    //
    // async checkPermission() {
    //
    // }

    search(query?: string, filters?: string, debug = false) {
        const index = EngageAlgolia.getIndex(<string>this.path);
        return index.search(query, filters, debug);
    }

    static getInstance(
        path: string,
        options?: any
    ) {
        console.log('Firestore Path: ', path);
        if (!EngageFirestoreBase.instances[path]) {
            EngageFirestoreBase.instances[path] = new EngageFirestoreBase(path);
        }
        if (options) {
            return EngageFirestoreBase.instances[path].options(options);
        }
        return EngageFirestoreBase.instances[path];
    }


    /* List */
    sortList(sortFunc: any, _list?: any) {
        (_list || this.list).sort(sortFunc);
    }

    sortListByPosition(fresh = false, reverse = false, list?: any) {
        this.sortedBy = 'position';
        if (fresh) {
            this.getListByPosition(reverse ? 'asc' : 'desc');
        } else {
            this.sortList((x: any, y: any) => {
                if (reverse) {
                    return y.position - x.position
                }
                return x.position - y.position
            }, list);
        }
        return this;
    }

    async getListByPosition(direction: "desc" | "asc" | undefined = 'asc') {
        await this.ready();
        let ref = this.ref.orderBy('position', direction);
        return await this.getList(ref);
    }

    async buildListPositions() {
        await this.ready();
        await this.getList();
        console.log('Started Building positions...');
        this.sortListByPosition();
        const promises = this.list.map(async (item, index) => {
            item.position = index + 1;
            return item.$save();
        })
        await Promise.all(promises);
        console.log('Finished Building positions...');
    }

    /* 
      DATETIME
    */
    static getTimezoneOffset() {
        return new Date().getTimezoneOffset();
    }
}

export class EngageFirestoreFunction extends EngageFirestoreBase {

    constructor(
        public path: string
    ) {
        super(path);
    }
}

export default class EngageFirestore extends EngageFirestoreBase {

    constructor(
        public path: string
    ) {
        super(path);
    }

}

export let engageFirestore = (path, options?) => EngageFirestore.getInstance(path, options);