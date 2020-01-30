import EngageFire from './engagefire';
import EngageImage from './image';
import * as firebase from 'firebase/app';


declare let document: any;
declare let XMLHttpRequest: any;
type Blob = any;

export default class EngageFile {
    debug: boolean = EngageFire.debug || false;

    /*
     * FILES (FrontEnd)
     * */
    createFileInput(multi = false, accept?: string) {
        const id = 'eng-files';
        let input = document.getElementById(id);
        if (!input) {
            input = document.createElement("input");
        }
        input.setAttribute("style", "display: none;");
        input.setAttribute("type", "file");
        if (accept) {
            input.setAttribute("accept", "file");
        }
        if (multi) {
            input.setAttribute("multiple", "true");
        }
        input.setAttribute("name", "engage-files");
        input.setAttribute("id", "eng-files");
        //append to form element that you want .
        document.body.appendChild(input);
        return input;
    }

    handleUpload(uploadTask: firebase.storage.UploadTask, doc: any, fileName?: any) {
        let docType = 'image';
        if (doc.$path.includes('/files/')) docType = 'file';
        let uploadProgress = 0;
        let uploadState: firebase.storage.TaskState;
        const listeners: any[] = [];
        const notify = () => {
            listeners.forEach(item => {
                item({
                    uploadProgress,
                    uploadState,
                    fileName
                });
            });
        }
        if (doc && fileName) {
            doc.$getProgress = (cb: Function) => {
                listeners.push(cb);
            }
        }
        uploadTask.on('state_changed', function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            uploadProgress = progress;
            uploadState = snapshot.state;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
            if (fileName) notify();
        }, (error) => {
            console.error(error);
            // Handle unsuccessful uploads
        }, async () => {
            const { state, metadata } = uploadTask.snapshot;
            const { name, size } = metadata;

            if (doc && doc.$doc && docType === 'image') {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                if (doc.$doc.$image === undefined) {
                    delete doc.$image;
                }
                if (downloadURL) {
                    if (!fileName) {
                        doc.$doc.$thumb = downloadURL;
                        await doc.$save();
                        return;
                    }
                    doc.$doc.$image = downloadURL;
                }
                // doc.$thumbnail = snapshot.downloadURL;
                doc.$doc.$imageMeta = {
                    name,
                    storagePath: doc.$path + '$image' + name,
                    original: downloadURL,
                    state,
                    size,
                };
                if (doc.$doc.$imageMeta && doc.$doc.$imageMeta.original === undefined) {
                    delete doc.$doc.$imageMeta.original;
                }
                await doc.$save();
            }

            if (doc && doc.$doc && docType === 'file') {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                if (downloadURL) {
                    doc.$doc.$file = downloadURL;
                }
                doc.$doc.meta = {
                    name,
                    storagePath: doc.$path + '/' + name,
                    original: downloadURL,
                    state,
                    size,
                };
                if (doc.$doc.meta && doc.$doc.meta.original === undefined) {
                    delete doc.$doc.meta.original;
                }
                await doc.$save();
            }
        });
        return doc;
    }

    _handleFileUpload(element: any) {
        element.click();
        return new Promise((resolve) => {
            element.addEventListener('change', async () => {
                if (element && element.files && element.files.length) {
                    resolve(element.files || []);
                } else {
                    resolve([]);
                }
            });
        })
    }

    async uploadFiles(doc: any, files: any = [], id?: string) {
        if (this.debug) console.log('File Upload:', files);
        const storageRef = EngageFire.storage.ref().child(doc.$path);
        const element: any = id ? document.getElementById(id) : this.createFileInput();
        const uploaded = [];
        if (!doc) return uploaded;
        const docFileCollection = await doc.$getSubCollection('files');
        await docFileCollection.ready();
        files = await this._handleFileUpload(element);
        if (files && files.length) {
            files = files || element.files;
            for (let i = 0; i < files.length; i++) {
                const file: any = files[i];
                if ('name' in file) {
                    let preFile;
                    try {
                        preFile = await docFileCollection.save({
                            name: file.name
                        });
                    } catch (error) {
                        console.error('Engage file upload:', error);
                    }
                    const snapshot: any = storageRef
                        .child('files')
                        .child(preFile.$id)
                        .child(file.name)
                        .put(file);
                    if (preFile && snapshot) {
                        preFile = await this.handleUpload(snapshot, preFile, file.name);
                        preFile = {
                            ...preFile,
                            url: snapshot.downloadURL,
                            meta: {
                                storagePath: doc.$path + '/files/' + preFile.$id + '/' + file.name,
                                state: snapshot.state
                            }
                        };
                        uploaded.push(snapshot);
                    }
                }
            }
            return uploaded;
        }
        return uploaded;
    }

    async uploadImage(doc: any, id?: string, file?: any) {
        const storageRef = EngageFire.storage.ref().child(doc.$path);
        const element: any = id ? document.getElementById(id) : this.createFileInput();
        element.click();
        return new Promise((resolve, reject) => {
            element.addEventListener('change', async () => {
                if ((element && element.files && element.files.length) || file) {
                    const _file = file || element.files[0];
                    const [blob, thumbBlob]: [Blob, Blob] = await new EngageImage().rezieImageWithThumb(_file, doc);
                    if ('name' in _file) {
                        // txt += "name: " + file.name + "<br>";
                        const snapshot = storageRef
                            .child('$image')
                            .child(_file.name)
                            .put(blob);

                        const snapshotThumb = storageRef
                            .child('$thumb')
                            .child(_file.name)
                            .put(thumbBlob);

                        doc = await this.handleUpload(snapshot, doc, _file.name);
                        doc = await this.handleUpload(snapshotThumb, doc);
                    }
                } else {
                    reject('Missing File(s)');
                }
                resolve(doc);
            });
        })
    }

    downloadFile(fileUrl: string) {
        return new Promise((resolve) => {
            // This can be downloaded directly:
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = () => {
                let blob = xhr.response;
                resolve(blob);
            };
            xhr.open('GET', fileUrl);
            xhr.send();
        });
    }
}
