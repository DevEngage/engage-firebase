import EngageFirestore, { engageFirestore } from './firestore';
import { Engagefire, engageFireInit } from '../engagefire/engagefire';
import EngageFireDoc from '../doc/doc';
import EngageFirestoreBase from './firestore.base';

Engagefire.FIRE_OPTIONS = {
    apiKey: "AIzaSyB0BO2DsW8udknAh0sfpvqNBHvU1vt-CY8",
    authDomain: "engage-firebase.firebaseapp.com",
    databaseURL: "https://engage-firebase.firebaseio.com",
    projectId: "engage-firebase",
    storageBucket: "engage-firebase.appspot.com",
    messagingSenderId: "255779484097",
    appId: "1:255779484097:web:772938aa5d153400"
};


// EngageFirestoreBase.DOC = EngageFireDoc;
// EngageFirestoreBase.ENGAGE_FIRE = engageFireInit;
// EngageFirestoreBase.FIRE_OPTIONS = Engagefire.FIRE_OPTIONS;


let collection;
let doc;

beforeEach(() => {
    collection = engageFirestore('test');
});

afterEach(async () => {
    if (doc) {
        await doc.$remove();
    }
});

test("document should be added with a field", async () => {
    doc = await collection.save({
        name: 'test'
    });
    expect(doc).toBeDefined();
    expect(doc.$id).toBeDefined();
    expect(doc.name).toBe('test');
});

test("document should be added and removed", async () => {
    const _doc = await collection.save({
        name: 'test remove'
    });
    expect(_doc).toBeDefined();
    await collection.remove(_doc.$id);
    expect(await collection.get(_doc.$id)).toBe(null);
});

/* 
    TODO: create tests
    - add
    - create
    -

*/