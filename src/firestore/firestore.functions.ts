import EngageFirestoreBase from './firestore.base';
import { engageFireInit } from '../engagefire/engagefire.functions';
import EngageFireDoc from '../doc/doc';

/*
 * TODO:
 * [ ] Fully test everything!
 * */
export default class EngageFirestore extends EngageFirestoreBase {
    // private static instanceFunctions: any = {};

    constructor(public path: string) {
        super(path);
    }

    // static getInstance(path, options?) {
    //     console.log('Firestore Path: ', path);
    //     if (!EngageFirestore.instanceFunctions[path]) {
    //         EngageFirestore.instanceFunctions[path] = new EngageFirestoreBase(path);
    //     }
    //     if (options) {
    //         return EngageFirestore.instanceFunctions[path].options(options);
    //     }
    //     return EngageFirestore.instanceFunctions[path];
    // }

    /* 
    * STATIC SETUP
    * */
    static set __DOC__(doc) {
        EngageFirestore.DOC = doc;
        EngageFirestoreBase.DOC = doc;
        EngageFireDoc.STORE = EngageFirestore;
    }

    static set __ENGAGE_FIRE__(engageFire) {
        EngageFirestore.ENGAGE_FIRE = engageFire;
        EngageFirestoreBase.ENGAGE_FIRE = engageFire;
    }

    static set __FIRE_OPTIONS__(options) {
        EngageFirestore.FIRE_OPTIONS = options;
        EngageFirestoreBase.FIRE_OPTIONS = options;
    }

    static set __STATE__(state) {
        EngageFirestore.STATE = state;
        EngageFirestoreBase.STATE = state;
    }
  
}

EngageFirestore.__DOC__ = EngageFireDoc;
EngageFirestore.__ENGAGE_FIRE__ = engageFireInit;
// export EngageFirestore
export let engageFirestore = (path: string, options?: any) => EngageFirestore.getInstance(path, options);
