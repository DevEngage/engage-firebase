import EngageFirestore, { engageFirestore } from "./firestore/firestore";
import EngageFireDoc from "./doc/doc";
import EngageModel, { IEngageModel } from "./model/model";
import { IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc } from "./interfaces/firebase.interface";
import { EngageAlgolia } from "./algolia/algolia";
import { EngageImage } from "./image/image";
import { adminModel } from "./models/admin.model";

const firestore = engageFirestore;
const Doc = EngageFireDoc;

export default engageFirestore;
export {
    // Frontend
    firestore,
    EngageFirestore,
    Doc,
    EngageFireDoc,
    EngageModel,
    EngageAlgolia,
    EngageImage,
    adminModel,
    // Interfaces
    IEngageFirebase,
    IEngageFirebaseObject,
    IEngageImage,
    IEngageFirebaseCollection,
    IEngageFirebaseDoc,
    IEngageModel,
}