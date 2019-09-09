export interface IEngageFirebase {
    ref: any;
    auth: any;
    userId: string;
}
export interface IEngageFirebaseObject {
    $id?: string;
    $exists?: boolean;
    $collection?: string;
    $userId?: string;
    $createdAt?: number;
    $updatedAt?: number;
}
export interface IEngageImage {
    $thumb?: string;
    $image?: string;
    $imageMeta?: any;
}
export interface IEngageFirebaseCollection extends IEngageFirebaseObject, IEngageFirebase {
    path?: string;
    updateState?: boolean;
    save(): any;
    set(): any;
    update(): any;
    get(id?: any): any;
    remove?(id?: any, updateState?: any): any;
}
export interface IEngageFirebaseDoc extends IEngageFirebaseObject, IEngageFirebase, IEngageImage {
    $id?: string;
    $save(value: any, updateState?: any): any;
    $set(value: any, updateState?: any): any;
    $update(value: any, updateState?: any): any;
    $get(id?: any): any;
    $remove?(updateState?: any): any;
}
