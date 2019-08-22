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
const lodash_1 = require("lodash");
const engagefire_1 = require("./engagefire");
const pubsub_1 = require("./pubsub");
const doc_1 = require("./doc");
const algolia_1 = require("./algolia");
const engage_image_1 = require("@/firebase/engage-image");
/*
 * TODO:
 * [ ] Implement State Manage,
 * [ ] Create query system that can save query models
 * [X] Show upload progress
 * [X] Handle file uploads better
 * [ ] Fully test everything!
 * [X] Add types (models) to doc in class
 * [ ] Add Model system
 * [ ] Integrate User name ($getUserName)
 * [ ] Change doc methods to doc prototype methods. Maybe make a class?
 * */
class EngageFirestore {
    constructor(path, db, // admin, firebase
    docWrapper = doc_1.default) {
        this.path = path;
        this.db = db;
        this.docWrapper = docWrapper;
        this.$loading = true;
        this.state = window.ENGAGE_STATE;
        this.ps = pubsub_1.engagePubsub;
        this.firebaseReady = false;
        this.checkTime = 200;
        this.checkLimit = 50;
        this.debug = false;
        this.subCollections = [];
        this.list = [];
        this.model = [];
        this.omitList = [
            '$key',
            '$value',
            '$exists',
            '$params',
            '$ref',
            '$save',
            '$update',
            '$set',
            '$get',
            '$attachOwner',
            '$addFiles',
            '$setImage',
            '$removeImage',
            '$removeFile',
            '$downloadFile',
            '$remove',
            '$watch',
            '$watchPromise',
            '$isOwner',
            '$getFile',
            '$getFiles',
            '$path',
            '$backup',
            '$engageFireStore',
            '$owner',
            '$doc',
            '$collections',
            '$$difference',
            '$$updateDoc',
            '$$init',
            '$getProgress',
            '$omitList',
            '$collectionsList',
            '$loading',
            '$getSubCollection',
            '$$getSortedParentList',
            '$moveDown',
            '$moveUp',
        ];
        this.sortedBy = '';
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield engagefire_1.engageFire.ready();
            if (!this.db) {
                this.db = engagefire_1.engageFire.firestore;
            }
            if (!window.ENGAGE_STATE) {
                window.ENGAGE_STATE = {};
                this.state = window.ENGAGE_STATE;
            }
            if (lodash_1.default.isString(this.path)) {
                this.ref = this.db.collection(this.path);
            }
            else {
                this.ref = this.path;
            }
            if (this.appInitialized() && firebase && firebase.auth() && firebase.auth().currentUser) {
                this.auth = firebase.auth().currentUser;
                this.publish(this.auth, 'user');
                if (this.auth) {
                    this.userId = this.auth.uid;
                    if (this.debug)
                        console.log('userId', this.userId);
                }
            }
            this.watchUser((user) => {
                this.publish(user, 'user');
            });
            this.firebaseReady = true;
            yield this.getModelFromDb();
            this.$loading = false;
        });
    }
    addSubCollections(collections) {
        this.subCollections = [...this.subCollections, ...collections];
        return this;
    }
    toggleDebug() {
        this.debug = !this.debug;
    }
    canSub() {
        return !!this.ps;
    }
    publish(data, what) {
        return this.ps.publish(data, what);
    }
    subscribe(what, listener) {
        return this.ps.subscribe(what, listener);
    }
    ready() {
        let limit = this.checkLimit;
        let interval;
        if (this.firebaseReady)
            return Promise.resolve(this.userId);
        return new Promise((resolve, reject) => {
            interval = setInterval(() => {
                limit--;
                if (this.firebaseReady) {
                    clearInterval(interval);
                    resolve(this.userId);
                }
                else if (limit < 0) {
                    clearInterval(interval);
                    reject('timed out');
                }
            }, this.checkTime);
        });
    }
    watchUser(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            engagefire_1.engageFire.auth.onAuthStateChanged((user) => {
                if (cb)
                    cb(user || null);
            });
        });
    }
    appInitialized() {
        return firebase.apps.length;
    }
    getUserId() {
        if (this.userId) {
            return Promise.resolve(this.userId);
        }
        else if (this.appInitialized()) {
            return new Promise((resolve) => firebase.auth().onAuthStateChanged((user) => {
                if (user && user.uid) {
                    resolve(user.uid);
                }
                else {
                    resolve(null);
                }
            }));
        }
        else {
            return Promise.resolve(null);
        }
    }
    getUserFromAuth() {
        return this.auth;
    }
    getCollection() {
        return this.ref;
    }
    getDoc(id) {
        return this.ref.doc(id);
    }
    getSubCollection(id, collectionName) {
        return this.ref.doc(id).collection(collectionName);
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getAll() {
        return this.ref.get();
    }
    options(options = { loadList: true }) {
        if (options.loadList) {
            this.getList();
        }
        return this;
    }
    getChildDocs(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in doc) {
                if (doc.hasOwnProperty(key)) {
                    const element = doc[key];
                    if (element && element.$id && element.$collection) {
                        doc[key] = yield exports.engageFirestore(element.$collection).get(element.$id);
                    }
                }
            }
            return doc;
        });
    }
    // get data with ids added
    getList(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$loading = true;
            yield this.ready();
            if (!ref)
                ref = this.ref;
            const list = yield ref.get();
            this.list = this.addFireList(list);
            this.$loading = false;
            return this.list;
        });
    }
    getOnce(docId = this.id, pure = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$loading = true;
            yield this.ready();
            try {
                const doc = yield this.ref.doc(docId).get();
                this.$loading = false;
                if (pure) {
                    return doc;
                }
                else if (doc.exists) {
                    return this.addFire(doc.data(), docId);
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    getWithChildern(docId = this.id, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            let doc = yield this.get(docId, ref);
            if (doc) {
                doc = yield this.getChildDocs(doc);
            }
            return doc;
        });
    }
    get(docId = this.id, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$loading = true;
            yield this.ready();
            if (!ref)
                ref = this.ref;
            try {
                const doc = yield ref.doc(docId).get();
                this.$loading = false;
                if (doc.exists) {
                    const fireDoc = this.addFire(doc.data(), docId);
                    const index = this.list.findIndex(item => item.$id === fireDoc.$id);
                    if (index > -1)
                        this.list[index] = fireDoc;
                    else
                        this.list.push(fireDoc);
                    return fireDoc;
                }
                return null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    add(newDoc, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            newDoc.$loading = true;
            yield this.ready();
            if (!ref)
                ref = this.ref;
            if (newDoc && (newDoc.$key || newDoc.$id)) {
                newDoc.$loading = false;
                return this.update(newDoc, ref);
            }
            if (this.debug)
                console.log(`add`, newDoc);
            newDoc = this.omitFire(newDoc);
            const blank = ref.doc();
            yield blank.set(newDoc);
            return this.addFire(newDoc, blank.id);
            ;
        });
    }
    set(newDoc, docRef) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(docRef);
            newDoc.$loading = true;
            yield this.ready();
            if (this.debug)
                console.log(`set`, newDoc);
            newDoc = this.omitFire(newDoc);
            yield docRef.set(newDoc);
            return this.addFire(newDoc, docRef.id);
        });
    }
    setWithId(id, newDoc) {
        return this.set(newDoc, this.ref.doc(id));
    }
    update(doc, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            doc.$loading = true;
            yield this.ready();
            if (!ref)
                ref = this.ref;
            let docRef;
            if (doc.$id) {
                docRef = ref.doc(doc.$id);
                doc.$loading = false;
                if (!(yield docRef.get()).exists)
                    return this.set(doc, docRef);
            }
            else if (doc.$key) {
                docRef = ref.doc(doc.$key);
                doc.$loading = false;
                if (!(yield docRef.get()).exists)
                    return this.set(doc, docRef);
            }
            else if (!ref.id) {
                doc.$loading = false;
                throw 'no id';
            }
            if (this.debug)
                console.log(`updated`, doc);
            doc = this.omitFire(doc);
            yield docRef.update(doc);
            return this.addFire(doc, docRef.id);
            ;
        });
    }
    save(newDoc, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            newDoc = this.omitFire(newDoc);
            newDoc.updatedAt = Date.now();
            let doc;
            if (newDoc && (newDoc.$key || newDoc.$id)) {
                doc = yield this.update(newDoc, ref);
            }
            else if (ref && ref.id) {
                newDoc.createdAt = Date.now();
                doc = yield this.set(newDoc, ref);
            }
            else {
                newDoc.createdAt = Date.now();
                doc = yield this.add(newDoc, ref);
                this.list = [...this.list, doc];
            }
            doc.$loading = false;
            return doc;
        });
    }
    saveWithId(id, newDoc) {
        return this.save(newDoc, this.ref.doc(id));
    }
    remove(id, ref) {
        if (!ref)
            ref = this.ref;
        if (this.debug)
            console.log('removing: ', id);
        return ref.doc(id).delete();
    }
    addFireList(collection) {
        let list = [];
        if (collection && collection.size) {
            collection.forEach((doc) => {
                if (doc.exists) {
                    list.push(this.addFire(doc.data(), doc.id));
                }
            });
        }
        return list;
    }
    addFire(obj, id) {
        if (lodash_1.default.isObject(this.docWrapper)) {
            obj.$id = id;
            return new this.docWrapper(obj, this.path, this.subCollections);
        }
        return obj;
    }
    omitFireList(list) {
        lodash_1.default.each(list, (val, i) => {
            list[i] = this.omitFire(val);
        });
        return list;
    }
    omitFire(payload) {
        if (payload && payload.$omitList) {
            payload = lodash_1.default.omit(payload, payload.$omitList);
        }
        const omitted = lodash_1.default.omit(payload, this.omitList);
        lodash_1.default.forIn(omitted, (val, i) => {
            if (lodash_1.default.isArray(val)) {
                omitted[i] = val.map((item) => {
                    if (!lodash_1.default.isArray(val) && lodash_1.default.isObject(item)) {
                        this.omitFire(item);
                    }
                    return item;
                });
            }
            else if (lodash_1.default.isObject(val)) {
                omitted[i] = this.omitFire(val);
                if (val && val[i] && val[i].$id) {
                    omitted[i] = {
                        $id: val[i].$id,
                        $collection: val[i].$collection || i + 's',
                        $image: val[i].$image || '',
                        name: val[i].name || '',
                    };
                }
            }
        });
        return omitted;
    }
    getFirebaseProjectId() {
        return firebase.app().options['authDomain'].split('.')[0];
    }
    /*
     * Firestore Base
     */
    watch(id, cb, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            if (!ref)
                ref = this.ref;
            ref.doc(id).onSnapshot((doc) => {
                if (doc && doc.data()) {
                    cb(this.addFire(doc.data(), doc.id), doc);
                }
                else {
                    cb(null, doc);
                }
            });
        });
    }
    watchList(cb, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            if (!ref)
                ref = this.ref;
            ref.onSnapshot((snapshot) => {
                if (lodash_1.default.isArray(cb)) {
                    cb = this.addFireList(snapshot);
                }
                else {
                    cb(this.addFireList(snapshot));
                }
            });
        });
    }
    watchPromise(id, ref) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            if (!ref)
                ref = this.ref;
            ref.doc(id).onSnapshot((doc) => {
                if (doc && doc.data()) {
                    resolve({ value: this.addFire(doc.data(), doc.id), doc });
                }
                else {
                    resolve({ value: null, doc });
                }
            }, reject);
        }));
    }
    watchListPromise(ref) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            if (!ref)
                ref = this.ref;
            ref.onSnapshot((snapshot) => {
                resolve({ list: this.addFireList(snapshot), snapshot });
            }, reject);
        }));
    }
    /* State Management */
    watchState(name) {
        this.state[name];
    }
    setState(name) {
        this.state[name];
    }
    getState(name) {
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
    deleteQueryBatch(db, query, batchSize, resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let numDeleted = 0;
                const snapshot = yield query.get();
                // When there are no documents left, we are done
                if (snapshot.size == 0) {
                    numDeleted = 0;
                }
                else {
                    const batch = db.batch();
                    snapshot.docs.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    yield batch.commit();
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /*
     * UTILITIES
     */
    replaceId(oldId, newId, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            if (!ref)
                ref = this.ref;
            let data = yield this.get(oldId, ref);
            if (data === null) {
                console.log('cant find record for: ' + oldId);
                return 'cant find record';
            }
            data = this.addFire(data, newId);
            yield this.save(data);
            return yield this.remove(oldId, ref);
        });
    }
    replaceIdOnCollection(oldId, newId, subRef) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            if (!subRef) {
                subRef = this.ref;
            }
            let data = yield this.get(oldId, subRef);
            if (data === null) {
                console.log('cant find record for: ' + oldId);
                return 'cant find record';
            }
            data = this.addFire(data, newId);
            yield this.save(data, subRef);
            return yield this.remove(oldId, subRef);
        });
    }
    moveRecord(oldPath, newPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield this.db.doc(oldPath).get();
            record = record.data();
            console.log('record move', record);
            yield this.db.doc(newPath).set(record);
            const doc = this.db.doc(oldPath);
            return yield doc.remove();
        });
    }
    copyRecord(oldPath, newPath, updateTimestamp = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield this.db.doc(oldPath).get();
            record = record.data();
            if (updateTimestamp)
                record.updatedAt = Date.now();
            console.log('record move', record);
            return yield this.db.doc(newPath).set(record);
        });
    }
    backupDoc(doc, deep = true, backupPath = '_backups') {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('deep', deep);
            const timestamp = Date.now();
            if (!doc)
                return Promise.reject('Missing Doc');
            const ef = new EngageFirestore(backupPath + '/' + timestamp + '/' + doc.$path);
            doc.$backupAt = timestamp;
            yield doc.$save();
            return yield ef.save(Object.assign({}, doc, { updatedAt: timestamp }));
            // if (deep) {
            //   return await doc.$subCollections.map(collection = this.backupCollection()
            // }
        });
    }
    // async backupCollection(collection, deep = true, backupPath = '_backups') {
    //   const ef = new EngageFirestore(collection.path);
    //   await Promise.all((await ef.getList()).map(async doc => {
    //     await this.backupDoc(doc, backupPath);
    //     doc.$subCollections
    //     if (collection && collection.subCollections.length) {
    //       return await Promise.all(collection.subCollections.map((subCollection: EngageICollection) => {
    //         subCollection.path = subCollection.path + '/' + doc.$id;
    //         return this.backupCollection(subCollection, backupPath);
    //       }));
    //     } else {
    //       return true;
    //     }
    //
    //     return await this.backupDoc(doc, backupPath);
    //   }));
    // }
    /* TODO: */
    restore() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /*
     * FILES
     * */
    createFileInput(multi = false, accept) {
        const id = 'eng-files';
        let input = document.getElementById(id);
        if (!input) {
            input = document.createElement("input");
        }
        input.setAttribute("style", "display: none;");
        input.setAttribute("type", "file");
        if (accept) {
            input.setAttribute("accept", "file");
        }
        if (multi) {
            input.setAttribute("multiple", "true");
        }
        input.setAttribute("name", "engage-files");
        input.setAttribute("id", "eng-files");
        //append to form element that you want .
        document.body.appendChild(input);
        return input;
    }
    handleUpload(uploadTask, doc, fileName) {
        let uploadProgress = 0;
        let uploadState;
        const listeners = [];
        const notify = () => {
            listeners.forEach(item => {
                item({
                    uploadProgress,
                    uploadState,
                    fileName
                });
            });
        };
        if (doc && fileName) {
            doc.$getProgress = (cb) => {
                listeners.push(cb);
            };
        }
        uploadTask.on('state_changed', function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            uploadProgress = progress;
            uploadState = snapshot.state;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
            if (fileName)
                notify();
        }, (error) => {
            console.error(error);
            // Handle unsuccessful uploads
        }, () => __awaiter(this, void 0, void 0, function* () {
            const { state, metadata } = uploadTask.snapshot;
            const { name, size } = metadata;
            if (doc) {
                const downloadURL = yield uploadTask.snapshot.ref.getDownloadURL();
                if (doc.$image === undefined) {
                    delete doc.$image;
                }
                if (downloadURL) {
                    if (!fileName) {
                        doc.$thumb = downloadURL;
                        yield doc.$save();
                        return;
                    }
                    doc.$image = downloadURL;
                }
                // doc.$thumbnail = snapshot.downloadURL;
                doc.$imageMeta = {
                    name,
                    storagePath: doc.$path + '$image' + name,
                    original: downloadURL,
                    state,
                    size,
                };
                if (doc.$imageMeta && doc.$imageMeta.original === undefined) {
                    delete doc.$imageMeta.original;
                }
                yield doc.$save();
            }
        }));
        return doc;
    }
    _handleFileUpload(element) {
        element.click();
        return new Promise((resolve) => {
            element.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                if (element && element.files && element.files.length) {
                    resolve(element.files || []);
                }
                else {
                    resolve([]);
                }
            }));
        });
    }
    uploadFiles(doc, files = [], id = 'eng-files') {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug)
                console.log('File Upload:', files);
            const storageRef = engagefire_1.engageFire.storage.ref().child(doc.$path);
            const element = id ? document.getElementById(id) : this.createFileInput();
            const uploaded = [];
            if (!doc)
                return;
            const docFileCollection = doc.$getSubCollection('files');
            yield docFileCollection.ready();
            files = yield this._handleFileUpload(element);
            if (files && files.length) {
                files = files || element.files;
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if ('name' in file) {
                        let preFile;
                        try {
                            preFile = yield docFileCollection.save({
                                name: file.name
                            });
                        }
                        catch (error) {
                            console.error('Engage file upload:', error);
                        }
                        const snapshot = yield storageRef
                            .child('files')
                            .child(preFile.$id)
                            .child(file.name)
                            .put(file);
                        if (doc && snapshot) {
                            doc = yield this.handleUpload(snapshot, doc, file.name);
                            preFile = Object.assign({}, preFile, { url: snapshot.downloadURL, meta: {
                                    storagePath: doc.$path + '/files/' + preFile.$id + '/' + file.name,
                                    state: snapshot.state
                                } });
                            uploaded.push(snapshot);
                        }
                    }
                }
                return uploaded;
            }
        });
    }
    uploadImage(doc, id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageRef = engagefire_1.engageFire.storage.ref().child(doc.$path);
            const element = id ? document.getElementById(id) : this.createFileInput();
            element.click();
            return new Promise((resolve, reject) => {
                element.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                    if ((element && element.files && element.files.length) || file) {
                        const _file = file || element.files[0];
                        const [blob, thumbBlob] = yield new engage_image_1.EngageImage().rezieImageWithThumb(_file, doc);
                        if ('name' in _file) {
                            // txt += "name: " + file.name + "<br>";
                            const snapshot = storageRef
                                .child('$image')
                                .child(_file.name)
                                .put(blob);
                            const snapshotThumb = storageRef
                                .child('$thumb')
                                .child(_file.name)
                                .put(thumbBlob);
                            doc = yield this.handleUpload(snapshot, doc, _file.name);
                            doc = yield this.handleUpload(snapshotThumb, doc);
                        }
                    }
                    else {
                        reject('Missing File(s)');
                    }
                    resolve(doc);
                }));
            });
        });
    }
    /*
      Model
    */
    addModelField(field) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = {
                $collection: this.path,
                name: '',
                label: lodash_1.default.capitalize(lodash_1.default.startCase(field))
            };
            if (typeof field === 'string') {
                model.name = field;
            }
            else {
                model = Object.assign({}, model, field);
            }
            this.model = [
                ...this.model,
                yield exports.engageFirestore(`$collections/${this.path}/$models`).save(model)
            ];
            return this.model;
        });
    }
    getModelField(field) {
        return exports.engageFirestore(`$collections/${this.path}/$models`).get(field);
    }
    getModel() {
        return this.model;
    }
    getModelFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.path.includes('$collections')) {
                return this.model = [];
            }
            this.model = yield exports.engageFirestore(`$collections/${this.path}/$models`).getList();
            this.sortModel();
            return this.model;
        });
    }
    sortModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sortListByPosition(false, false, this.model);
            return this;
        });
    }
    /*
      Files
    */
    deleteFile(doc, fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileDoc = yield doc.$getSubCollection('files').get(fileId);
            const desertRef = engagefire_1.engageFire.storage.child(fileDoc.meta.storagePath);
            // Delete the file
            return yield desertRef.delete().then(() => fileDoc.$remove());
        });
    }
    deleteImage(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const desertRef = engagefire_1.engageFire.storage.child(doc.$imageMeta.storagePath);
            // Delete the file
            return yield desertRef.delete().then(() => {
                doc.$image = null;
                doc.$thumbnail = null;
                doc.$imageOrginal = null;
                doc.$imageMeta = null;
            });
        });
    }
    downloadFile(fileUrl) {
        return new Promise((resolve) => {
            // This can be downloaded directly:
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = () => {
                let blob = xhr.response;
                resolve(blob);
            };
            xhr.open('GET', fileUrl);
            xhr.send();
        });
    }
    /* AUTH */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield engagefire_1.engageFire.auth.signInWithEmailAndPassword(email, password);
        });
    }
    loginSocial(service, method, scope, mobile = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('isMobile', mobile);
            let provider;
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
            if (method === 'popup') {
                return yield engagefire_1.engageFire.auth.signInWithPopup(provider);
            }
            else {
                return yield engagefire_1.engageFire.auth.signInWithRedirect(provider);
            }
        });
    }
    signup(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield engagefire_1.engageFire.auth.createUserWithEmailAndPassword(email, password);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield engagefire_1.engageFire.auth.signOut();
        });
    }
    sendEmailVerification() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield engagefire_1.engageFire.auth.sendEmailVerification();
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield engagefire_1.engageFire.auth.sendPasswordResetEmail(email);
        });
    }
    updatePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield engagefire_1.engageFire.auth.updatePassword(newPassword);
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
    search(query, filters, debug = false) {
        const index = algolia_1.EngageAlgolia.getIndex(this.path);
        return index.search(query, filters, debug);
    }
    setDocClass(docWrapper) {
        this.docWrapper = docWrapper;
    }
    static getInstance(path, options) {
        if (!EngageFirestore.instances[path]) {
            EngageFirestore.instances[path] = new EngageFirestore(path);
        }
        if (options) {
            return EngageFirestore.instances[path].options(options);
        }
        return EngageFirestore.instances[path];
    }
    /* List */
    sortList(sortFunc, _list) {
        (_list || this.list).sort(sortFunc);
    }
    sortListByPosition(fresh = false, reverse = false, list) {
        this.sortedBy = 'position';
        if (fresh) {
            this.getListByPosition(reverse ? 'asc' : 'desc');
        }
        else {
            this.sortList((x, y) => {
                if (reverse) {
                    return y.position - x.position;
                }
                return x.position - y.position;
            }, list);
        }
        return this;
    }
    getListByPosition(direction = 'asc') {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            let ref = this.ref.orderBy('position', direction);
            return yield this.getList(ref);
        });
    }
    buildListPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready();
            yield this.getList();
            console.log('Started Building positions...');
            this.sortListByPosition();
            const promises = this.list.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                item.position = index + 1;
                return item.$save();
            }));
            yield Promise.all(promises);
            console.log('Finished Building positions...');
        });
    }
}
EngageFirestore.instances = {};
exports.default = EngageFirestore;
// export EngageFirestore
exports.engageFirestore = (path, options) => EngageFirestore.getInstance(path, options);
//# sourceMappingURL=firestore.js.map