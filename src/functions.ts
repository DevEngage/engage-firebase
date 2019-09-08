import EngageTrigger from "./trigger/trigger";
import { EngageAnalytics } from "./analytics/analytics";
import { AlgoliaExport } from "./algolia/algolia.export";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel, EngageFireDoc } from ".";
import EngageFirestore, { engageFirestore } from "./firestore/firestore.functions";

const firestore = engageFirestore;
const Doc = EngageFireDoc;

export default EngageTrigger;
export {
    // Backend
    firestore,
    Doc,
    EngageFirestore,
    EngageFireDoc,
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