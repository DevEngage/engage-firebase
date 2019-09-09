import { EngageFirestore, EngageAnalytics } from '../functions';

export class EngageAnalyticsTrigger {
    collection
    engine;

    constructor(public path, public model?) {
        this.engine = new EngageAnalytics(`$${path}`);
        // this.init(path);
    }

    private async init(path) {
    }

    sync(trigger: 'add ' | 'remove' | 'modify', ) {
        // trigger type: add, remove, modify
        // how much: all, user, collection (id unique)


    }

    onWrite() {

    }

    onCreate() {
        
    }

    onUpdate() {

    }

    onDelete() {

    }

}