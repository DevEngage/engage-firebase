import EngageFirestoreBase from './firestore.base';
import { EngagefireFunctions } from '../engagefire/engagefire.functions';
import EngageFireDoc from '../doc/doc';

/*
 * TODO:
 * [ ] Fully test everything!
 * */
export default class EngageFirestore extends EngageFirestoreBase {

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
EngageFirestore.__ENGAGE_FIRE__ = EngagefireFunctions;
// export EngageFirestore
export let engageFirestore = (path: string, options?: any) => EngageFirestore.getInstance(path, options);
