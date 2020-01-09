export default class EngageDoc {
    static STORE: any;
    $ref: any;
    $path: string;
    $owner: string;
    $loading: boolean;
    $id?: string;
    $collection: string;
    $collectionRef: any;
    $collections: any;
    $collectionsList: string[];
    $omitList: string[];
    private $engageFireStore;
    relations: any[];
    position: any;
    $doc: any;
    constructor(data: any, collection: string, collections?: string[]);
    $$init(): Promise<void>;
    $save(): any;
    $update(): any;
    $set(): any;
    $get(): Promise<any>;
    $attachOwner(): Promise<any>;
    $isOwner(userId?: any): Promise<boolean>;
    $addFiles(elements?: never[] | undefined, inputId?: string | undefined): Promise<any>;
    $setImage(options?: {
        width: string;
        height: string;
        thumbnail: {
            width: string;
            height: string;
        };
    } | undefined, inputId?: any, file?: any): Promise<any>;
    $removeImage(): Promise<any>;
    $removeFile(fileId: any): Promise<any>;
    $getFiles(): Promise<any>;
    $getFile(fileId: any): Promise<any>;
    $downloadFile(fileId: any): Promise<any>;
    $remove(showConfirm?: boolean): Promise<any>;
    $getSubCollection(collection: string, db?: any): Promise<any>;
    $watch(cb: any): Promise<any>;
    $watchPromise(): Promise<any>;
    $backup(deep: boolean | undefined, backupPath: string | undefined): Promise<any>;
    $exists(): boolean;
    $getModel(): any;
    $changeId(newId: string): Promise<void>;
    $swapPosition(x: any, y: any, list?: any): Promise<void>;
    $moveUp(): Promise<void>;
    $moveDown(): Promise<void>;
    $addRelation(relation: string, relationId: string, save?: boolean): void;
    $getRelations(): string[];
    $addReference(ref: any, name: string, save?: boolean): void;
    $getReferences(): string[];
    $getPath(): string[];
    $$getSortedParentList(): any;
    $$updateDoc(doc?: this): any;
    $$difference(object: any, base: any): {
        [x: string]: any;
    };
    $(key: string, { value, defaultValue, increment, decrement, done, save }: {
        value: any;
        defaultValue: any;
        increment: any;
        decrement: any;
        done: any;
        save?: boolean;
    }): Promise<any>;
}
