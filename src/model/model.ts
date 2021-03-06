export type EngageModelType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'image' | 'file' | 'files' | 'range' | 'collection' | '';
export interface IEngageModel {
    name?: string;
    label?: string;
    type?: EngageModelType;
    choices?: any[];
    relation?: string; // collection path
    collection?: string; 
    backup?: boolean;
    required?: boolean;
    default?: any;
    multiple?: boolean;
    min?: number;
    max?: number;
    size?: string;
    siblingValue?: string;
    updateSibling?: string;
    field?: string;
    quality?: string;
    permission?: string[];
    position?: number;
    // error?: string;
}

export interface IEngageCollectionModel {
    path?: string;
    label?: string;
    type?: string;
    relations?: [
        {
            field?: string;
            collection?: string;
            type?: string;
        }
    ];
    backup?: boolean;
    error?: string;
    permission?: string[];
}

export default class EngageModel {
    keys: string[] = [];

    constructor(public model: IEngageModel[], public data?: any) {
        if (this.model) {
            this.generateKeys();
        }
    }

    generateKeys() {
        this.keys = this.model.map(item => item.name || '').filter(item => item !== '');
    }

    setModel(model: IEngageModel[]) {
        this.model = model;
    }

    getModel() {
        return this.model;
    }

    addModel(modelItem: IEngageModel) {
        this.model.push(modelItem);
    }

    setData(data: any) {
        this.data = data;
    }

    validateAll(data?: any): boolean {
        if (!data) data = this.data;
        return this.model.every((item: IEngageModel) => {
            return this.validate(item.name, data);
        });
    }

    validate(key: string | undefined, data: any): boolean {
        let valid = true;
        const dataItem = data[key || ''];
        const modelItem: IEngageModel | undefined = this.model.find(item => item && item.name === key);
        if (!modelItem || !key) {
            return false;
        }
        if (!dataItem && modelItem && modelItem.required) {
            return false;
        }
        if (dataItem && modelItem && modelItem.type) {
            valid = typeof dataItem === modelItem.type;
        }
        if (!dataItem && modelItem && modelItem.default !== undefined) {
            data[key] = modelItem.default;
        }
        return valid;
    }

    getValue(value: any): EngageModelType {
        switch (typeof value) {
            case 'string':
                if ((value.match(/\.(jpeg|jpg|gif|png)$/) != null)) {
                    return 'image'
                } else if (value.split('/').pop().indexOf('.') > -1) {
                    return 'file';
                }
                return 'string';
            case 'number':
                return 'string';
            case 'boolean':
                return 'string';
            case 'object':
                if (value.length) {
                    return 'array';
                }
                return 'string';
            default:
                return '';
        }
    }

    analyze(data: any): IEngageModel[] {
        const dataArray: any[] = Object.keys(data);
        return dataArray.map((key: string, index) => {
            return {
                name: data[key],
                label: data[key],
                type: this.getValue(data[key]),
                choices: [],
                relation: '', // collection path
                collection: '',
                backup: false,
                required: false,
                default: '',
                multiple: false,
                min: -1,
                max: -1,
                size: '',
                siblingValue: '',
                updateSibling: '',
                field: '',
                quality: '',
                permission: []
            };
        });
    }

}

export const validateFunction = (change: any, model: IEngageModel[]) => {
    const data = change.after.data();
    const valid: boolean = new EngageModel(model, data).validateAll();
    return valid ? data : change.before.data();

};
