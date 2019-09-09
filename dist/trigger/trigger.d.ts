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
    onWrite(cb?: any, ignoreFirst?: boolean): this;
    onDelete(cb?: any): this;
    onCreate(cb?: any): this;
    onUpdate(cb?: any): this;
    getPathDetails(path: string): {
        collection: string;
        id: string;
        subCollection: string;
        subId: string;
        name: string;
        trigger: string;
    };
}
