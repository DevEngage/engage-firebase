import { IEngageAnalyticModel } from '../interfaces/analytics.interface';
import { EngageAnalytics } from '../analytics/analytics';
import { IEngageTriggerData } from '../interfaces/trigger.interfaces';
export declare class EngageAnalyticsTrigger {
    trigger: any;
    models?: IEngageAnalyticModel[];
    static STORE: any;
    static DOC: any;
    engine: EngageAnalytics;
    constructor(trigger: any, models?: IEngageAnalyticModel[]);
    private init;
    updateDestinations(data: IEngageTriggerData): Promise<void>;
    restore(date: number | string, triggerData: any): void;
    onWrite(data: IEngageTriggerData): Promise<void>;
    onCreate(data: IEngageTriggerData): Promise<void>;
    onUpdate(data: IEngageTriggerData): Promise<void>;
    onDelete(data: IEngageTriggerData): Promise<void>;
}
