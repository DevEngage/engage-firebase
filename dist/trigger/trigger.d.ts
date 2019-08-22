import * as functions from 'firebase-functions';
import { DocumentBuilder } from 'firebase-functions/lib/providers/firestore';
export default class Trigger {
    path: string;
    collection: string;
    collections: string[];
    ref: DocumentBuilder;
    searchEnabled: boolean;
    constructor(path: string, collection: string, collections?: string[]);
    enableSearch(): this;
    onWrite(cb?: any): functions.CloudFunction<functions.Change<FirebaseFirestore.DocumentSnapshot>>;
    onDelete(cb?: any): functions.CloudFunction<FirebaseFirestore.DocumentSnapshot>;
}
