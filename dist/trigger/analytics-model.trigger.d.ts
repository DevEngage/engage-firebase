import { EngageAnalytics, IEngageTriggerData } from '../functions';
import { IEngageAnalyticModel } from '../interfaces/analytics.interface';
export declare class EngageAnalyticsTrigger {
    path: any;
    triggers?: IEngageAnalyticModel[];
    engine: EngageAnalytics;
    constructor(path: any, triggers?: IEngageAnalyticModel[]);
    private init;
    updateDestinations(data: IEngageTriggerData): void;
    onWrite(data: IEngageTriggerData): Promise<void>;
    onCreate(data: IEngageTriggerData): Promise<void>;
    onUpdate(data: IEngageTriggerData): Promise<void>;
    onDelete(data: IEngageTriggerData): Promise<void>;
    getPathDetails(path: string): {
        collection: string;
        id: string;
        subCollection: string;
        subId: string;
        name: string;
        trigger: string;
    };
}
