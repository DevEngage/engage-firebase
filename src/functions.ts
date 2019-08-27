import EngageTrigger from "./trigger/trigger";
import { EngageAnalytics } from "./analytics/analytics";
import { AlgoliaExport } from "./algolia/algolia.export";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel } from ".";

export default EngageTrigger;
export {
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