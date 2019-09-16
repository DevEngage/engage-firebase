import { IEngageAnalytic, AnalyticAction, IEngageAnalyticModel, IEngageAnalyticGroup, IEngageAnalyticDataset, DateRanges } from "../interfaces/analytics.interface";
import { IEngageTriggerData } from "../interfaces/trigger.interfaces";


/* 
    TODO:
    [ ] allow destination building to parent collection from child
*/
export class EngageAnalytics {
    static STORE;
    static DOC;
    static ANALYTICS_PATH = '$analytics';
    static DATASET_PATH = '$dataset';
    static CREATEDAT_NAME = '$createAt';
    debug = true;
    
    constructor(
        public path: string
    ) {}

    async triggerUpdate(models, triggerData: IEngageTriggerData) {
        const promises = models.map((model: IEngageAnalyticModel) => {
            if (triggerData.action === 'remove' && !model.final) {
                return this.subtractDoc(model, triggerData);
            }
            return this.addDoc(model, triggerData);
        });
        return await Promise.all(promises).then(_ => this.report('triggerUpdate finished', _));
    }

    enableDebug() {
        this.debug = true;
        return this;
    }

    report(title, value: any) {
        if (this.debug) {
            console.log(`report ${title}:`, value);
        }
    }

    addDoc(model, doc) {
        return this.addAnalyticDoc(model, doc);
    }

    subtractDoc(model, doc) {
        return this.removeAnalyticDoc(model, doc);
    }

    getAnalytics(dest: string) {
        const col = EngageAnalytics.STORE.getInstance(`${dest}/${EngageAnalytics.ANALYTICS_PATH}`);
        return col;
    }

    getDataset(dest: string) {
        return EngageAnalytics.STORE.getInstance(`${dest}/${EngageAnalytics.DATASET_PATH}`);
    }

    applyAction(doc: any, data: any, group: IEngageAnalyticGroup) {
        const dataField = data[group.fieldValue] || data[group.field];
        let num = typeof dataField === 'number' ? dataField : 1;
        if (!doc[group.field]) {
            doc[group.field] = 0;
        }
        switch (group.action) {
            case 'add':
                doc[group.field] += num;
                break;
            case 'minus':
                doc[group.field] -= num;
                break;
            case 'multiply':
                doc[group.field] *= num;
                break;
            case 'minus':
                doc[group.field] /= num;
                break;
            case 'set':
                doc[group.field] = num;
                break;
            // case 'sum':
            //     doc[group.field] = await this.sumList(group.field, group.action);
            //     break;
            default:
                doc[group.field] += num;
        }
        if (group && group.type === 'int') {
            doc[group.field] += parseInt(data[group.field]);
        }
        return doc;
    }

    getModelRef() {
        const details = EngageAnalytics.triggerParser(this.path);
        if (details.subCollection) {
            return EngageAnalytics.STORE
                .getInstance(`$collections/${details.collection}/$analyticModels/${details.subCollection}/$analyticModels`) 
        }
        return EngageAnalytics.STORE
            .getInstance(`$collections/${details.collection}/$analyticModels`)
    }

    async getModels(): Promise<IEngageAnalyticModel[]> {
        return this.getModelRef().getList();
    }

    async getModelByField(field): Promise<IEngageAnalyticModel[]> {
        const ref = this.getModelRef()
        return await ref.getList(
            ref.ref.where('field', '==', field)
        );
    }

    addModel(doc): Promise<IEngageAnalyticModel> {
        return this.getModelRef().save(doc);
    }

    static getDates(data) {
        const createdAt = new Date((data || {})[EngageAnalytics.CREATEDAT_NAME] || Date.now());
        return {
            $year: createdAt.getFullYear(),
            $month: createdAt.getMonth() + 1,
            $week: Math.floor(createdAt.getDate() / 7) + 1,
            $day: createdAt.getDate(),
        }
    }

    groupValid(data: any, group: IEngageAnalyticGroup) {
        const { filter } = group;
        if (!filter) return true;
        return Object.keys(filter || {}).reduce((prev, curr) => {
            if (!prev) {
                return prev;
            }
            if (curr.includes('$greater__')) {
                const field = curr.replace('$greater__', '');
                return data[field] > filter[curr];
            }
            if (curr.includes('$lesser__')) {
                const field = curr.replace('$lesser__', '');
                return data[field] < filter[curr];
            }
            return data[curr] === filter[curr];
        }, true);
    }

    getGroup(doc = {}, triggerData: IEngageTriggerData, model: IEngageAnalyticModel) {
        const { group } = model;
        const { data } = triggerData;
        doc['$counter'] = doc['$counter'] || 0;
        if (group && group.length && typeof group === 'object') {
            group.map((item) => {
                this.report(`groupValid (${item.field})`, {data, item, valid: this.groupValid(data, item)});
                if (this.groupValid(data, item)) {
                    this.applyAction(doc, data, item);
                }
            });
        } else if (typeof group === 'string') {
            doc[group] = data[group] || 1;
        }
        if ((triggerData.action === 'remove')) {
            doc['$counter'] -= 1;
        } else {
            doc['$counter'] += 1;
        }
        return doc;
    }

    static getGroupFields(group: IEngageAnalyticGroup[] | string) {
        let fields = [];
        if (group && group.length && typeof group === 'object') {
            fields = group.map((item) => item.field);
        } else if (typeof group === 'string') {
            fields = [group];
        }
        return fields;
    }

    static getDataFromSnapshot(model: IEngageAnalyticModel, triggerData: IEngageTriggerData, analyticData) {
        const fields = EngageAnalytics.getGroupFields(model.group);
        let fieldDoc = {};
        fields.forEach(element => {
            fieldDoc[element] = analyticData[element];
        });
        if (model.snapeshot === true) {
            fieldDoc = {
                ...fieldDoc,
                ...triggerData.data,
            };
        } else if (typeof model.snapeshot === 'string') {
            fieldDoc[model.snapeshot] = triggerData.data[model.snapeshot];
        } else if (typeof model.snapeshot === 'object' && model.snapeshot.length) {
            model.snapeshot.forEach(element => fieldDoc[element] = triggerData.data[element]);
        }
        return fieldDoc;
    }

    static async buildDatasetDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData, analyticData) {
        const fieldDoc: IEngageAnalyticDataset = EngageAnalytics.getDataFromSnapshot(model, triggerData, analyticData);
        const dest = await EngageAnalytics.createDestinationRef(triggerData, model);
        let dataset = {
            ...fieldDoc,
            $action: triggerData.action,
            $sourceRef: triggerData.source || '',
            $destinationRef: dest || '',
            $userId: triggerData.userId,
            $trigger: triggerData.trigger,
            $removed: false,
        };
        if (model.allowDuplicates) {
            delete dataset['$id'];
            delete dataset['id'];
        }
        return dataset;
    }

    async addAnalyticDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData) {
        if (!model.allowDuplicates && (triggerData.action === 'update' || triggerData.action === 'write')) {
            return null;
        }
        try {
            const dest = await EngageAnalytics.createDestinationRef(triggerData, model);
            const dates = EngageAnalytics.getDates(triggerData.data);
            const dayRef = this.getAnalytics(dest);
            const totalDoc = (await dayRef.get('total')) || { $id: 'total'};
            const dayDoc = (await dayRef.getList(
                dayRef.ref
                    .where('$year', '==', dates.$year)
                    .where('$month', '==', dates.$month)
                    .where('$week', '==', dates.$week)
                    .where('$day', '==', dates.$day)
            ) || [])[0] || { $id: `${dates.$year}_${dates.$month}_${dates.$week}_${dates.$day}`, ...dates};            

            this.getGroup(dayDoc, triggerData, model);
            this.report('getGroup (dayDoc)', dayDoc);
            await dayRef.save(dayDoc);

            this.getGroup(totalDoc, triggerData, model);
            this.report('getGroup (totalDoc)', dayDoc);
            await dayRef.save(totalDoc);

            const justDocGroup = {};
            this.getGroup(justDocGroup, triggerData, model);
            const datasetDoc = await EngageAnalytics.buildDatasetDoc(model, triggerData, justDocGroup);

            this.report('datasetDoc', datasetDoc);
            return await this.getDataset(dest).save(datasetDoc);
        } catch (error) {
            console.error(`EngageAnalytics.addAnalyticDoc(${triggerData.source})`, error, model, triggerData);
            return null;
        }
    }

    async removeAnalyticDoc(model: IEngageAnalyticModel, data: IEngageTriggerData) {
        // TODO: finish
    }


    async getAnalytic(docRef: string, dateRange: DateRanges) {
        const fieldCollection = EngageAnalytics.STORE.getInstance(`${docRef}/$analytics`);
        //TODO: Build data ranges
        // const query = fieldCollection.ref
        //     .where('$year', '==', dates.$year)
        //     .where('$month', '==', dates.$month)
        //     .where('$week', '==', dates.$week)
        //     .where('$day', '==', dates.$day)
        // return fieldCollection.getList(query);
    }
    
    static getPathDetails(path: string) {
        const [collection, id, subCollection, subId] = path.split('/');
        return {
            collection, 
            id, 
            subCollection, 
            subId,
            name: `${collection}${(subCollection || '').charAt(0).toUpperCase() + (subCollection || '').slice(1)}`
        };
    }

    static addRelationToDoc(doc: any, relation: string, relationId: string) {
        if (relation && relation[relation.length - 1].toLowerCase() === 's') {
            relation = relation.slice(0, -1);
        }
        return doc[`${relation}Id`] = relationId;
    }

    static getDocRelations(doc: any): string[] {
        return Object
            .keys(doc)
            .map(key => (key || '').length > 2 && (key || '').includes('Id') ? key.replace('Id', ''): '')
            .filter(item => item !== '');
    }

    static getGroupIdName(field: string): string {
        let idField = '';
        if (field && field.includes('{') && field.includes('}')) {
            idField = field.replace('{', '').replace('}', '');
        }
        return idField;
    }

    static triggerParser(trigger: string = '') {
        const [collection, id, subCollection, subId] = trigger.split('/');
        let idField = EngageAnalytics.getGroupIdName(id);
        let subIdField = EngageAnalytics.getGroupIdName(subId);
        return {
            collection,
            id,
            idField,
            subCollection,
            subId,
            subIdField,
        }
    }

    static createSourceRef(triggerData: IEngageTriggerData, ref = false) {
        let path = '';
        let parent = '';
        let { data, trigger } = triggerData;
        const {
            collection,
            idField,
            subCollection,
            subIdField,
        } = EngageAnalytics.triggerParser(trigger);

        if (data && data.$path) {
            path = data.$path;
        } else if (subCollection && triggerData[subIdField]) {
            parent = `${collection}/${triggerData[idField]}`;
            path = `${collection}/${triggerData[idField]}/${subCollection}/${triggerData[subIdField]}`;
        } else if (collection && triggerData[idField]) {
            path = `${collection}/${triggerData[idField]}`;
        }
        return !ref ? [path, parent] : [EngageAnalytics.STORE.getInstance(path), EngageAnalytics.STORE.getInstance(parent)];
    }

    static async createDestinationRef(triggerData: IEngageTriggerData, model: IEngageAnalyticModel, ref = false) {
        let { data } = triggerData;
        let path = '';
        let parent;
        const {
            collection,
            idField,
            subCollection,
            subIdField,
        } = EngageAnalytics.triggerParser(model.destination);
        
        if (triggerData.sourceParent) {
            const baseCollection = EngageAnalytics.STORE.getInstance(triggerData.collection);
            parent = await baseCollection.get(triggerData.id);
        }

        if (subCollection && parent && parent[idField]) {
            path = `${collection}/${parent[idField]}/${subCollection}/${data.$id}`;
        } else if (collection && parent && parent[idField]) {
            path = `${collection}/${parent[idField]}`;
        }
        return !ref ? path : EngageAnalytics.STORE.getInstance(path);
    }
    
}