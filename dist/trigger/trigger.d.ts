import * as functions from 'firebase-functions';
import { AlgoliaExport } from "../algolia/algolia.export";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
import { EngageAnalyticsTrigger } from './analytics.trigger';
export default class EngageTrigger {
    path: string;
    ref: DocumentBuilder;
    algoliaExport: AlgoliaExport;
    analyticTrigger: EngageAnalyticsTrigger;
    exports: any;
    pathDetails: any;
    constructor(path: string);
    enableSearch(): this;
    enableAnalytics(model?: any): this;
    bindExports(exports: any): this;
    onWrite(cb?: any, ignoreFirst?: boolean): functions.CloudFunction<functions.Change<FirebaseFirestore.DocumentSnapshot>> | this;
    onDelete(cb?: any): functions.CloudFunction<FirebaseFirestore.DocumentSnapshot> | this;
    onCreate(cb?: any): functions.CloudFunction<FirebaseFirestore.DocumentSnapshot> | this;
    onUpdate(cb?: any): functions.CloudFunction<functions.Change<FirebaseFirestore.DocumentSnapshot>> | this;
    getPathDetails(path: string): {
        collection: string;
        id: string;
        subCollection: string;
        subId: string;
        name: string;
        trigger: string;
    };
}
