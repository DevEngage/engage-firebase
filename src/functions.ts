import EngageTrigger from "./trigger/trigger";
import { EngageAnalytics } from "./analytics/analytics";
import { AlgoliaExport } from "./algolia/algolia.export";
import {  EngageDoc } from "./v2";
// IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel,
import EngageFirestore, { engageFirestore } from "./firestore/firestore.functions";
import { EngageAnalyticsTrigger } from "./trigger/analytics.trigger";
import { IEngageTriggerData } from "./interfaces/trigger.interfaces";

EngageAnalytics.DOC = EngageDoc;
EngageAnalytics.STORE = EngageFirestore;
EngageAnalyticsTrigger.STORE = EngageFirestore;
EngageAnalyticsTrigger.DOC = EngageDoc;

const firestore = engageFirestore;
const Doc = EngageDoc;



export default EngageTrigger;
export {
    // Backend
    firestore,
    Doc,
    EngageFirestore,
    EngageDoc,
    EngageTrigger,
    EngageAnalytics,
    AlgoliaExport,
    EngageAnalyticsTrigger,
    // Interfaces
    // IEngageFirebase,
    // IEngageFirebaseObject,
    // IEngageImage,
    // IEngageFirebaseCollection,
    // IEngageFirebaseDoc,
    // IEngageModel,
    IEngageTriggerData,
}