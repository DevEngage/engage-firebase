import EngageFirestore, { engageFirestore } from "./v2/firestore";
import EngageDoc from "./v2/doc";
import { EngageAnalytics } from "./v2/analytics";
import { EngageAlgolia } from "./v2/algolia";
import EngageImage from "./v2/image";
import EngageFire from "./v2/engagefire";
import { EngageAuth, EngageFile } from "./v2";


EngageAnalytics.DOC = EngageDoc;
EngageAnalytics.STORE = EngageFirestore;

EngageDoc.STORE = EngageFirestore;

const firestore = engageFirestore;
const Doc = EngageDoc;


export default engageFirestore;
export {
    // Frontend
    firestore,
    EngageFirestore,
    Doc,
    EngageDoc,
    EngageFire,
    // EngageModel,
    // adminModel,
    EngageAlgolia,
    EngageImage,
    EngageAnalytics,
    EngageAuth,
    EngageFile,
    // // Interfaces // //
    // IEngageFirebase,
    // IEngageFirebaseObject,
    // IEngageImage,
    // IEngageFirebaseCollection,
    // IEngageFirebaseDoc,
    // IEngageModel,
    // IEngageTriggerData,
}