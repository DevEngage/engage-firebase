import EngageFirestoreBase from './firestore.base';

/*
 * TODO:
 * [ ] Fully test everything!
 * */
export default class EngageFirestore extends EngageFirestoreBase {
  
}

// export EngageFirestore
export let engageFirestore = (path: string, options?: any) => EngageFirestore.getInstance(path, options);
