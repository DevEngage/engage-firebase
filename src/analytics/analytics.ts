import { IEngageAnalytic, AnalyticAction, IEngageAnalyticModel, IEngageAnalyticGroup, IEngageAnalyticDataset, DateRanges } from "../interfaces/analytics.interface";
import { IEngageTriggerData } from "../interfaces/trigger.interfaces";


/* 
    TODO:
    [ ] 
*/
export class EngageAnalytics {
    static STORE;
    static DOC;
    static ANALYTICS_PATH = '$analytics';
    static DATASET_PATH = '$dataset';
    static CREATEDAT_NAME = '$createAt';
    
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
        return await Promise.all(promises);
    }

    addDoc(model, doc) {
        return this.addAnalyticDoc(model, doc);
    }

    subtractDoc(model, doc) {
        return this.removeAnalyticDoc(model, doc);
    }

    getAnalytics(dest: string, field = 'total') {
        const col = EngageAnalytics.STORE.getInstance(`${dest}/${EngageAnalytics.ANALYTICS_PATH}`);
        return col.get( field );
    }

    getDataset(dest: string) {
        return EngageAnalytics.STORE.getInstance(`${dest}/${EngageAnalytics.DATASET_PATH}`);
    }

    async applyAction(doc: any, data: any, group: IEngageAnalyticGroup) {
        const dataField = data[group.field];
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

    // async applyGroup(model: IEngageAnalyticModel, data, trigger) {
    //     EngageAnalytics.createTriggerRef(data, trigger);
    //     // const model = EngageAnalytics.STORE.getInstance(`${model.destination}`)
    // }

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
        const createdAt = new Date(data[EngageAnalytics.CREATEDAT_NAME] || Date.now());
        return {
            $year: createdAt.getFullYear(),
            $month: createdAt.getMonth() + 1,
            $week: Math.floor(createdAt.getDate() / 7),
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
        if (group && group.length && typeof group === 'object') {
            group.map((item) => {
                if (this.groupValid(data, item)) {
                    this.applyAction(doc, data, item);
                }
            });
        } else if (typeof group === 'string') {
            doc[group] = data[group] || 1;
        }
        if (!(triggerData.action === 'remove')) {
            doc['$counter'] -= 1;
        }
        doc['$counter'] += 1;
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

    static getDataFromSnapshot(model: IEngageAnalyticModel, data: IEngageTriggerData) {
        const fields = EngageAnalytics.getGroupFields(model.group);
        let fieldDoc = {};
        fields.forEach(element => {
            fieldDoc[element] = data[element];
        });
        if (model.snapeshot === true) {
            fieldDoc = {
                ...fieldDoc,
                ...data.data,
            };
        } else if (typeof model.snapeshot === 'string') {
            fieldDoc[model.snapeshot] = data.data[model.snapeshot];
        } else if (typeof model.snapeshot === 'object' && model.snapeshot.length) {
            model.snapeshot.forEach(element => fieldDoc[element] = data.data[element]);
        }
        return fieldDoc;
    }

    static async buildDatasetDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData) {
        const fieldDoc: IEngageAnalyticDataset = EngageAnalytics.getDataFromSnapshot(model, triggerData);
        const dest = await EngageAnalytics.createDestinationRef(triggerData, model);
        let dataset = {
            ...fieldDoc,
            $action: model.action,
            $sourceRef: triggerData.source || '',
            $destinationRef: dest || '',
            $userId: triggerData.userId,
            $removed: false,
        };
        return dataset;
    }

    async addAnalyticDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData) {
        if (!model.allowDuplicates && (triggerData.action === 'update' || triggerData.action === 'write')) {
            return null;
        }
        const datasetDoc = await EngageAnalytics.buildDatasetDoc(model, triggerData);
        console.log('datasetDoc:', datasetDoc);
        const dest = await EngageAnalytics.createDestinationRef(triggerData, model);
        console.log('dest:', dest);
        const dates = EngageAnalytics.getDates(triggerData.data);
        console.log('dates:', dates);
        const dayRef = this.getAnalytics(dest);
        const totalDoc = await dayRef.get('total');
        const dayDoc = (await dayRef.getList(
            dayRef
                .where('$year', '==', dates.$year)
                .where('$month', '==', dates.$month)
                .where('$week', '==', dates.$week)
                .where('$day', '==', dates.$day)
        ) || [])[0];
        
        if (model.allowDuplicates) {
            delete datasetDoc['$id'];
            delete datasetDoc['id'];
        }
        if (dayDoc) {
            this.getGroup(dayDoc, triggerData, model);
            dayDoc.$save();
        }
        if (totalDoc) {
            this.getGroup(totalDoc, triggerData, model);
            totalDoc.$save();
        }
        return await EngageAnalytics.STORE.getInstance(`${dest}/${EngageAnalytics.DATASET_PATH}`).save(datasetDoc);
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
            path = `${collection}/${data.$id}/${subCollection}/${triggerData[subIdField]}`;
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
            parent = EngageAnalytics.STORE.getInstance(triggerData.sourceParent);
        }

        if (subCollection && parent[idField]) {
            path = `${collection}/${parent[idField]}/${subCollection}/${data.$id}`;
        }  else if (collection && data[idField]) {
            path = `${collection}/${data[idField]}`;
        }
        return !ref ? path : EngageAnalytics.STORE.getInstance(path);
    }

    // static buildTrigger(trigger: string, subCollection: string, ref = false) {
    //     let {
    //         collection,
    //         idField,
    //         subIdField,
    //     } = EngageAnalytics.triggerParser(trigger);
    //     let path = '';

    //     if (collection && collection[collection.length - 1].toLowerCase() === 's') {
    //         idField = collection.slice(0, -1) + 'Id';
    //     }

    //     if (subCollection && subIdField && subCollection[subCollection.length - 1].toLowerCase() === 's') {
    //         subIdField = subCollection.slice(0, -1) + 'Id';
    //     }


    //     if (collection && idField) {
    //         path += `${collection}/{${idField}}`;
    //     }

    //     if (subCollection && subIdField) {
    //         if (path) path += '/';
    //         path += `${subCollection}/{${subIdField}}`;
    //     }
        
    //     return !ref ? path : EngageAnalytics.STORE.getInstance(path);
    // }

}