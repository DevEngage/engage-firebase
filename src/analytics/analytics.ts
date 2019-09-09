import { IEngageAnalytic, AnalyticAction, IEngageAnalyticModel } from "../interfaces/analytics.interface";

export class EngageAnalytics {
    static STORE;
    static DOC;
    
    private collection;
    private model;

    constructor(
        public path: string
    ) {
        this.init(path);
    }

    private async init(path) {
        const details = this.getPathDetails(path);
        this.collection = EngageAnalytics.STORE.getInstance(`$analytics`);
        this.model = EngageAnalytics.STORE.getInstance(`$analyticModels`);
    }

    async updateDestinations(models, data) {
        const promises = models.map(model => {
            return this.addDoc(model, data)
        });
        return await Promise.all(promises);
    }

    // async add(field, num = 1) {
    //     this.action('add', field, num);
    // }

    // async subtract(field, num = 1) {
    //     this.action('minus', field, num);
    // }

    addDoc(model, doc) {
        return this.addAnalyticDoc(model, doc);
    }

    subtractDoc(model, doc) {
        return this.removeAnalyticDoc(model, doc);
    }

    getAnalytics(dest: string, field = 'total') {
        EngageAnalytics.STORE.getInstance(`${dest}/$analytics`)
    }

    // async action(action: AnalyticAction, field: string, num = 1, save = true) {
    //     let model;
    //     if (save) {
    //         model = await this.model.getList(
    //             this.model.ref.where('field', '==', field)
    //         );
    //     }
    //     if (!this.doc[field]) {
    //         this.doc[field] = 0;
    //     }
    //     switch (action) {
    //         case 'add': 
    //             this.doc[field] += num;
    //             break;
    //         case 'minus': 
    //             this.doc[field] -= num;
    //             break;
    //         case 'multiply': 
    //             this.doc[field] *= num;
    //             break;
    //         case 'minus': 
    //             this.doc[field] /= num;
    //             break;
    //         case 'set': 
    //             this.doc[field] = num;
    //             break;
    //         case 'sum': 
    //             this.doc[field] = await this.sumList(field, action);
    //             break;
    //         default:
    //             this.doc[field] += num;
    //     }
    //     if (model && model[0] && model[0].type === 'int') {
    //         this.doc[field] = parseInt(this.doc[field]);
    //     }
    //     if (save) await this.doc.$save();
    //     return this.doc[field];
    // }

    async applyAction(model: IEngageAnalyticModel, dataset = 'total', num = 1, save = true) {
        const collectionAnalytics = EngageAnalytics.STORE.getInstance(`${model.destination}/$analytics`);
        const doc = await collectionAnalytics.get(dataset);
        if (!doc[model.field]) {
            doc[model.field] = 0;
        }
        switch (model.action) {
            case 'add':
                doc[model.field] += num;
                break;
            case 'minus':
                doc[model.field] -= num;
                break;
            case 'multiply':
                doc[model.field] *= num;
                break;
            case 'minus':
                doc[model.field] /= num;
                break;
            case 'set':
                doc[model.field] = num;
                break;
            case 'sum':
                doc[model.field] = await this.sumList(model.field, model.action);
                break;
            default:
                doc[model.field] += num;
        }
        if (model && model[0] && model[0].type === 'int') {
            doc[model.field] = parseInt(doc[model.field]);
        }
        if (save) await doc.$save();
        return doc[model.field];
    }

    async sumList(field: string, action?: AnalyticAction) {
        const col = EngageAnalytics.STORE.getInstance(`$analytics`);
        let ref = action ? col.ref.where('action', '==', action) : col.ref;
        ref = ref.where('field', '==', field).where('collection', '==', this.path);
        const list: any[] = col.getList(ref);
        return list.reduce((prev, curr) => prev += curr.amount || 0, 0);
    }

    async getTiggers(trigger: string): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList(
            this.model.ref.where('trigger', '==', trigger)
        );
    }

    async getModels(trigger): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList(
            this.model.ref.where('trigger', '==', trigger)
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

    async healthCheck(model, dataset) {
        const collectionAnalytics = EngageAnalytics.STORE.getInstance(`${model.destination}/$analytics`);
        const doc = await collectionAnalytics.get(dataset);
        console.log('field:', doc[model.field]);
        if (doc[model.field] === (await this.sumList(model.field))) {
            return true;
        }
        return false;
    }

    // async fix(field) {
    //     this.action('sum', field);
    // }

    getAmount(model: IEngageAnalyticModel, relationItem) {
        let valid = true;
        let relationAmount = 0;
        if (model.validation && model.validation.length) {
            valid = model.validation.reduce((prev, curr) => {
                const valueTrue = prev && curr && relationItem && curr.field && relationItem[curr.field] !== curr.value;
                const greaterThan = curr.greaterThan === undefined || (prev && curr && relationItem && curr.greaterThan !== undefined && relationItem[curr.field] >= curr.greaterThan);
                const lessThan = curr.lessThan === undefined || (prev && curr && relationItem && curr.lessThan !== undefined && relationItem[curr.field] <= curr.lessThan);
                return valueTrue && greaterThan && lessThan;
            }, true);
        }
        if (valid) {
            relationAmount = relationItem[model.amountField] || 1;
        }
        return relationAmount;
    }

    getDataFromSnapshot(model, relationItem) {
        let fieldDoc: IEngageAnalytic;
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
        return fieldDoc;
    }

    async addAnalyticDoc(model: IEngageAnalyticModel, relationItem) {
        let fieldDoc: IEngageAnalytic = this.getDataFromSnapshot(model, relationItem);
        let relationAmount = this.getAmount(model, relationItem);
        fieldDoc = {
            ...fieldDoc,
            $action: model.action,
            $amount: relationAmount,
            $source: model.source,
            $destination: model.destination,
            // $userId: model.relactionField,
        };
        if (model.source && relationItem.id) {
            fieldDoc['$id'] = `${model.source}/${relationItem.id}`;
        }
        if (model.allowDuplicates) {
            delete fieldDoc['$id'];
            delete fieldDoc['id'];
        }
        if (model.range && model.range.length) {
            await Promise.all(model.range.map(item => this.applyAction(model, item, relationAmount)));
        }
        await this.applyAction(model, 'total', relationAmount);
        return await EngageAnalytics.STORE.getInstance(`$analytics`).save(fieldDoc);
    }

    async removeAnalyticDoc(model: IEngageAnalyticModel, doc) {
        model.action = 'minus';
        let relationAmount = this.getAmount(model, doc);
        if (model.range && model.range.length) {
            await Promise.all(model.range.map(item => this.applyAction(model, item, relationAmount)));
        }
        await this.applyAction(model, 'total', relationAmount);
        return await EngageAnalytics.STORE.getInstance(`$analytics`).remove(doc.$id);
    }

    async sync(field) {
        const model: IEngageAnalyticModel[] = await this.getModelByField(field);
        const promises = model.map(async (model: IEngageAnalyticModel) => {
            const proms = (await EngageAnalytics.STORE.getInstance(model.source).getList())
                .map(async relationItem => {
                    if (relationItem.snapshot) {
                        return this.addAnalyticDoc(model, relationItem);                    
                    } else {
                        const relationAmount = this.getAmount(model, relationItem);
                        if (model.range && model.range.length) {
                            await Promise.all(model.range.map(item => this.applyAction(model, item, relationAmount)));
                        }
                        return await this.applyAction(model, 'total', relationAmount);
                    }
                });
            return Promise.all(proms);
        });
        await Promise.all(promises);
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
    
    getPathDetails(path: string) {
        const [collection, id, subCollection, subId] = path.split('/');
        return {
            collection, 
            id, 
            subCollection, 
            subId,
            name: `${collection}${(subCollection || '').toUpperCase()}`
        };
    }

}