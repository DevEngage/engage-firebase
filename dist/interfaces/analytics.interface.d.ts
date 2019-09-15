export declare type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum' | 'remove';
export declare type DateRanges = 'total' | 'yesterday' | 'today' | 'week' | 'month' | 'year' | string;
export interface IEngageAnalytic {
    $soruceRef?: any;
    $modelRef?: any;
    $year?: number;
    $month?: number;
    $week?: number;
    $day?: number;
    $counter?: number;
}
export interface IEngageAnalyticDataset {
    $action?: AnalyticAction;
    $sourceRef?: any;
    $destinationRef?: any;
    $userId?: string;
    $group?: IEngageAnalyticGroup[];
    $removed?: boolean;
}
export interface IEngageAnalyticGroup {
    field: string;
    filter?: any;
    action?: AnalyticAction;
    type?: 'int' | 'double';
}
export interface IEngageAnalyticModel {
    trigger?: string;
    group?: IEngageAnalyticGroup[] | string;
    destination?: string;
    action?: AnalyticAction;
    allowDuplicates?: boolean;
    final?: boolean;
    snapeshot?: string | boolean | string[];
}
