export type AnalyticAction = 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum'

export interface IEngageAnalytic {
    $action?: AnalyticAction;
    $amount?: number;
    $relation?: string;
    $relationId?: string;
    $relactionField?: string;
}

export interface IEngageAnalyticModel {
    type?: 'int' | 'double';
    field?: string;
    relaction?: string;
    relactionField?: string;
    action?: AnalyticAction;
    snapeshot?: string | boolean | string[];
}