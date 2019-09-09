import { EngageFirestore, EngageAnalytics } from '../functions';

export class EngageAnalyticsTrigger {
    engine: EngageAnalytics;

    constructor(public path, public model?) {
        this.engine = new EngageAnalytics(`$${path}`);
        this.init();
    }

    private async init() {
        this.engine.getModels();
    }

    sync(trigger: 'add ' | 'remove' | 'modify', ) {
        // trigger type: add, remove, modify
        // how much: all, user, collection (id unique)


    }

    async onWrite(triggerData) {
        const engine = new EngageAnalytics(`${this.path}`, triggerData.id);
        engine.addDoc(this.model, triggerData.data);
    }

    onCreate(triggerData) {
        
    }

    onUpdate(triggerData) {

    }

    onDelete(triggerData) {

    }

}