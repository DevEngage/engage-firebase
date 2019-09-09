import { IEngageAnalytic, AnalyticAction, IEngageAnalyticModel } from "../interfaces/analytics.interface";

export class EngageAnalytics {
    static STORE;
    static DOC;
    
    private collection;
    private collectionAnalytics;
    private doc;
    private model;

    constructor(public path: string, public id: string) {
        this.init(path);
    }

    private async init(path) {
        this.collection = EngageAnalytics.STORE.getInstance(`$analytics`);
        this.collectionAnalytics = EngageAnalytics.STORE.getInstance(`${path}/${this.id}/$analytics`);
        this.doc = await this.collectionAnalytics.get(`total`);
        this.model = EngageAnalytics.STORE.getInstance(`$analyticModels`);
    }

    async add(field, num = 1) {
        this.action('add', field, num);
    }

    async subtract(field, num = 1) {
        this.action('minus', field, num);
    }

    addDoc(model, doc) {
        return this.addRelationDoc(model, doc);
    }

    subtractDoc(model, doc) {
        return this.removeRelationDoc(model, doc);
    }

    async action(action: AnalyticAction, field: string, num = 1, save = true) {
        let model;
        if (save) {
            model = await this.model.getList(
                this.model.ref.where('field', '==', field)
            );
        }
        if (!this.doc[field]) {
            this.doc[field] = 0;
        }
        switch (action) {
            case 'add': 
                this.doc[field] += num;
                break;
            case 'minus': 
                this.doc[field] -= num;
                break;
            case 'multiply': 
                this.doc[field] *= num;
                break;
            case 'minus': 
                this.doc[field] /= num;
                break;
            case 'set': 
                this.doc[field] = num;
                break;
            case 'sum': 
                this.doc[field] = await this.sumList(field, action);
                break;
            default:
                this.doc[field] += num;
        }
        if (model && model[0] && model[0].type === 'int') {
            this.doc[field] = parseInt(this.doc[field]);
        }
        if (save) await this.doc.$save();
        return this.doc[field];
    }

    async sumList(field: string, action?: AnalyticAction) {
        const col = EngageAnalytics.STORE.getInstance(`$analytics`);
        let ref = action ? col.ref.where('action', '==', action) : col.ref;
        ref = ref.where('field', '==', field).where('collection', '==', this.path);
        const list: any[] = col.getList(ref);
        return list.reduce((prev, curr) => prev += curr.amount || 0, 0);
    }

    async getModels(): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList(
            this.model.ref.where('collection', '==', this.path)
        );
    }

    async getModelByField(field): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList(
            this.model.ref.where('field', '==', field)
        );
    }

    addModel(doc): Promise<IEngageAnalyticModel> {
        return this.model.save(doc);
    }

    linkFieldToCollection(model: IEngageAnalyticModel) {
        return this.model.save(model);
    }

    async healthCheck(field) {
        console.log('field:', this.doc[field]);
        if (this.doc[field] === (await this.sumList(field))) {
            return true;
        }
        return false;
    }

    async fix(field) {
        this.action('sum', field);
    }

    getRelationAmount(model, relationItem) {
        let relationAmount = 1;
        if (model.relactionField) {
            relationAmount = relationItem[model.relactionField] || 1;
        }
        return relationAmount;
    }

    async addRelationDoc(model: IEngageAnalyticModel, relationItem) {
        let fieldDoc: IEngageAnalytic;
        let relationAmount = this.getRelationAmount(model, relationItem);
        if (model.snapeshot === true) {
            fieldDoc = {
                ...relationItem,
            };
        } else if (typeof model.snapeshot === 'string') {
            fieldDoc = {};
            fieldDoc[model.snapeshot] = relationItem[model.snapeshot];
        } else if (typeof model.snapeshot === 'object' && model.snapeshot.length) {
            fieldDoc = {};
            model.snapeshot.forEach(element => fieldDoc[element] = relationItem[element]);
        }
        fieldDoc = {
            ...fieldDoc,
            $action: model.action,
            $amount: relationAmount,
            $relation: model.relaction,
            $relactionField: model.relactionField,
            $userId: model.relactionField,
        };
        this.action(model.action, model.field, relationAmount);
        return await EngageAnalytics.STORE.getInstance(`$analytics`).save(fieldDoc);
        // return await EngageAnalytics.STORE.getInstance(`$analytics/${this.path}/${model.field}`).save(fieldDoc);
    }

    async removeRelationDoc(model: IEngageAnalyticModel, doc) {
        let fieldDoc: IEngageAnalytic;
        let relationAmount = this.getRelationAmount(model, doc);
        this.action('minus', model.field, relationAmount);
        return await EngageAnalytics.STORE.getInstance(`$analytics`).remove(doc.$id);
        // return await EngageAnalytics.STORE.getInstance(`$analytics/${this.path}/${model.field}`).save(fieldDoc);
    }

    async sync(field) {
        this.doc[field] = 0;
        const model: IEngageAnalyticModel[] = await this.getModelByField(field);
        const promises = model.map(async (model: IEngageAnalyticModel) => {
            const proms = (await EngageAnalytics.STORE.getInstance(model.relaction).getList())
                .map(relationItem => {
                    if (relationItem.snapshot) {
                        return this.addRelationDoc(model, relationItem);                    
                    } else {
                        const relationAmount = this.getRelationAmount(model, relationItem);
                        return this.action(model.action, model.field, relationAmount);
                    }
                });
            return Promise.all(proms);
        });
        await Promise.all(promises);
        return this.doc[field];
    }

    async getRange(field, start, end) {
        const fieldCollection = EngageAnalytics.STORE.getInstance(`$analytics`);
        const query = fieldCollection.ref
            .where('field', '==', field)
            .where('source', '==', this.path)
            .where('$createdAt', '>=', start)
            .where('$createdAt', '<=', end);
        return fieldCollection.getList(query);
    }

}