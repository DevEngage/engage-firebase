import EngageFirestore from '../firestore/firestore';
export default class EngageFireDoc {
    $doc: any;
    $ref: any;
    $path: string;
    $owner: string;
    $loading: boolean;
    $id?: string;
    $collection: string;
    $collections: any;
    $collectionsList: string[];
    $omitList: string[];
    private $engageFireStore;
    position: any;
    constructor($doc: any, collection: string, collections?: string[]);
    $$init(): Promise<void>;
    $save(): Promise<any>;
    $update(): Promise<any>;
    $set(): Promise<any>;
    $get(): Promise<any>;
    $attachOwner(): Promise<any>;
    $isOwner(userId?: any): Promise<boolean>;
    $addFiles(elements?: never[] | undefined, inputId?: string | undefined): Promise<any[]>;
    $setImage(options?: {
        width: string;
        height: string;
        thumbnail: {
            width: string;
            height: string;
        };
    } | undefined, inputId?: any, file?: any): Promise<unknown>;
    $removeImage(): Promise<any>;
    $removeFile(fileId: any): Promise<any>;
    $getFiles(): Promise<any[]>;
    $getFile(fileId: any): Promise<any>;
    $downloadFile(fileId: any): Promise<unknown>;
    $remove(showConfirm?: boolean): Promise<void>;
    $getSubCollection(collection: string, db?: any): Promise<EngageFirestore>;
    $watch(cb: any): Promise<void>;
    $watchPromise(): Promise<unknown>;
    $backup(deep: boolean | undefined, backupPath: string | undefined): Promise<any>;
    $exists(): boolean;
    $getModel(): import("..").IEngageModel[];
    $changeId(newId: string): Promise<void>;
    $swapPosition(x: any, y: any, list?: any): Promise<void>;
    $moveUp(): Promise<void>;
    $moveDown(): Promise<void>;
    $$getSortedParentList(): any[];
    $$updateDoc(doc?: this): any;
    $$difference(object: any, base: any): {
        [x: string]: any;
    };
}
