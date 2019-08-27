import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { firestore } from 'firebase';
import { engageFireInit } from '../engagefire/engagefire';
import { engagePubsub } from '../pubsub/pubsub';
import EngageFireDoc from '../doc/doc';
import { EngageAlgolia } from '../algolia/algolia';
import {IEngageModel} from "../model/model";
import {EngageImage} from "../image/image";

declare let process: any;
declare let window: any;
declare let document: any;
declare let XMLHttpRequest: any;
type Blob = any;

export interface EngageICollection {
  name?: string;
  path?: string;
  subCollections?: EngageICollection[];
}

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
export default class EngageFirestore {
  static fireOptions: any;
  ref!: firestore.CollectionReference;
  auth!: firebase.User | null;
  $loading = true;
  userId: string = '';
  id: any;
  state = window.ENGAGE_STATE;
  ps = engagePubsub;
  firebaseReady: boolean = false;
  checkTime: number = 200;
  checkLimit: number = 50;
  debug: boolean = false;
  subCollections: string[] = [];
  list: any[] = [];
  private static instances: any = {};
  public model: any = [];
  omitList = [
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
    '$swapPosition',
    '$changeId',
    '$getModel',
  ];
  sortedBy: string = '';

  constructor(
    public path: firestore.CollectionReference | string,
    public db?: firestore.Firestore | undefined, // admin, firebase
    public docWrapper: any = EngageFireDoc
  ) {
    this.init();
  }

  async init() {
    await engageFireInit(EngageFirestore.fireOptions).ready();
    if (!this.db) {
      this.db = engageFireInit(EngageFirestore.fireOptions).firestore;
    }
    if (!window.ENGAGE_STATE) {
      window.ENGAGE_STATE = {};
      this.state = window.ENGAGE_STATE;
    }
    if (_.isString(this.path)) {
      this.ref = this.db.collection(<string>this.path);
    } else {
      this.ref = <firestore.CollectionReference>this.path;
    }
    if (this.appInitialized() && firebase && firebase.auth() && firebase.auth().currentUser) {
      this.auth = firebase.auth().currentUser;
      this.publish(this.auth, 'user');
      if (this.auth) {
        this.userId = this.auth.uid;
        if (this.debug) console.log('userId', this.userId);
      }
    }
    this.watchUser((user: any) => {
      this.publish(user, 'user');
    });
    this.firebaseReady = true;
    await this.getModelFromDb();
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

  async watchUser(cb: { (user: any): void; (arg0: firebase.User | null): void; }) {
    await this.ready();
    engageFireInit(EngageFirestore.fireOptions).auth.onAuthStateChanged((user) => {
      if (cb) cb(user || null);
    });
  }

  appInitialized() {
    return firebase.apps.length;
  }

  getUserId(): Promise<string> {
    if (this.userId) {
      return Promise.resolve(this.userId);
    } else if (this.appInitialized()) {
      return new Promise((resolve) =>
        firebase.auth().onAuthStateChanged((user) => {
          if (user && user.uid) {
            resolve(user.uid);
          } else {
            resolve('');
          }
        })
      );
    } else {
      return Promise.resolve('');
    }
  }

  getUserFromAuth() {
    return this.auth;
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

  options(options = { loadList: true }) {
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
          doc[key] = await engageFirestore(element.$collection).get(element.$id);
        }
      }
    }
    return doc;
  }

  // get data with ids added
  async getList(ref?: any) {
    this.$loading = true;
    await this.ready();
    if (!ref) ref = this.ref;
    const list = await ref.get();
    this.list = this.addFireList(list);
    this.$loading = false;
    return this.list;
  }

  async getOnce(docId = this.id, pure = false) {
    this.$loading = true;
    await this.ready();
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

  async getWithChildern<T>(docId = this.id, ref?: firestore.CollectionReference | undefined): Promise<EngageFireDoc | T | any> {
    await this.ready();
    let doc: EngageFireDoc | T | any = await this.get<T>(docId, ref);
    if (doc) {
      doc = await this.getChildDocs(doc);
    }
    return doc;
  }

  async get<T>(docId = this.id, ref?: firestore.CollectionReference | undefined): Promise<EngageFireDoc | T | any> {
    this.$loading = true;
    await this.ready();
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
      console.error(error);
      return null;
    }
  }

  async add(newDoc: any, ref?: firestore.CollectionReference) {
    newDoc.$loading = true;
    await this.ready();
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

  async set(newDoc: any, docRef: firestore.DocumentReference) {
    console.log(docRef)
    newDoc.$loading = true;
    await this.ready();
    if (this.debug) console.log(`set`, newDoc);
    newDoc = this.omitFire(newDoc);
    await docRef.set(newDoc);
    return this.addFire(newDoc, docRef.id);
  }

  setWithId(id: string | undefined, newDoc: any) {
    return this.set(newDoc, this.ref.doc(id));
  }

  async update(doc: any, ref?: firestore.CollectionReference | undefined) {
    doc.$loading = true;
    await this.ready();
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

  async save(newDoc: any, ref?: firestore.DocumentReference | firestore.CollectionReference | undefined) {
    await this.ready();
    newDoc = this.omitFire(newDoc);
    newDoc.updatedAt = Date.now();
    let doc;
    if (newDoc && (newDoc.$key || newDoc.$id)) {
      doc = await this.update(newDoc, <firestore.CollectionReference>ref);
    } else if (ref && ref.id) {
      newDoc.createdAt = Date.now();
      doc = await this.set(newDoc, <firestore.DocumentReference>ref);
    } else {
      newDoc.createdAt = Date.now();
      doc = await this.add(newDoc, <firestore.CollectionReference>ref);
      this.list = [...this.list, doc];
    }
    doc.$loading = false;
    return doc;
  }

  saveWithId(id: string | undefined, newDoc: any) {
    return this.save(newDoc, this.ref.doc(id));
  }

  remove(id: string | undefined, ref?: firestore.CollectionReference | undefined) {
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
    if (_.isObject(this.docWrapper)) {
      obj.$id = id;
      return new (<any>this.docWrapper)(obj, this.path, this.subCollections);
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
    const omitted = _.omit(payload, this.omitList);
    _.forIn(omitted, (val: any, i: any) => {
      if (_.isArray(val)) {
        omitted[i] = val.map((item: any) => {
          if (!_.isArray(val) && _.isObject(item)) {
            this.omitFire(item);
          }
          return item;
        });
      } else if (_.isObject(val)) {
        omitted[i] = this.omitFire(val);
        if (val && (<any>val)[i] && (<any>val)[i].$id) {
          omitted[i] = { 
            $id: (<any>val)[i].$id, 
            $collection: (<any>val)[i].$collection || i + 's',
            $image: (<any>val)[i].$image || '',
            name: (<any>val)[i].name || '', 
          };
        }
      }
    });
    return omitted;
  }

  getFirebaseProjectId() {
    if (!firebase.app().options) return null;
    return (<any>firebase.app().options)['authDomain'].split('.')[0];
  }

  /*
   * Firestore Base
   */
  async watch(id: string | undefined, cb: { (arg0: any, arg1: any): void; (arg0: null, arg1: any): void; }, ref?: firestore.CollectionReference | undefined) {
    await this.ready();
    if (!ref) ref = this.ref;
    ref.doc(id).onSnapshot((doc: any) => {
      if (doc && doc.data()) {
        cb(this.addFire(doc.data(), doc.id), doc);
      } else {
        cb(null, doc);
      }
    });
  }

  async watchList(cb: any, ref?: firestore.CollectionReference) {
    await this.ready();
    if (!ref) ref = this.ref;
    ref.onSnapshot((snapshot: any) => {
      if (_.isArray(cb)) {
        cb = this.addFireList(snapshot);
      } else {
        cb(this.addFireList(snapshot));
      }
    });
  }

  watchPromise(id: string | undefined, ref?: firestore.CollectionReference | undefined) {
    return new Promise(async (resolve, reject) => {
      await this.ready();
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

  watchListPromise(ref?: firestore.CollectionReference) {
    return new Promise(async (resolve, reject) => {
      await this.ready();
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

  async deleteQueryBatch(db: any, query: firestore.Query, batchSize: number, resolve: { (value?: unknown): void; (): void; }, reject: { (reason?: any): void; (arg0: any): void; }) {
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

  async replaceId(oldId: string, newId: any, ref?: firestore.CollectionReference) {
    await this.ready();
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

  async replaceIdOnCollection(oldId: string, newId: any, subRef?: firestore.CollectionReference) {
    await this.ready();
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
    if (updateTimestamp) record.updatedAt = Date.now();
    console.log('record move', record);
    return await this.db.doc(newPath).set(record);
  }

  async backupDoc(doc: { $path: string; $backupAt: number; $save: () => void; }, deep = true, backupPath = '_backups') {
    console.log('deep', deep);
    const timestamp = Date.now();
    if (!doc) return Promise.reject('Missing Doc');
    const ef = new EngageFirestore(backupPath + '/' + timestamp + '/' + doc.$path);
    doc.$backupAt = timestamp;
    await doc.$save();
    return await ef.save({
      ...doc,
      updatedAt: timestamp
    });
    // if (deep) {
    //   return await doc.$subCollections.map(collection = this.backupCollection()
    // }
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
  async restore() {}

  /*
   * FILES
   * */

  createFileInput(multi = false, accept?: string) {
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

  handleUpload(uploadTask: firebase.storage.UploadTask, doc: any, fileName?: any) {
    let uploadProgress = 0;
    let uploadState: firebase.storage.TaskState;
    const listeners: any[] = [];
    const notify = () => {
      listeners.forEach(item => {
        item({
          uploadProgress,
          uploadState,
          fileName
        });
      });
    }
    if (doc && fileName) {
      doc.$getProgress = (cb: Function) => {
        listeners.push(cb);
      }
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
      if (fileName) notify();
    }, (error) => {
      console.error(error);
      // Handle unsuccessful uploads
    }, async () => {
      const { state, metadata } = uploadTask.snapshot;
      const { name, size } = metadata;

      if (doc) {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        if (doc.$image === undefined) {
          delete doc.$image;
        }
        if (downloadURL) {
          if (!fileName) {
            doc.$thumb = downloadURL;
            await doc.$save();
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
        await doc.$save();
      }

    });
    return doc;
  }

  _handleFileUpload(element: any) {
    element.click();
    return new Promise((resolve) => {
      element.addEventListener('change', async () => {
        if (element && element.files && element.files.length) {
          resolve(element.files || []);
        } else {
          resolve([]);
        }
      });
    })
  }

  async uploadFiles(doc: any, files: any = [], id = 'eng-files') {
    if (this.debug) console.log('File Upload:', files);
    const storageRef = engageFireInit(EngageFirestore.fireOptions).storage.ref().child(doc.$path);
    const element: any = id ? document.getElementById(id) : this.createFileInput();
    const uploaded = [];
    if (!doc) return;
    const docFileCollection = doc.$getSubCollection('files');
    await docFileCollection.ready();
    files = await this._handleFileUpload(element);
    if (files && files.length) {
      files = files || element.files;
      for (let i = 0; i < files.length; i++) {
        const file: any = files[i];
        if ('name' in file) {
          let preFile;
          try {
            preFile = await docFileCollection.save({
              name: file.name
            });
          } catch (error) {
            console.error('Engage file upload:', error);
          }
          const snapshot: any = await storageRef
            .child('files')
            .child(preFile.$id)
            .child(file.name)
            .put(file);
          if (doc && snapshot) {
            doc = await this.handleUpload(snapshot, doc, file.name);
            preFile = {
              ...preFile,
              url: snapshot.downloadURL,
              meta: {
                storagePath: doc.$path + '/files/' + preFile.$id + '/' + file.name,
                state: snapshot.state
              }
            };
            uploaded.push(snapshot);
          }
        }
      }
      return uploaded;
    }
  }

  async uploadImage(doc: any, id?: string, file?: any) {
    const storageRef = engageFireInit(EngageFirestore.fireOptions).storage.ref().child(doc.$path);
    const element: any = id ? document.getElementById(id) : this.createFileInput();
    element.click();
    return new Promise((resolve, reject) => {
      element.addEventListener('change', async () => {
        if ((element && element.files && element.files.length) || file) {
          const _file = file || element.files[0];
          const [blob, thumbBlob]: [Blob, Blob] = await new EngageImage().rezieImageWithThumb(_file, doc);
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

            doc = await this.handleUpload(snapshot, doc, _file.name);
            doc = await this.handleUpload(snapshotThumb, doc);
          }
        } else {
          reject('Missing File(s)');
        }
        resolve(doc);
      });
    })
  }

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
      await engageFirestore(`$collections/${this.path}/$models`).save(model)
    ]
    return this.model;
  }

  getModelField(field: string): IEngageModel[] {
    return engageFirestore(`$collections/${this.path}/$models`).get(field);
  }

  getModel(): IEngageModel[] {
    return this.model;
  }

  async getModelFromDb() {
    if ((<any>this.path).includes('$collections')) {
      return this.model = [];
    }
    this.model = await engageFirestore(`$collections/${this.path}/$models`).getList();
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
    const desertRef = (<any>engageFireInit(EngageFirestore.fireOptions).storage).child(fileDoc.meta.storagePath);

    // Delete the file
    return await desertRef.delete().then(() => fileDoc.$remove());
  }

  async deleteImage(doc: any) {
    const desertRef = (<any>engageFireInit(EngageFirestore.fireOptions).storage).child(doc.$imageMeta.storagePath);

    // Delete the file
    return await desertRef.delete().then(() => {
      doc.$image = null;
      doc.$thumbnail = null;
      doc.$imageOrginal = null;
      doc.$imageMeta = null;
    });
  }

  downloadFile(fileUrl: string) {
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
  async login(email: string, password: string) {
    return await engageFireInit(EngageFirestore.fireOptions).auth.signInWithEmailAndPassword(email, password);
  }

  async loginSocial(service: any, method: string, scope?: any, mobile = false) {
    console.log('isMobile', mobile);
    let provider: any ;
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

    if (provider) provider.addScope(scope);

    if (method === 'popup') {
      return await engageFireInit(EngageFirestore.fireOptions).auth.signInWithPopup(provider);
    } else {
      return await engageFireInit(EngageFirestore.fireOptions).auth.signInWithRedirect(provider);
    }
  }

  async signup(email: string, password: string) {
    return await engageFireInit(EngageFirestore.fireOptions).auth.createUserWithEmailAndPassword(email, password);
  }

  async logout() {
    return await engageFireInit(EngageFirestore.fireOptions).auth.signOut();
  }

  async sendEmailVerification() {
    return await (<any>engageFireInit(EngageFirestore.fireOptions).auth).sendEmailVerification();
  }

  async forgotPassword(email: string) {
    return await engageFireInit(EngageFirestore.fireOptions).auth.sendPasswordResetEmail(email);
  }

  async updatePassword(newPassword: any) {
    return await (<any>engageFireInit(EngageFirestore.fireOptions).auth).updatePassword(newPassword);
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

  setDocClass(docWrapper: any) {
    this.docWrapper = docWrapper;
  }

  static getInstance(
    path: string,
    options?: any
  ) {
    if (!EngageFirestore.instances[path])  {
      EngageFirestore.instances[path] = new EngageFirestore(path);
    }
    if (options) {
      return EngageFirestore.instances[path].options(options);
    }
    return EngageFirestore.instances[path];
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

}


// export EngageFirestore
export let engageFirestore = (path: string, options?: any) => EngageFirestore.getInstance(path, options);
