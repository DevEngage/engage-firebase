import { EngageFirestore, EngageAnalytics, IEngageTriggerData } from '../functions';
import { IEngageAnalyticModel } from '../interfaces/analytics.interface';

export class EngageAnalyticsTriggerOld {
    engine: EngageAnalytics;

    constructor(
        public path, 
        public triggers?: IEngageAnalyticModel[],
    ) {
        this.engine = new EngageAnalytics(`$${path}`);
        this.init();
    }

    private async init() {
        if (!this.triggers) {
            this.triggers = await this.engine.getTiggers(this.path);
        }
    }

    updateDestinations(data: IEngageTriggerData) {
        const details = this.getPathDetails(this.path)
        const path = `${details.collection}/${data.id}`;
        const engine = new EngageAnalytics(path);
        engine.updateDestinations(this.triggers, data);
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

    getPathDetails(path: string) {
        const [collection, id, subCollection, subId] = path.split('/');
        return {
            collection,
            id,
            subCollection,
            subId,
            name: `${collection}${(subCollection || '').toUpperCase()}`,
            trigger: path,
        };
    }

}