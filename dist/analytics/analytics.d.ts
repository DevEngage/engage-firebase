import { AnalyticAction, IEngageAnalyticModel } from "../interfaces/analytics.interface";
export declare class EngageAnalytics {
    path: string;
    static STORE: any;
    static DOC: any;
    private collection;
    private doc;
    private model;
    constructor(path: string);
    private init;
    add(field: any, num?: number): Promise<void>;
    subtract(field: any, num?: number): Promise<void>;
    action(action: AnalyticAction, field: string, num?: number, save?: boolean): Promise<any>;
    sumList(field: string, action?: AnalyticAction): Promise<any>;
    saveModelField(doc: any): this;
    getModel(field: any): Promise<IEngageAnalyticModel[]>;
    linkFieldToCollection(model: IEngageAnalyticModel): void;
    healthCheck(field: any): Promise<boolean>;
    fix(field: any): Promise<void>;
    getRelationAmount(model: any, relationItem: any): number;
    addRelationDoc(model: IEngageAnalyticModel, relationItem: any): Promise<any>;
    sync(field: any): Promise<any>;
}
