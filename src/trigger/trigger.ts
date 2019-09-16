import * as functions from 'firebase-functions';
import { AlgoliaExport } from "../algolia/algolia.export";
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
import { EngageAnalyticsTrigger } from './analytics.trigger';
import { IEngageTriggerData, EngageAnalytics } from '../functions';

export default class EngageTrigger {
    ref: DocumentBuilder;
    algoliaExport!: AlgoliaExport;
    analyticTrigger!: EngageAnalyticsTrigger;
    relations = [];
    exports: any;
    public pathDetails;
    
    constructor(
        public path: string, 
        // public collection: string, 
        // public collections: string[] = []
    ) {
        this.pathDetails = EngageAnalytics.getPathDetails(path);
        this.ref = functions.firestore.document(this.path);
    }

    enableSearch() {
        this.algoliaExport = new AlgoliaExport(this.pathDetails.name, '/' + this.pathDetails.name);
        return this;
    }

    enableAnalytics(models?, restore?: number) {
        this.analyticTrigger = new EngageAnalyticsTrigger(this.path, models);
        this.analyticTrigger.restore(restore, EngageTrigger.buildTriggerData({data: {}}, {}, this.path));
        return this;
    }

    addRelations(relations) {
        this.relations = relations;
        return this;
    }

    bindExports(exports: any) {
        this.exports = exports;
        return this;
    }

    static getTriggerCollections(path) {
        return (path || '').split('/').filter((item, index) => index % 2 === 0);
    }

    static buildTriggerData(change, context, path: string) {
        const data = change.after.data();
        const previousData = change.before.data();
        const [collection, subCollection] = EngageTrigger.getTriggerCollections(path);
        const triggerData: IEngageTriggerData = {
            ...context.params,
            data,
            previousData,
            collection,
            subCollection,
            trigger: path,
            source: '',
            sourceParent: '',
        };
        const [source, sourceParent] = EngageAnalytics.createSourceRef(triggerData);
        triggerData.source = source;
        triggerData.sourceParent = sourceParent;
        const pathSplit = (source || '').split('/');
        triggerData.id = pathSplit[1];
        triggerData.subId = pathSplit[3];
        console.log('triggerData', triggerData);
        return triggerData;
    }

    onWrite(cb?: any, ignoreFirst = false) {
        const onWrite = this.ref.onWrite(async (change, context) => {
            if (!change.before.exists && ignoreFirst) return null;
            const id = context.params.id;
            const data = change.after.data();
            const triggerData: IEngageTriggerData = EngageTrigger.buildTriggerData(change, context, this.path);
            triggerData.algoliaExport = this.algoliaExport;
            triggerData.analyticTrigger = this.analyticTrigger;

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
        }
        return this;
    }

    onDelete(cb?: any) {
        const onDelete = this.ref.onDelete(async (snap, context) => {
            const id = context.params.id;
            const triggerData: IEngageTriggerData = EngageTrigger.buildTriggerData(snap, context, this.path);
            triggerData.algoliaExport = this.algoliaExport;
            triggerData.analyticTrigger = this.analyticTrigger;

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
        }
        return this;
    }

    onCreate(cb?: any) {
        const onCreate = this.ref.onCreate(async (snap, context) => {
            const triggerData: IEngageTriggerData = EngageTrigger.buildTriggerData(snap, context, this.path);
            triggerData.algoliaExport = this.algoliaExport;
            triggerData.analyticTrigger = this.analyticTrigger;

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
        }
        return this;
    }

    onUpdate(cb?: any) {
        const onUpdate = this.ref.onUpdate(async (change, context) => {
            const triggerData: IEngageTriggerData = EngageTrigger.buildTriggerData(change, context, this.path);
            triggerData.algoliaExport = this.algoliaExport;
            triggerData.analyticTrigger = this.analyticTrigger;

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
        }
        return this;
    }

    // cleanUp() {
    //     const algoliaExport = new AlgoliaExport(this.collection, '/' + this.collection);
    //     let db = admin.firestore();
    //     let docRef = db.collection(this.collection);
    //     algoliaExport.remove(id);
    // }
}