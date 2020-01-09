import * as firebase from 'firebase/app';
export default class EngageFile {
    debug: boolean;
    createFileInput(multi?: boolean, accept?: string): any;
    handleUpload(uploadTask: firebase.storage.UploadTask, doc: any, fileName?: any): any;
    _handleFileUpload(element: any): Promise<unknown>;
    uploadFiles(doc: any, files?: any, id?: string): Promise<any[]>;
    uploadImage(doc: any, id?: string, file?: any): Promise<unknown>;
    downloadFile(fileUrl: string): Promise<unknown>;
}
