// import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AlgoliaExport } from "../algolia/algolia.export";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
import { EngageAnalyticsTrigger } from './analytics.trigger';
import { EngageFirestore } from '../functions';

export default class EngageTrigger {
    ref: DocumentBuilder;
    algoliaExport!: AlgoliaExport;
    analyticTrigger!: EngageAnalyticsTrigger;
    exports: any;
    public pathDetails;
    
    constructor(
        public path: string, 
        // public collection: string, 
        // public collections: string[] = []
    ) {
        this.pathDetails = this.getPathDetails(path);
        this.ref = functions.firestore.document(this.path);
    }

    enableSearch() {
        this.algoliaExport = new AlgoliaExport(this.pathDetails.name, '/' + this.pathDetails.name);
        return this;
    }

    enableAnalytics(model?) {
        this.analyticTrigger = new EngageAnalyticsTrigger(this.path, model);
        return this;
    }

    bindExports(exports: any) {
        this.exports = exports;
    }

    onWrite(cb?: any, ignoreFirst = false) {
        const onWrite = this.ref.onWrite(async (change, context) => {
            if (!change.before.exists && ignoreFirst) return null;
            const id = context.params.id;
            const subId = context.params.subId;
            const data = change.after.data();
            const previousData = change.before.data();
            const triggerData = {
                data,
                previousData,
                id,
                subId,
                algoliaExport: this.algoliaExport,
                analyticTrigger: this.analyticTrigger,
            };

            if (id && 
                data && 
                (data.isApproved === undefined || data.isApproved) && 
                (data.isPublic === undefined || data.isPublic) && 
                data.info && 
                data.info.name
            ) {
                let algoliaData = {
                    ...data,
                    objectID: id,
                    $id: id,
                };
                await this.algoliaExport.once(algoliaData);
            }

            if (this.algoliaExport && id && data && (data.isPublic === undefined || data.isPublic) && data.isSearchDisabled) {
                await this.algoliaExport.remove(id);
            }

            if (this.analyticTrigger) {
                await this.analyticTrigger.onWrite(triggerData);
            }

            if (cb) {
                return await cb(triggerData);
            }
            return;
        });
        if (this.exports && this.pathDetails.name) {
            this.exports[`${this.pathDetails.name}OnWrite`] = onWrite;
            return this;
        } else {
            return onWrite;
        }
    }

    onDelete(cb?: any) {
        const onDelete = this.ref.onDelete(async (snap, context) => {
            const data = snap.data();
            const id = context.params.id;
            const triggerData = {
                data,
                id,
                algoliaExport: this.algoliaExport,
                analyticTrigger: this.analyticTrigger,
            };
            if (cb) {
                await cb(triggerData);
            }

            if (this.analyticTrigger) {
                await this.analyticTrigger.onDelete(triggerData);
            }

            if (this.algoliaExport) {
                await this.algoliaExport.remove(id);
            }
            return 'done';
        });
        if (this.exports && this.pathDetails.name) {
            this.exports[`${this.pathDetails.name}OnDelete`] = onDelete;
            return this;
        } else {
            return onDelete;
        }
    }

    onCreate(cb?: any) {
        const onCreate = this.ref.onCreate(async (snap, context) => {
            const id = context.params.id;
            const subId = context.params.subId;
            const data = snap.data();
            const triggerData = {
                data,
                id,
                subId,
                algoliaExport: this.algoliaExport,
                analyticTrigger: this.analyticTrigger,
            };

            if (this.analyticTrigger) {
                await this.analyticTrigger.onCreate(triggerData);
            }

            if (cb) {
                return await cb(triggerData);
            }
            return;

        });

        if (this.exports && this.pathDetails.name) {
            this.exports[`${this.pathDetails.name}OnCreate`] = onCreate;
            return this;
        } else {
            return onCreate;
        }
    }

    onUpdate(cb?: any) {
        const onUpdate = this.ref.onUpdate(async (change, context) => {
            const id = context.params.id;
            const subId = context.params.subId;
            const data = change.after.data();
            const previousData = change.before.data();
            const triggerData = {
                data,
                previousData,
                id,
                subId,
                algoliaExport: this.algoliaExport,
                analyticTrigger: this.analyticTrigger,
            };

            if (this.analyticTrigger) {
                await this.analyticTrigger.onUpdate(triggerData);
            }

            if (cb) {
                return await cb(triggerData);
            }
            return;
        });

        if (this.exports && this.pathDetails.name) {
            this.exports[`${this.pathDetails.name}OnUpdate`] = onUpdate;
            return this;
        } else {
            return onUpdate;
        }
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

    // cleanUp() {
    //     const algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);
    //     let db = admin.firestore();
    //     let docRef = db.collection(this.collection);
    //     algoliaExport.remove(id);
    // }
}