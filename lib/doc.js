"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const firestore_1 = require("./firestore");
class EngageFireDoc {
    constructor($doc, collection, collections = []) {
        this.$doc = $doc;
        this.$loading = true;
        this.$collection = '';
        this.$collections = {};
        this.$collectionsList = [];
        this.$omitList = [];
        this.$engageFireStore = firestore_1.engageFirestore(collection);
        this.$collectionsList = collections;
        if (!lodash_1.default.isEmpty($doc) && ($doc.$id || $doc.id || this.$id)) {
            lodash_1.default.assign(this, $doc);
            this.$$init();
        }
    }
    $$init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$engageFireStore.ready();
            this.$id = this.$doc.$id || this.$doc.id || this.$id;
            this.$ref = this.$engageFireStore.ref;
            this.$path = `${this.$ref.path}/${this.$id}`;
            this.$collection = this.$ref.path;
            if (this.$collectionsList && !this.$collectionsList.forEach)
                return;
            (this.$collectionsList || []).forEach(element => {
                const [sub, preFetch] = element.split('.');
                this.$collections[`${sub}_`] = firestore_1.engageFirestore(`${this.$path}/${sub}`);
                this.$omitList.push(`${sub}_`);
                if (preFetch === 'list')
                    this.$collections[`${sub}_`].getList();
                lodash_1.default.assign(this, this.$collections);
            });
            this.$loading = false;
        });
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
    $get() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$doc = yield this.$engageFireStore.get(this.$id);
            return this.$doc;
        });
    }
    $attachOwner() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$owner = yield this.$engageFireStore.getUserId();
            this.$doc.$owner = this.$owner;
            this.$$updateDoc();
            this.$doc = yield this.$engageFireStore.save(this.$doc);
            return this.$doc;
        });
    }
    $isOwner(userId = this.$doc.$owner) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                yield this.$attachOwner();
            }
            return this.$owner === (yield this.$engageFireStore.getUserId());
        });
    }
    $addFiles(elements, inputId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$$updateDoc();
            return yield this.$engageFireStore.uploadFiles(this, elements, inputId);
        });
    }
    $setImage(options, inputId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$$updateDoc();
            return yield this.$engageFireStore.uploadImage(this, options, inputId, file);
        });
    }
    $removeImage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$$updateDoc();
            yield this.$engageFireStore.deleteImage(this.$doc);
            yield this.$save();
            return this.$doc;
        });
    }
    $removeFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$$updateDoc();
            yield this.$engageFireStore.deleteFile(this.$doc, fileId);
            return this.$doc;
        });
    }
    $getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.$getSubCollection('$files').getList();
        });
    }
    $getFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.$getSubCollection('$files').get(fileId);
        });
    }
    $downloadFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileDoc = yield this.$getSubCollection('$files').get(fileId);
            return yield this.$engageFireStore.downloadFile(fileDoc.url);
        });
    }
    $remove(showConfirm = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (showConfirm) {
                const r = confirm('Are you sure?');
                if (!r)
                    return;
            }
            const result = this.$engageFireStore.remove(this.$id);
            this.$engageFireStore.list = this.$engageFireStore.list.filter(item => item.$id !== this.$id);
            return result;
        });
    }
    $getSubCollection(collection, db) {
        return __awaiter(this, void 0, void 0, function* () {
            return firestore_1.engageFirestore(`${this.$path}/${this.$id}/${collection}`, db);
        });
    }
    $watch(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.$engageFireStore.watch(this.$id, cb);
        });
    }
    $watchPromise() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.$engageFireStore.watchPromise(this.$id);
        });
    }
    $backup(deep, backupPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$$updateDoc();
            return yield this.$engageFireStore.backupDoc(this.$doc, deep, backupPath);
        });
    }
    $exists() {
        this.$$updateDoc();
        return !!this.$doc;
    }
    $getModel() {
        return this.$engageFireStore.getModel();
    }
    $changeId(newId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$engageFireStore.replaceIdOnCollection(this.$id, newId);
            this.$id = newId;
            this.$$updateDoc();
        });
    }
    $swapPosition(x, y, list) {
        return __awaiter(this, void 0, void 0, function* () {
            list = list || this.$$getSortedParentList();
            if (list.some((item) => item.position === undefined)) {
                yield this.$engageFireStore.buildListPositions();
            }
            const itemX = list[x];
            const itemY = list[y];
            const itemXPos = itemX.position || x + 1;
            const itemYPos = itemY.position || y + 1;
            itemX.position = itemYPos;
            itemY.position = itemXPos;
            this.$engageFireStore.list[y] = itemX;
            this.$engageFireStore.list[x] = itemY;
            yield itemX.$save();
            yield itemY.$save();
        });
    }
    $moveUp() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = this.$$getSortedParentList();
            const index = list.findIndex(item => item.position === this.position);
            if (index <= 0) {
                return;
            }
            yield this.$swapPosition(index, index - 1, list);
        });
    }
    $moveDown() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = this.$$getSortedParentList();
            const index = list.findIndex(item => item.position === this.position);
            if (index >= list.length - 1) {
                return;
            }
            yield this.$swapPosition(index, index + 1, list);
        });
    }
    $$getSortedParentList() {
        return this.$engageFireStore.sortListByPosition().list;
    }
    $$updateDoc(doc = this) {
        this.$doc = this.$engageFireStore.omitFire(lodash_1.default.cloneDeep(doc));
        return this.$doc;
    }
    $$difference(object, base) {
        function changes(object, base) {
            return lodash_1.default.transform(object, (result, value, key) => {
                if (!lodash_1.default.isEqual(value, base[key])) {
                    result[key] = lodash_1.default.isObject(value) && lodash_1.default.isObject(base[key]) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    }
}
exports.default = EngageFireDoc;
//# sourceMappingURL=doc.js.map