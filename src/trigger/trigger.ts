// import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AlgoliaExport } from "../algolia/algolia.export";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
import { EngageAnalyticsTrigger } from './analytics.trigger';
import { EngageFirestore } from '../functions';

export default class EngageTrigger {
    ref: DocumentBuilder;
    algoliaExport: AlgoliaExport;
    analyticTrigger: EngageAnalyticsTrigger;
    
    constructor(
        public path: string, 
        public collection: string, 
        public collections: string[] = []
    ) {
        this.ref = functions.firestore.document(this.path);
    }

    enableSearch() {
        this.algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);
        return this;
    }

    enableAnalytics(model?) {
        this.analyticTrigger = new EngageAnalyticsTrigger(this.path, model);
        return this;
    }

    onWrite(cb?: any) {
        return this.ref.onWrite(async (change, context) => {
            if (!change.before.exists) return null;
            const id = context.params.id;
            const subId = context.params.subId;
            const data = change.after.data();
            const previousData = change.before.data();

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
                this.analyticTrigger.onWrite();
            }

            if (cb) {
                return await cb({
                    data,
                    previousData,
                    id,
                    subId,
                    algoliaExport: this.algoliaExport,
                });
            }
            return;
        });
    }

    onDelete(cb?: any) {
        return this.ref.onDelete(async (snap, context) => {
            const data = snap.data();
            const id = context.params.id;
            if (cb) {
                await cb({
                    data,
                    id,
                    algoliaExport: this.algoliaExport,
                });
            }

            if (this.analyticTrigger) {
                this.analyticTrigger.onDelete();
            }

            if (this.algoliaExport) this.algoliaExport.remove(id);
            return 'done';
        });
    }

    onCreate() {

    }

    onUpdate() {

    }

    // cleanUp() {
    //     const algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);
    //     let db = admin.firestore();
    //     let docRef = db.collection(this.collection);
    //     algoliaExport.remove(id);
    // }
}