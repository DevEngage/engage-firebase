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
    
    private model;

    constructor(
        public path: string
    ) {
        this.init(path);
    }

    private async init(path) {
        const details = EngageAnalytics.triggerParser(path);
        this.model = EngageAnalytics.STORE.getInstance(`$collections/${details.collection}/$analyticModels`);
    }

    async triggerUpdate(models, triggerData: IEngageTriggerData, action: AnalyticAction) {
        const promises = models.map((model: IEngageAnalyticModel) => {
            if ((action === 'minus' || action === 'remove') && !model.final) {
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
        let num = data[group.field] || 1;
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
        if (!(group.action === 'minus' || group.action === 'remove')) {
            doc['$counter'] += 1;
        }
        doc['$counter'] += 1;
        return doc;
    }

    async applyGroup(model: IEngageAnalyticModel, data, trigger) {
        EngageAnalytics.createTriggerRef(data, trigger);
        // const model = EngageAnalytics.STORE.getInstance(`${model.destination}`)
    }

    async getModels(): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList();
    }

    async getModelByField(field): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList(
            this.model.ref.where('field', '==', field)
        );
    }

    addModel(doc): Promise<IEngageAnalyticModel> {
        return this.model.save(doc);
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
        filter
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

    static buildDatasetDoc(model: IEngageAnalyticModel, data: IEngageTriggerData) {
        const fieldDoc: IEngageAnalyticDataset = EngageAnalytics.getDataFromSnapshot(model, data);
        const dest = EngageAnalytics.createTriggerRef(data);
        let dataset = {
            ...fieldDoc,
            $action: model.action,
            $sourceRef: data.source || '',
            $destinationRef: dest || '',
            $userId: data.userId,
            $removed: false,
        };
        return dataset;
    }

    async addAnalyticDoc(model: IEngageAnalyticModel, triggerData: IEngageTriggerData) {
        const datasetDoc = EngageAnalytics.buildDatasetDoc(model, triggerData);
        const dest = EngageAnalytics.createTriggerRef(triggerData);
        const dates = EngageAnalytics.getDates(triggerData.data);
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

    static triggerParser(trigger: string) {
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

    static createTriggerRef(triggerData: IEngageTriggerData, ref = false) {
        let { data, trigger } = triggerData;
        const {
            collection,
            idField,
            subCollection,
            subIdField,
        } = EngageAnalytics.triggerParser(trigger);

        let path = '';

        if (collection && (data[idField] || data.$id)) {
            path += `${collection}/${data[idField] || data.$id}`;
        }

        if (subCollection && data[subIdField]) {
            if (path) path += '/';
            path += `${collection}/${data[subIdField]}`;
        }
        
        return ref ? path : EngageAnalytics.STORE.getInstance(path);
    }

}