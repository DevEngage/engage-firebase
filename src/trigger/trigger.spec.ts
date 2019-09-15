import EngageFirestore, { engageFirestore } from '../firestore/firestore';
import { Engagefire, engageFireInit } from '../engagefire/engagefire';
import EngageFireDoc from '../doc/doc';
import EngageFirestoreBase from '../firestore/firestore.base';
import { EngageAnalyticsTrigger, EngageAnalytics } from '../functions';

// Engagefire.FIRE_OPTIONS = {
//     apiKey: "AIzaSyB0BO2DsW8udknAh0sfpvqNBHvU1vt-CY8",
//     authDomain: "engage-firebase.firebaseapp.com",
//     databaseURL: "https://engage-firebase.firebaseio.com",
//     projectId: "engage-firebase",
//     storageBucket: "engage-firebase.appspot.com",
//     messagingSenderId: "255779484097",
//     appId: "1:255779484097:web:772938aa5d153400"
// };


// EngageFirestoreBase.DOC = EngageFireDoc;
// EngageFirestoreBase.ENGAGE_FIRE = engageFireInit;
// EngageFirestoreBase.FIRE_OPTIONS = Engagefire.FIRE_OPTIONS;


let collection;
let doc;

// beforeEach(() => {
//     collection = engageFirestore('test');
// });

// afterEach(async () => {
//     if (doc) {
//         await doc.$remove();
//     }
// });

test("document should be added with a field", async () => {
    const path = EngageAnalytics.triggerParser('events/{id}/attendees/{subId}');
    // const triggerRef = EngageAnalytics.createTriggerRef({
    //     data: {
    //         $id: '3214',
    //         groupId: 'test group'
    //     },
    //     action: 'create',
    //     trigger: 'events/{eventId}/attendees/{attendeeId}'
    // });
    // console.log('path', path);
    // expect(triggerRef).toBe('events/3214');
    // expect(doc.$id).toBeDefined();
    // expect(doc.name).toBe('test');
});

/*
    TODO: create tests
    - add
    - create
    -

*/