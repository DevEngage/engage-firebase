// import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/storage';
// import 'firebase/firestore';
const admin = require('firebase-admin');
const functions = require('firebase-functions');

export class EngagefireFunctions {
  static FIRE_OPTIONS: any;
  private static instance: EngagefireFunctions;
  user: any;
  firebase: any;
  firestore!: any;
  storage!: any;
  auth!: any;
  initialized: boolean = false;
  serviceAccount;

  private constructor () {
    this.init();
  }

  async init() {
    admin.initializeApp(functions.config().firebase);
    // this.firebase
    this.firestore = admin.firestore();
    this.initialized = true;
    console.log('INITIALIZING ENGAGE FIREBASE');
    this.auth = admin.auth();
    this.user = await this.auth.currentUser;
  }

  initStorage(bucketName, accountJson) {
    this.serviceAccount = require(accountJson);
    admin.initializeApp({
      credential: admin.credential.cert(this.serviceAccount),
      storageBucket: `${bucketName}.appspot.com`
    });
    this.storage = admin.storage().bucket();
    return this;
  }

  getFirebaseProjectId() {
    return functions.config().env.auth_domain.split('.')[0];
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
  static getInstance() {
    if (!EngagefireFunctions.instance)  {
      EngagefireFunctions.instance = new EngagefireFunctions();
    }
    return EngagefireFunctions.instance;
  }

}

// export let engageFire = Engagefire.getInstance(undefined, true);

export let engageFireInit = (fireOptions?) => {
  if (fireOptions) {
    EngagefireFunctions.FIRE_OPTIONS = fireOptions;
  }
  return EngagefireFunctions.getInstance();
};