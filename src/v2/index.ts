import EngageFirestore, { engageFirestore } from "./firestore";
import EngageDoc from "./doc";
import { EngageAnalytics } from "./analytics";
import { EngageAlgolia } from "./algolia";
import EngageImage from "./image";


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
    // EngageModel,
    // adminModel,
    EngageAlgolia,
    EngageImage,
    EngageAnalytics,
    // // Interfaces // //
    // IEngageFirebase,
    // IEngageFirebaseObject,
    // IEngageImage,
    // IEngageFirebaseCollection,
    // IEngageFirebaseDoc,
    // IEngageModel,
    // IEngageTriggerData,
}