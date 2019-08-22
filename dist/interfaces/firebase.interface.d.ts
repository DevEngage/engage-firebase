import { IFirebaseObject } from "./firebase-object.interface";
export interface EngIFirebase {
    ref: any;
    auth: any;
    userId: string;
}
export interface IFirebaseObject {
    $id?: string;
    $exists?: boolean;
    createdAt?: number;
    updatedAt?: number;
}
export interface EngIFirebaseCollection extends IFirebaseObject, EngIFirebase {
    path?: string;
    updateState?: boolean;
    save(): any;
    set(): any;
    update(): any;
    get(id?: any): any;
    remove?(id?: any, updateState?: any): any;
}
export interface EngIFirebaseDoc extends IFirebaseObject, EngIFirebase {
    collection?: string;
    save(value: any, updateState?: any): any;
    set(value: any, updateState?: any): any;
    update(value: any, updateState?: any): any;
    get(id?: any): any;
    subscribe?(): any;
    remove?(updateState?: any): any;
}
