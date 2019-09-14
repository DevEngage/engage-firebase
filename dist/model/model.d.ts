export declare type EngageModelType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'image' | 'file' | 'files' | 'range' | 'collection' | '';
export interface IEngageModel {
    name?: string;
    label?: string;
    type?: EngageModelType;
    choices?: any[];
    relation?: string;
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
}
export interface IEngageCollectionModel {
    path?: string;
    label?: string;
    type?: string;
    relations?: [{
        field?: string;
        collection?: string;
        type?: string;
    }];
    backup?: boolean;
    error?: string;
    permission?: string[];
}
export default class EngageModel {
    model: IEngageModel[];
    data?: any;
    keys: string[];
    constructor(model: IEngageModel[], data?: any);
    generateKeys(): void;
    setModel(model: IEngageModel[]): void;
    getModel(): IEngageModel[];
    addModel(modelItem: IEngageModel): void;
    setData(data: any): void;
    validateAll(data?: any): boolean;
    validate(key: string | undefined, data: any): boolean;
    getValue(value: any): EngageModelType;
    analyze(data: any): IEngageModel[];
}
export declare const validateFunction: (change: any, model: IEngageModel[]) => any;
