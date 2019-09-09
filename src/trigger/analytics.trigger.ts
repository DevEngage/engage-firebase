import { EngageFirestore } from '../functions';

export class EngageAnalyticsTrigger {
    collection

    constructor(public path, public model?) {
        // this.init(path);
    }

    private async init(path) {
    }

    sync(trigger: 'add ' | 'remove' | 'modify', ) {
        // trigger type: add, remove, modify
        // how much: all, user, collection (id unique)


    }

}