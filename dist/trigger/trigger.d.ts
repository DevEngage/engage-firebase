import { AlgoliaExport } from "../algolia/algolia.export";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
import { EngageAnalyticsTrigger } from './analytics.trigger';
export default class EngageTrigger {
    path: string;
    ref: DocumentBuilder;
    algoliaExport: AlgoliaExport;
    analyticTrigger: EngageAnalyticsTrigger;
    relations: any[];
    exports: any;
    pathDetails: any;
    constructor(path: string);
    enableSearch(): this;
    enableAnalytics(models?: any, restore?: number): this;
    addRelations(relations: any): this;
    bindExports(exports: any): this;
    onWrite(cb?: any, ignoreFirst?: boolean): this;
    onDelete(cb?: any): this;
    onCreate(cb?: any): this;
    onUpdate(cb?: any): this;
}
