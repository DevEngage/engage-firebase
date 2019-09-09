import EngageTrigger from "./trigger/trigger";
import { EngageAnalytics } from "./analytics/analytics";
import { AlgoliaExport } from "./algolia/algolia.export";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel, EngageFireDoc } from ".";
import EngageFirestore from "./firestore/firestore.functions";
declare const firestore: (path: string, options?: any) => any;
declare const Doc: typeof EngageFireDoc;
interface IEngageTriggerData {
    data?: any;
    previousData?: any;
    id?: string;
    subId?: string;
    algoliaExport?: any;
    analyticTrigger?: any;
}
export default EngageTrigger;
export { firestore, Doc, EngageFirestore, EngageFireDoc, EngageTrigger, EngageAnalytics, AlgoliaExport, IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel, IEngageTriggerData, };
