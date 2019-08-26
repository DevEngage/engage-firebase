import { engageFirestore } from "./firestore/firestore";
import EngageFireDoc from "./doc/doc";
import EngageTrigger from "./trigger/trigger";
import EngageModel from "./model/model";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc } from "./interfaces/firebase.interface";
import { EngageAnalytics } from "./analytics/analytics";
import { EngageAlgolia } from "./algolia/algolia";
import { AlgoliaExport } from "./algolia/algolia.export";
import { EngageImage } from "./image/image";


export default engageFirestore;
export {
    // Frontend
    EngageFireDoc,
    EngageModel,
    EngageAlgolia,
    EngageImage,
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
}