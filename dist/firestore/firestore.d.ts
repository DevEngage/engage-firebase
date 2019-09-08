import * as firebase from 'firebase/app';
import EngageFirestoreBase from './firestore.base';
export default class EngageFirestore extends EngageFirestoreBase {
    path: string;
    constructor(path: string);
    init(): Promise<void>;
    createFileInput(multi?: boolean, accept?: string): any;
    handleUpload(uploadTask: firebase.storage.UploadTask, doc: any, fileName?: any): any;
    _handleFileUpload(element: any): Promise<unknown>;
    uploadFiles(doc: any, files?: any, id?: string): Promise<any[]>;
    uploadImage(doc: any, id?: string, file?: any): Promise<unknown>;
    downloadFile(fileUrl: string): Promise<unknown>;
    watchUser(cb: any): Promise<void>;
    getUserId(): Promise<string>;
    login(email: string, password: string): Promise<any>;
    loginSocial(service: any, method: string, scope?: any, mobile?: boolean): Promise<any>;
    signup(email: string, password: string): Promise<any>;
    logout(): Promise<any>;
    sendEmailVerification(): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    updatePassword(newPassword: any): Promise<any>;
    static __DOC__: any;
    static __ENGAGE_FIRE__: any;
    static __FIRE_OPTIONS__: any;
    static __STATE__: any;
}
export declare let engageFirestore: (path: string, options?: any) => any;
