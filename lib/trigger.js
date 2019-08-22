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
// import { firestore } from 'firebase-admin';
const functions = require("firebase-functions");
const algolia_1 = require("../utilities/algolia");
class Trigger {
    constructor(path, collection, collections = []) {
        this.path = path;
        this.collection = collection;
        this.collections = collections;
        this.searchEnabled = false;
        this.ref = functions.firestore.document(this.path);
    }
    enableSearch() {
        this.searchEnabled = true;
        return this;
    }
    onWrite(cb) {
        return this.ref.onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
            if (!change.before.exists)
                return null;
            const id = context.params.id;
            const subId = context.params.subId;
            const data = change.after.data();
            const previousData = change.before.data();
            const algoliaExport = new algolia_1.AlgoliaExport(this.collection, '/' + this.collection);
            if (id &&
                data &&
                (data.isApproved === undefined || data.isApproved) &&
                (data.isPublic === undefined || data.isPublic) &&
                data.info &&
                data.info.name) {
                let algoliaData = Object.assign({}, data, { objectID: id, $id: id });
                yield algoliaExport.once(algoliaData);
            }
            if (this.searchEnabled && id && data && (data.isPublic === undefined || data.isPublic) && data.isSearchDisabled) {
                algoliaExport.remove(id);
            }
            if (cb) {
                return yield cb({
                    data,
                    previousData,
                    id,
                    subId,
                    algoliaExport,
                });
            }
            return;
        }));
    }
    onDelete(cb) {
        return this.ref.onDelete((snap, context) => __awaiter(this, void 0, void 0, function* () {
            const data = snap.data();
            const id = context.params.id;
            const algoliaExport = new algolia_1.AlgoliaExport(this.collection, '/' + this.collection);
            if (cb) {
                yield cb({
                    data,
                    id,
                    algoliaExport,
                });
            }
            if (this.searchEnabled)
                algoliaExport.remove(id);
            return 'done';
        }));
    }
}
exports.default = Trigger;
//# sourceMappingURL=trigger.js.map