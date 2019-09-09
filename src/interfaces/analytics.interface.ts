export type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum';
export type DateRanges = number | 'now' | 'yesterday' | 'today' | 'week' | 'month' | 'year' | string; // 'number-number' // month.year // year

export interface IEngageAnalytic {
    $action?: AnalyticAction;
    $amount?: number;
    $relation?: string;
    $relationId?: string;
    $relactionField?: string;
    $userId?: string;
}

export interface IEngageAnalyticModel {
    type?: 'int' | 'double';
    field?: string;
    relaction?: string;
    relactionField?: string;
    action?: AnalyticAction;
    allowDuplicates?: boolean;
    relationship?: 'all' | 'user' | string; // collection based id // group -> id replaces user
    snapeshot?: string | boolean | string[];
    range?: DateRanges[];
}

export interface IEngageAnalyticQuery {
    fields: string[]; // '!field' is !=
}