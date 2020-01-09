import { IEngageAnalyticModel, IEngageAnalyticGroup, DateRanges } from "../interfaces/analytics.interface";
import { IEngageTriggerData } from "../interfaces/trigger.interfaces";
export declare class EngageAnalytics {
    path: string;
    static STORE: any;
    static DOC: any;
    static ANALYTICS_PATH: string;
    static DATASET_PATH: string;
    static CREATEDAT_NAME: string;
    debug: boolean;
    constructor(path: string);
    triggerUpdate(models: any, triggerData: IEngageTriggerData): Promise<void>;
    enableDebug(): this;
    report(title: any, value: any): void;
    addDoc(model: any, doc: any): Promise<any>;
    subtractDoc(model: any, doc: any): Promise<void>;
    getAnalytics(dest: string): any;
    getDataset(dest: string): any;
    applyAction(doc: any, data: any, group: IEngageAnalyticGroup): any;
    getModelRef(): any;
    getModels(): Promise<IEngageAnalyticModel[]>;
    getModelByField(field: any): Promise<IEngageAnalyticModel[]>;
    addModel(doc: any): Promise<IEngageAnalyticModel>;
    static getDates(data: any): {
        $year: number;
        $month: number;
        $week: number;
        $day: number;
    };
    groupValid(data: any, group: IEngageAnalyticGroup): boolean;
    getGroup(doc: {}, triggerData: IEngageTriggerData, model: IEngageAnalyticModel): {};
    static getGroupFields(group: IEngageAnalyticGroup[] | string): any[];
    static getDataFromSnapshot(model: IEngageAnalyticModel, triggerData: IEngageTriggerData, analyticData: any): {};
    static buildDatasetDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData, analyticData: any): Promise<{
        $action: "update" | "write" | "remove" | "create";
        $sourceRef: string;
        $destinationRef: any;
        $userId: any;
        $trigger: any;
        $removed: boolean;
        $group?: IEngageAnalyticGroup[];
    }>;
    addAnalyticDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData): Promise<any>;
    removeAnalyticDoc(model: IEngageAnalyticModel, data: IEngageTriggerData): Promise<void>;
    getAnalytic(docRef: string, dateRange: DateRanges): Promise<void>;
    static getPathDetails(path: string): {
        collection: string;
        id: string;
        subCollection: string;
        subId: string;
        name: string;
    };
    static addRelationToDoc(doc: any, relation: string, relationId: string): string;
    static getDocRelations(doc: any): string[];
    static getGroupIdName(field: string): string;
    static triggerParser(trigger?: string): {
        collection: string;
        id: string;
        idField: string;
        subCollection: string;
        subId: string;
        subIdField: string;
    };
    static createSourceRef(triggerData: IEngageTriggerData, ref?: boolean): any[];
    static createDestinationRef(triggerData: IEngageTriggerData, model: IEngageAnalyticModel, ref?: boolean): Promise<any>;
    static restore(models: any, triggerData: IEngageTriggerData, startDate: number | string): Promise<void>;
}
