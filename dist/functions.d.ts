import EngageTrigger from "./trigger/trigger";
import { EngageAnalytics } from "./analytics/analytics";
import { AlgoliaExport } from "./algolia/algolia.export";
import { EngageDoc } from "./v2";
import EngageFirestore from "./firestore/firestore.functions";
import { EngageAnalyticsTrigger } from "./trigger/analytics.trigger";
import { IEngageTriggerData } from "./interfaces/trigger.interfaces";
declare const firestore: (path: string, options?: any) => any;
declare const Doc: typeof EngageDoc;
export default EngageTrigger;
export { firestore, Doc, EngageFirestore, EngageDoc, EngageTrigger, EngageAnalytics, AlgoliaExport, EngageAnalyticsTrigger, IEngageTriggerData, };
