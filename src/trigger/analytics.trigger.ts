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
        return this.engine.triggerUpdate(this.models, data);
    }

    restore(date: number | string, triggerData) {
        // get all docs up until date
        const engine = EngageAnalytics.restore(this.models, triggerData, date);
    }

    async onWrite(data: IEngageTriggerData) {
        if (data && data.previousData) {
            data.action = 'update';
        } else {
            data.action = 'create';
        }
        return await this.updateDestinations(data);
    }

    async onCreate(data: IEngageTriggerData) {
        data.action = 'create';
        return await this.updateDestinations(data);
    }

    async onUpdate(data: IEngageTriggerData) {
        data.action = 'update';
        return await this.updateDestinations(data);
    }

    async onDelete(data: IEngageTriggerData) {
        data.action = 'remove';
        return await this.updateDestinations(data);
    }

}