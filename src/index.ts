import EngageFirestore, { engageFirestore } from "./firestore/firestore";
import EngageFireDoc from "./doc/doc";
import EngageTrigger from "./trigger/trigger";
import EngageModel, { IEngageModel } from "./model/model";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc } from "./interfaces/firebase.interface";
import { EngageAnalytics } from "./analytics/analytics";
import { EngageAlgolia } from "./algolia/algolia";
import { AlgoliaExport } from "./algolia/algolia.export";
import { EngageImage } from "./image/image";
import { adminModel } from "./models/admin.model";

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
    // Backend
    EngageTrigger,
    EngageAnalytics,
    AlgoliaExport,
    // Interfaces
    IEngageFirebase,
    IEngageFirebaseObject,
    IEngageImage,
    IEngageFirebaseCollection,
    IEngageFirebaseDoc,
    IEngageModel,
}