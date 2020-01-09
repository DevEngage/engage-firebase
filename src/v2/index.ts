import EngageFirestore, { engageFirestore } from "./firestore";
import EngageDoc from "./doc";
import { EngageAnalytics } from "./analytics";
import { EngageAlgolia } from "./algolia";
import EngageImage from "./image";
import EngageAuth from "./auth";
import EngageFile from "./file";


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