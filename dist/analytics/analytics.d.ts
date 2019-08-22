export interface IEngageAnalyticGraph {
    collection?: string;
    data?: any;
}
export interface IEngageAnalytic {
    field?: string;
    collection?: string;
    graphCollection?: any;
    analyticDoc?: string;
    action?: 'add' | 'minus' | 'multiply' | 'divide' | 'set';
}
export declare class EngageAnalytics {
    path: string;
    data: IEngageAnalytic[];
    constructor(path: string, data: IEngageAnalytic[]);
    linkFieldToCollection(field: IEngageAnalytic): void;
    healthCheck(): void;
}
