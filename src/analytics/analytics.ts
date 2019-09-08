import { IEngageAnalytic, AnalyticAction, IEngageAnalyticModel } from "../interfaces/analytics.interface";
import EngageFirestore from "../firestore/firestore";
import EngageFireDoc from "../doc/doc";

export class EngageAnalytics {
    private collection: EngageFirestore;
    private doc: EngageFireDoc;
    private model: EngageFirestore;

    constructor(public path: string) {
        this.init(path);
    }

    private async init(path) {
        this.collection = EngageFirestore.getInstance(`$analytics`);
        this.doc = await this.collection.get<EngageFireDoc>(`${path}`);
        this.model = EngageFirestore.getInstance(`$analytics/${path}/$model`);
    }

    async add(field, num = 1) {
        this.action('add', field, num);
    }

    async subtract(field, num = 1) {
        this.action('minus', field, num);
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
        const col = EngageFirestore.getInstance(`$analytics/${this.path}/${field}`);
        const list: any[] = col.getList(
            action ? col.ref.where('action', '==', action) : col.ref
        )
        return list.reduce((prev, curr) => prev += curr.amount || 0, 0);
    }

    saveModelField(doc: any) {
        doc.$save()
        return this;
    }

    async getModel(field): Promise<IEngageAnalyticModel[]> {
        return await this.model.getList(
            this.model.ref.where('field', '==', field)
        );
    }

    linkFieldToCollection(model: IEngageAnalyticModel) {
        this.model.save(model);
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
        };
        this.action(model.action, model.field, relationAmount);
        return await EngageFirestore.getInstance(`$analytics/${this.path}/${model.field}`).save(fieldDoc);
    }

    async sync(field) {
        this.doc[field] = 0;
        const model: IEngageAnalyticModel[] = await this.getModel(field);
        const promises = model.map(async (model: IEngageAnalyticModel) => {
            const proms = (await EngageFirestore.getInstance(model.relaction).getList())
                .map(relationItem => {
                    if (relationItem.snapshot) {
                        this.addRelationDoc(model, relationItem);                    
                    } else {
                        const relationAmount = this.getRelationAmount(model, relationItem);
                        this.action(model.action, model.field, relationAmount);
                    }
                });
            return Promise.all(proms);
        });
        await Promise.all(promises);
        return this.doc[field];
    }


}