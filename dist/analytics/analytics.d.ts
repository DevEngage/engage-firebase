import { IEngageAnalytic, AnalyticAction, IEngageAnalyticModel } from "../interfaces/analytics.interface";
export declare class EngageAnalytics {
    path: string;
    static STORE: any;
    static DOC: any;
    private collection;
    private model;
    constructor(path: string);
    private init;
    updateDestinations(models: any, data: any): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
    addDoc(model: any, doc: any): Promise<any>;
    subtractDoc(model: any, doc: any): Promise<any>;
    getAnalytics(dest: string, field?: string): any;
    applyAction(model: IEngageAnalyticModel, dataset?: string, num?: number, save?: boolean): Promise<any>;
    sumList(field: string, action?: AnalyticAction): Promise<any>;
    getTiggers(trigger: string): Promise<IEngageAnalyticModel[]>;
    getModels(trigger: any): Promise<IEngageAnalyticModel[]>;
    getModelByField(field: any): Promise<IEngageAnalyticModel[]>;
    addModel(doc: any): Promise<IEngageAnalyticModel>;
    linkFieldToCollection(model: IEngageAnalyticModel): any;
    healthCheck(model: any, dataset: any): Promise<boolean>;
    getAmount(model: IEngageAnalyticModel, relationItem: any): number;
    getDataFromSnapshot(model: any, relationItem: any): IEngageAnalytic;
    addAnalyticDoc(model: IEngageAnalyticModel, relationItem: any): Promise<any>;
    removeAnalyticDoc(model: IEngageAnalyticModel, doc: any): Promise<any>;
    sync(field: any): Promise<void>;
    getRange(field: any, start: any, end: any): Promise<any>;
    getPathDetails(path: string): {
        collection: string;
        id: string;
        subCollection: string;
        subId: string;
        name: string;
    };
}
