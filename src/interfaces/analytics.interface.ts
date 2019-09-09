export type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum';
export type DateRanges = number | 'now' | 'yesterday' | 'today' | 'week' | 'month' | 'year' | string; // 'number-number' // month.year // year

export interface IEngageAnalytic {
    $action?: AnalyticAction;
    $amount?: number;
    $source?: string;
    $sourceId?: string;
    $relation?: string;
    $relationId?: string;
    $relactionField?: string;
    $userId?: string;
}

export interface IEngageAnalyticModel {
    type?: 'int' | 'double';
    field?: string;
    source?: string; // source // collection/{userId | otherId | all}
    relaction?: string; // dest.
    relactionField?: string;
    action?: AnalyticAction;
    allowDuplicates?: boolean;
    reverse?: boolean;
    group?: 'all' | 'user' | string; // collection based id // group -> id replaces user // collectionFieldId name
    snapeshot?: string | boolean | string[];
    range?: DateRanges[];
}

export interface IEngageAnalyticQuery {
    fields: string[]; // '!field' is !=
}