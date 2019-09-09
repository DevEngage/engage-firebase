import EngageTrigger from "./trigger/trigger";
import { EngageAnalytics } from "./analytics/analytics";
import { AlgoliaExport } from "./algolia/algolia.export";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel, EngageFireDoc } from ".";
import EngageFirestore, { engageFirestore } from "./firestore/firestore.functions";

EngageAnalytics.DOC = EngageFireDoc;
EngageAnalytics.STORE = EngageFirestore;

const firestore = engageFirestore;
const Doc = EngageFireDoc;

interface IEngageTriggerData {
    data?: any;
    previousData?: any;
    id?: string;
    subId?: string;
    algoliaExport?: any;
    analyticTrigger?: any;
}

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
    IEngageTriggerData,
}