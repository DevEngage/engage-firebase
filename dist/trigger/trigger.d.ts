import { AlgoliaExport } from "../algolia/algolia.export";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
import { EngageAnalyticsTrigger } from './analytics.trigger';
import { IEngageTriggerData } from '../functions';
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
    static getTriggerCollections(path: any): any;
    static buildTriggerData(change: any, context: any, path: string): IEngageTriggerData;
    onWrite(cb?: any, ignoreFirst?: boolean): this;
    onDelete(cb?: any): this;
    onCreate(cb?: any): this;
    onUpdate(cb?: any): this;
}
