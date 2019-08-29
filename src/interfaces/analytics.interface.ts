export interface IEngageAnalyticGraph {
    analyticId?: string;
    graph?: string;
    // save doc to sub collection with { name: true, etc.. }
    data?: any;
}

export interface IEngageAnalytic {
    // Field in collection that will be recorded
    field?: string;
    // collection to add field to 
    analyticId?: string;
    // $analytics doc model
    action?: 'add' | 'minus' | 'multiply' | 'divide' | 'set' | 'sum';
}