import { IEngageAnalyticModel } from '../interfaces/analytics.interface';
import { EngageAnalytics } from '../analytics/analytics';
import { IEngageTriggerData } from '../interfaces/trigger.interfaces';

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
        this.engine.triggerUpdate(this.models, data);
    }

    restore(date: number) {
        // get all docs up until date
        const engine = new EngageAnalytics(this.trigger);
    }

    async onWrite(data: IEngageTriggerData) {
        if (data && data.previousData) {
            data.action = 'update';
        } else {
            data.action = 'create';
        }
        this.updateDestinations(data);
    }

    async onCreate(data: IEngageTriggerData) {
        data.action = 'create';
        this.updateDestinations(data);
    }

    async onUpdate(data: IEngageTriggerData) {
        data.action = 'update';
        this.updateDestinations(data);
    }

    async onDelete(data: IEngageTriggerData) {
        data.action = 'remove';
        this.updateDestinations(data);
    }

}