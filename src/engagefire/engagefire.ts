import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

export class Engagefire {
  static FIRE_OPTIONS: any;
  private static instance: Engagefire;
  user: any;
  firebase: firebase.app.App;
  firestore!: firebase.firestore.Firestore;
  storage!: firebase.storage.Storage;
  auth!: firebase.auth.Auth;
  initialized: boolean = false;

  private constructor (
    protected config?: any,
    public enablePersistence?: boolean
  ) {
    if (this.enablePersistence === undefined) {
      this.enablePersistence = true;
    }
    if (firebase.apps[0]) {
      this.firebase = firebase.apps[0];
    } else if (config || Engagefire.FIRE_OPTIONS) {
      this.firebase = firebase.initializeApp(config || Engagefire.FIRE_OPTIONS);
    }
  }

  async init() {
    await this.initFirestore();
    this.initialized = true;
    console.log('INITIALIZING ENGAGE FIREBASE');
    this.auth = firebase.auth();
    this.storage = firebase.storage();
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  getFirebaseProjectId() {
    if (!firebase.app().options) return null;
    return (<any>firebase.app().options)['authDomain'].split('.')[0];
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
            this.initialized = true
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

            } else if (err.code == 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
            }
          });
      } else {
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

  async ready() {
    if (this.initialized) {
      return this.access();
    }
    await this.init();
    return this.access();
  }

  // Create a Singleton to help prevent initializing firebase more than once.
  static getInstance(config: any, enablePersistence: boolean) {
    if (!Engagefire.instance)  {
      Engagefire.instance = new Engagefire(config, enablePersistence);
    }
    return Engagefire.instance;
  }

}

// export let engageFire = Engagefire.getInstance(undefined, true);

export let engageFireInit = (fireOptions?) => {
  if (fireOptions) {
    Engagefire.FIRE_OPTIONS = fireOptions;
  }
  return Engagefire.getInstance(fireOptions, true);
};