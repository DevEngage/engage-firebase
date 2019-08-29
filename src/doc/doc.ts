import * as _ from 'lodash';
import EngageFirestore, { engageFirestore } from '../firestore/firestore';

declare let confirm: any;

export default class EngageFireDoc {
  $ref: any;
  $path!: string;
  $owner!: string;
  $loading: boolean = true;
  public $id?: string;
  public $collection: string = '';
  public $collections: any = {};
  public $collectionsList: string[] = [];
  public $omitList: string[] = [];
  private $engageFireStore: EngageFirestore;
  position: any;

  constructor(
    public $doc: any, 
    collection: string,
    collections: string[] = []
  ) {
    this.$engageFireStore = engageFirestore(collection);
    this.$collectionsList = collections;
    if (!_.isEmpty($doc) && ($doc.$id || $doc.id || this.$id)) {
      _.assign(this, $doc);
      this.$$init();
    }
  }

  async $$init() {
    await this.$engageFireStore.ready();
    this.$id = this.$doc.$id || this.$doc.id || this.$id;
    this.$ref = this.$engageFireStore.ref;
    this.$path = `${this.$ref.path}/${this.$id}`;
    this.$collection = this.$ref.path;

    if (this.$collectionsList && !this.$collectionsList.forEach) return;
    (this.$collectionsList || []).forEach(element => {
      const [sub, preFetch] = element.split('.');
      this.$collections[`${sub}_`] = engageFirestore(`${this.$path}/${sub}`);
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
    return await this.$engageFireStore.uploadFiles(this, elements, inputId);
  }

  async $setImage(options?: { width: string; height: string; thumbnail: { width: string; height: string; }; } | undefined, inputId?: any, file?: any) {
    this.$$updateDoc();
    return await this.$engageFireStore.uploadImage(this, inputId, file);
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
    return await this.$engageFireStore.downloadFile(fileDoc.url);
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

  async $getSubCollection(collection: string, db?: any): Promise<EngageFirestore> {
    return engageFirestore(`${this.$path}/${this.$id}/${collection}`, db);
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
    await this.$swapPosition(index, index-1, list);
  }

  async $moveDown() {
    const list = this.$$getSortedParentList();
    const index = list.findIndex(item => item.position === this.position);
    if (index >= list.length - 1) {
      return;
    }
    await this.$swapPosition(index, index + 1, list);
  }

  $$getSortedParentList() {
    return this.$engageFireStore.sortListByPosition().list;
  }

  $$updateDoc(doc = this) {
    this.$doc = this.$engageFireStore.omitFire(_.cloneDeep(doc));
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
}