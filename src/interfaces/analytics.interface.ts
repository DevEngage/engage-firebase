export type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum' | 'remove';
export type DateRanges = 'total' | 'yesterday' | 'today' | 'week' | 'month' | 'year' | string; // 'number-number' // month.year // year

export interface IEngageAnalytic {
    $soruceRef?: any;
    $modelRef?: any;
    $year?: number; // 2019 -> not zero based
    $month?: number; // 1 -> not zero based
    $week?: number; // 2 -> not zero based
    $day?: number; // 10 -> not zero based
    $counter?: number; // Every doc counted
}

export interface IEngageAnalyticDataset {
    $action?: AnalyticAction;
    $sourceRef?: any; // col/id/subCol/subId
    $destinationRef?: any; // col/id/subCol/subId
    $userId?: string;
    $group?: IEngageAnalyticGroup[];
    $removed?: boolean;
}

export interface IEngageAnalyticGroup {
    field: string; 
    filter?: any; // { isGuest: true, $greater__field: 100, $lesser__field: 100}, 
    action?: AnalyticAction;
    type?: 'int' | 'double'
}


export interface IEngageAnalyticModel {
    // trigger:
    trigger?: string; // source // collection/{collectionId}/
    group?: IEngageAnalyticGroup[] | string; 
    // Save to
    destination?: string; // Where to copy data for set group/{groupId}
    action?: AnalyticAction;
    allowDuplicates?: boolean; // false = onCreate; true = onWrite;
    final?: boolean; // true = can't remove
    snapeshot?: string | boolean | string[]; // fields to copy over... include fields in the group
}
