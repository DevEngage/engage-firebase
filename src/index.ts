import EngageFirestore, { engageFirestore } from "./firestore/firestore";
import EngageFireDoc from "./doc/doc";
import EngageModel, { IEngageModel } from "./model/model";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc } from "./interfaces/firebase.interface";
import { EngageAlgolia } from "./algolia/algolia";
import { EngageImage } from "./image/image";
import { adminModel } from "./models/admin.model";
import { EngageAnalytics } from "./analytics/analytics";
import { IEngageTriggerData } from "./interfaces/trigger.interfaces";

EngageAnalytics.DOC = EngageFireDoc;
EngageAnalytics.STORE = EngageFirestore;

EngageFireDoc.STORE = EngageFirestore;

const firestore = engageFirestore;
const Doc = EngageFireDoc;

export default engageFirestore;
export {
    // Frontend
    firestore,
    EngageFirestore,
    Doc,
    EngageFireDoc,
    EngageModel,
    EngageAlgolia,
    EngageImage,
    adminModel,
    EngageAnalytics,
    // Interfaces
    IEngageFirebase,
    IEngageFirebaseObject,
    IEngageImage,
    IEngageFirebaseCollection,
    IEngageFirebaseDoc,
    IEngageModel,
    IEngageTriggerData,
}