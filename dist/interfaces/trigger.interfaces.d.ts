export interface IEngageTriggerData {
    data?: any;
    previousData?: any;
    id?: string;
    subCollection?: string;
    subId?: string;
    source?: string;
    relations?: string[];
    algoliaExport?: any;
    trigger?: any;
    analyticTrigger?: any;
    userId?: any;
    action?: 'write' | 'create' | 'update' | 'remove';
}
