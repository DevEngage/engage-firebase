import EngageFire from './engagefire';
import * as _ from 'lodash';
import EngageFile from './file';

declare let confirm: any;

export default class EngageDoc {
    static STORE: any;
    $ref: any;
    $path!: string;
    $owner!: string;
    $loading: boolean = true;
    public $id?: string;
    public $collection: string = '';
    public $collectionRef: any;
    public $collections: any = {};
    public $collectionsList: string[] = [];
    public $omitList: string[] = [];
    private $engageFireStore: any;
    public relations = [];
    position: any;
    public $doc: any = {
        '$owner': '',
        '$id': '',
        '$collection': '',
    };

    constructor(
        data: any,
        collection: string,
        collections: string[] = []
    ) {
        this.$engageFireStore = EngageDoc.STORE.getInstance(collection);
        this.$collectionsList = collections;
        this.$doc = { ...this.$doc, ...data };
        this.$$init();
    }

    async $$init() {
        await EngageFire.ready();
        this.$id = this.$doc.$id || this.$doc.id || this.$id;
        this.$ref = this.$engageFireStore.ref;
        this.$path = `${this.$ref.path}/${this.$id}`;
        this.$collection = this.$ref.path;

        if (this.$collectionsList && !this.$collectionsList.forEach) return;
        (this.$collectionsList || []).forEach(element => {
            const [sub, preFetch] = element.split('.');
            this.$collections[`${sub}_`] = EngageDoc.STORE.getInstance(`${this.$path}/${sub}`);
            this.$omitList.push(`${sub}_`);
            if (preFetch === 'list') this.$collections[`${sub}_`].getList();
            _.assign(this, this.$collections);
        });
        this.$loading = false;
    }

    $save() {
        this.$$updateDoc();
        return this.$engageFireStore.save(this.$doc);
    }

    $update() {
        this.$$updateDoc();
        return this.$engageFireStore.update(this.$doc);
    }

    $set() {
        this.$$updateDoc();
        return this.$engageFireStore.update(this.$doc);
    }

    async $get() {
        this.$doc = await this.$engageFireStore.get(this.$id);
        return this.$doc;
    }

    async $attachOwner() {
        this.$owner = await this.$engageFireStore.getUserId();
        this.$doc.$owner = this.$owner;
        this.$$updateDoc();
        this.$doc = await this.$engageFireStore.save(this.$doc);
        return this.$doc;
    }

    async $isOwner(userId = this.$doc.$owner) {
        if (!userId) {
            await this.$attachOwner();
        }
        return this.$owner === (await this.$engageFireStore.getUserId());
    }

    async $addFiles(elements?: never[] | undefined, inputId?: string | undefined) {
        this.$$updateDoc();
        return await new EngageFile().uploadFiles(this, elements, inputId);
    }

    async $setImage(options?: { width: string; height: string; thumbnail: { width: string; height: string; }; } | undefined, inputId?: any, file?: any) {
        console.log('hit setImage');
        this.$$updateDoc();
        console.log('passed update');
        return await new EngageFile().uploadImage(this, inputId, file);
    }

    async $removeImage() {
        this.$$updateDoc();
        await this.$engageFireStore.deleteImage(this.$doc);
        await this.$save();
        return this.$doc;
    }

    async $removeFile(fileId: any) {
        this.$$updateDoc();
        await this.$engageFireStore.deleteFile(this.$doc, fileId);
        return this.$doc;
    }

    async $getFiles() {
        return (await this.$getSubCollection('$files')).getList();
    }

    async $getFile(fileId: any) {
        return (await this.$getSubCollection('$files')).get(fileId);
    }

    async $downloadFile(fileId: any) {
        const fileDoc: any = (await this.$getSubCollection('$files')).get(fileId);
        return await new EngageFile().downloadFile(fileDoc.url);
    }

    async $remove(showConfirm = false) {
        if (showConfirm) {
            const r = confirm('Are you sure?');
            if (!r) return;
        }
        const result = this.$engageFireStore.remove(this.$id);
        this.$engageFireStore.list = this.$engageFireStore.list.filter(item => item.$id !== this.$id);
        return result;
    }

    async $getSubCollection(collection: string, db?: any): Promise<any> {
        return EngageDoc.STORE.getInstance(`${this.$path}/${this.$id}/${collection}`, db);
    }

    async $watch(cb: any) {
        return this.$engageFireStore.watch(this.$id, cb);
    }

    async $watchPromise() {
        return this.$engageFireStore.watchPromise(this.$id);
    }

    async $backup(deep: boolean | undefined, backupPath: string | undefined) {
        this.$$updateDoc();
        return await this.$engageFireStore.backupDoc(this.$doc, deep, backupPath);
    }

    $exists() {
        this.$$updateDoc();
        return !!this.$doc;
    }

    $getModel() {
        return this.$engageFireStore.getModel();
    }

    async $changeId(newId: string) {
        await this.$engageFireStore.replaceIdOnCollection(<string>this.$id, newId);
        this.$id = newId;
        this.$$updateDoc();
    }

    async $swapPosition(x: any, y: any, list?: any) {
        list = list || this.$$getSortedParentList();
        if (list.some((item: any) => item.position === undefined)) {
            await this.$engageFireStore.buildListPositions();
        }
        const itemX = list[x];
        const itemY = list[y];
        const itemXPos = itemX.position || x + 1;
        const itemYPos = itemY.position || y + 1;
        itemX.position = itemYPos;
        itemY.position = itemXPos;
        this.$engageFireStore.list[y] = itemX;
        this.$engageFireStore.list[x] = itemY;
        await itemX.$save();
        await itemY.$save();
    }

    async $moveUp() {
        const list = this.$$getSortedParentList();
        const index = list.findIndex(item => item.position === this.position);
        if (index <= 0) {
            return;
        }
        await this.$swapPosition(index, index - 1, list);
    }

    async $moveDown() {
        const list = this.$$getSortedParentList();
        const index = list.findIndex(item => item.position === this.position);
        if (index >= list.length - 1) {
            return;
        }
        await this.$swapPosition(index, index + 1, list);
    }

    /* 
      RELATIONS
    */
    $addRelation(relation: string, relationId: string, save = true) {
        if (relation && relation[relation.length - 1].toLowerCase() === 's') {
            relation = relation.slice(0, -1);
        }
        const newDoc = {};
        newDoc[`${relation}Id`] = relationId;
        _.assign(this, newDoc);
        this.$$updateDoc();
        if (save) this.$save();
    }

    $getRelations(): string[] {
        return Object
            .keys(this.$doc)
            .map(key => (key || '').length > 2 && (key || '').includes('Id') ? key.replace('Id', '') : '')
            .filter(item => item !== '');
    }

    // https://stackoverflow.com/questions/46568850/what-is-firestore-reference-data-type-good-for
    $addReference(ref: any, name: string, save = true) {
        const newDoc = {};
        newDoc[`${name}Ref`] = ref;
        _.assign(this, newDoc);
        this.$$updateDoc();
        if (save) this.$save();
    }

    $getReferences(): string[] {
        return Object
            .keys(this.$doc)
            .map(key => (key || '').length > 2 && (key || '').includes('Ref') ? key.replace('Ref', '') : '')
            .filter(item => item !== '');
    }

    /*  */
    $getPath(): string[] {
        return (this.$path || '').split('/');
    }

    /*  */

    $$getSortedParentList() {
        return this.$engageFireStore.sortListByPosition().list;
    }

    $$updateDoc(doc = this) {
        console.log('doc', doc);
        // this.$doc = this.$engageFireStore.omitFire(_.cloneDeep(doc));
        return this.$doc;
    }

    $$difference(object: any, base: any) {
        function changes(object: any, base: { [x: string]: any; }) {
            return _.transform(object, (result: { [x: string]: any; }, value: any, key: string | number) => {
                if (!_.isEqual(value, base[key])) {
                    result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    }

    async $(key: string, { value, defaultValue, increment, decrement, done, save = true }) {
        if (increment !== undefined && increment > 0) {
            value = this.$doc[key] || 0;
            value += increment;
        }
        if (decrement !== undefined && decrement > 0) {
            value = this.$doc[key] || 0;
            value -= decrement;
        }
        if (defaultValue) {
            value = defaultValue;
        }
        if (!value) {
            if (done != null) done(this.$doc[key], key);
            return this.$doc[key];
        }
        this.$doc[key] = value;
        if (save) await this.$save();
        if (done) done(value, key);
        return this.$doc[key];
    }
}

