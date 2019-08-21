// import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AlgoliaExport } from "../utilities/algolia";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';

export default class Trigger {
    ref: DocumentBuilder;
    searchEnabled = false;
    
    constructor(public path: string, public collection: string, public collections: string[] = []) {
        this.ref = functions.firestore.document(this.path);
    }

    enableSearch() {
        this.searchEnabled = true;
        return this;
    }

    onWrite(cb?: any) {
        return this.ref.onWrite(async (change, context) => {
            if (!change.before.exists) return null;
            const id = context.params.id;
            const subId = context.params.subId;
            const data = change.after.data();
            const previousData = change.before.data();
            const algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);

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
                await algoliaExport.once(algoliaData);
            }

            if (this.searchEnabled && id && data && (data.isPublic === undefined || data.isPublic) && data.isSearchDisabled) {
                algoliaExport.remove(id);
            }

            if (cb) {
                return await cb({
                    data,
                    previousData,
                    id,
                    subId,
                    algoliaExport,
                });
            }
            return;
        });
    }

    onDelete(cb?: any) {
        return this.ref.onDelete(async (snap, context) => {
            const data = snap.data();
            const id = context.params.id;
            const algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);
            if (cb) {
                await cb({
                    data,
                    id,
                    algoliaExport,
                });
            }

            if (this.searchEnabled) algoliaExport.remove(id);
            return 'done';
        });
    }

    // cleanUp() {
    //     const algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);
    //     let db = admin.firestore();
    //     let docRef = db.collection(this.collection);
    //     algoliaExport.remove(id);
    // }
}