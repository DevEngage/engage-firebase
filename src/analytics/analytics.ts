
export interface IEngageAnalyticGraph {
    collection?: string;
    data?: any;
}

export interface IEngageAnalytic {
    field?: string;
    collection?: string;
    graphCollection?: any; // name, etc..
    analyticDoc?: string;
    action?: 'add' | 'minus' | 'multiply' | 'divide' | 'set';
}

export class EngageAnalytics {

    constructor(public path: string, public data: IEngageAnalytic[]) {
        //path: $analytics/watchingValues
    }

    linkFieldToCollection(field: IEngageAnalytic) {
        // TODO: collection($analytics/watchingValues)
        //  { values }
        // TODO: collection($analytics/watchingValues/relations)
    }

    healthCheck() {

    }


    
}