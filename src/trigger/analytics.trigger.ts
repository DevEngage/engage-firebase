import { EngageFirestore, EngageAnalytics, IEngageTriggerData } from '../functions';
import { IEngageAnalyticModel } from '../interfaces/analytics.interface';

export class EngageAnalyticsTrigger {
    static STORE;
    static DOC;
    engine: EngageAnalytics;

    constructor(
        public trigger, 
        public models?: IEngageAnalyticModel[],
    ) {
        this.engine = new EngageAnalytics(`${trigger}`);
        this.init();
    }

    private async init() {
        if (!this.models) {
            this.models = await this.engine.getModels();
        }
    }

    updateDestinations(data: IEngageTriggerData) {
        // const details = this.engine.getPathDetails(this.trigger);
        // const path = `${details.collection}/${data.id}`;
        // const engine = new EngageAnalytics(path);
        // this.engine.updateDestinations(this.triggers, data);
    }

    restore() {
        const engine = new EngageAnalytics(this.trigger);
    }

    async onWrite(data: IEngageTriggerData) {
        this.updateDestinations(data.data);
    }

    async onCreate(data: IEngageTriggerData) {
        this.updateDestinations(data.data);
    }

    async onUpdate(data: IEngageTriggerData) {
        this.updateDestinations(data.data);
    }

    async onDelete(data: IEngageTriggerData) {
        this.updateDestinations(data.data);
    }

}