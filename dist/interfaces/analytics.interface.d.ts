export declare type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum';
export declare type DateRanges = 'now' | 'yesterday' | 'today' | 'week' | 'month' | 'year' | string;
export interface IEngageAnalytic {
    $action?: AnalyticAction;
    $amount?: number;
    $source?: string;
    $destination?: string;
    $field?: string;
    $userId?: string;
}
export interface IEngageAnalyticModel {
    trigger?: string;
    source?: string;
    validation?: any[];
    destination?: string;
    field?: string;
    amountField?: string;
    type?: 'int' | 'double';
    action?: AnalyticAction;
    allowDuplicates?: boolean;
    snapeshot?: string | boolean | string[];
    range?: DateRanges[];
    group?: 'all' | 'user' | string;
}
