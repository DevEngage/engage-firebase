export interface IEngageTriggerData {
    data?: any;
    params?: any;
    previousData?: any;
    id?: string;
    collection?: string;
    subCollection?: string;
    subId?: string;
    source?: string;
    sourceParent?: string;
    destination?: string;
    relations?: string[];
    algoliaExport?: any;
    trigger?: any;
    analyticTrigger?: any;
    userId?: any;
    action?: 'write' | 'create' | 'update' | 'remove';
}
