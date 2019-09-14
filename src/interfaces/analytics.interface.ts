export type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum';
export type DateRanges = 'now' | 'yesterday' | 'today' | 'week' | 'month' | 'year' | string; // 'number-number' // month.year // year

export interface IEngageAnalytic {
    $action?: AnalyticAction;
    $amount?: number;
    $source?: string; // col/id/subCol/subId
    $destination?: string; // col/id/subCol/subId
    $field?: string;
    $userId?: string;
}

export interface IEngageAnalyticModel {
    // trigger:
    trigger?: string; // source // collection/{id}/
    source?: string; // source // collection/{userId | otherId | all}
    validation?: any[]; 
    group?: any[]; 
    
    // Save to
    destination?: string; // Where to copy data for set
    field?: string; // dataset field (owner)
    amountField?: string; // Amount to copy to dataset
    type?: 'int' | 'double'; // how to save
    action?: AnalyticAction;
    allowDuplicates?: boolean;
    snapeshot?: string | boolean | string[];
    range?: DateRanges[]; // Creates a new doc for each item
}
