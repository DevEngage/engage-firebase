import { IEngageAnalytic } from "../interfaces/analytics.interface";

export class EngageAnalytics {
    collection: any;

    constructor(public path: string, public data?: IEngageAnalytic[]) {
        //path: $analytics/watchingValues
    }

    setModel(data: IEngageAnalytic[]) {
        this.data = data;
        return this;
    }

    setCollection(storeClass) {
        this.collection = storeClass(this.path);
    }

    linkFieldToCollection(field: IEngageAnalytic, storeClass) {
        this.collection = storeClass(`$analytics/${field.analyticId}`);
        // TODO: collection($analytics/watchingValues)
        //  { values }
        // TODO: collection($analytics/watchingValues/relations)

    }

    healthCheck() {

    }


    
}