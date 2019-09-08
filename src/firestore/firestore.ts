import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { engageFireInit } from '../engagefire/engagefire';
import { EngageAlgolia } from '../algolia/algolia';
import { EngageImage } from "../image/image";
import EngageFirestoreBase from './firestore.base';

declare let document: any;
declare let XMLHttpRequest: any;
type Blob = any;

/*
 * TODO:
 * [X] Show upload progress
 * [X] Handle file uploads better
 * [X] Add types (models) to doc in class
 * */
export default class EngageFirestore extends EngageFirestoreBase {

  constructor(
    public path: string
  ) {
    super(path);
  }

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

      if (doc) {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        if (doc.$image === undefined) {
          delete doc.$image;
        }
        if (downloadURL) {
          if (!fileName) {
            doc.$thumb = downloadURL;
            await doc.$save();
            return;
          }
          doc.$image = downloadURL;
        }
        // doc.$thumbnail = snapshot.downloadURL;
        doc.$imageMeta = {
          name,
          storagePath: doc.$path + '$image' + name,
          original: downloadURL,
          state,
          size,
        };
        if (doc.$imageMeta && doc.$imageMeta.original === undefined) {
          delete doc.$imageMeta.original;
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

  async uploadFiles(doc: any, files: any = [], id = 'eng-files') {
    if (this.debug) console.log('File Upload:', files);
    const storageRef = engageFireInit(EngageFirestore.fireOptions).storage.ref().child(doc.$path);
    const element: any = id ? document.getElementById(id) : this.createFileInput();
    const uploaded = [];
    if (!doc) return;
    const docFileCollection = doc.$getSubCollection('files');
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
          const snapshot: any = await storageRef
            .child('files')
            .child(preFile.$id)
            .child(file.name)
            .put(file);
          if (doc && snapshot) {
            doc = await this.handleUpload(snapshot, doc, file.name);
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
  }

  async uploadImage(doc: any, id?: string, file?: any) {
    const storageRef = engageFireInit(EngageFirestore.fireOptions).storage.ref().child(doc.$path);
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

  /* 
    Files (FrontEnd)
  */

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

  /* 
    AUTH (FrontEnd)
  */
  async login(email: string, password: string) {
    return await engageFireInit(EngageFirestore.fireOptions).auth.signInWithEmailAndPassword(email, password);
  }

  async loginSocial(service: any, method: string, scope?: any, mobile = false) {
    console.log('isMobile', mobile);
    let provider: any ;
    switch (service) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 'github':
        provider = new firebase.auth.GithubAuthProvider();
        break;
      default:
        provider = new firebase.auth.GoogleAuthProvider();
    }

    if (provider) provider.addScope(scope);

    if (method === 'popup') {
      return await engageFireInit(EngageFirestore.fireOptions).auth.signInWithPopup(provider);
    } else {
      return await engageFireInit(EngageFirestore.fireOptions).auth.signInWithRedirect(provider);
    }
  }

  async signup(email: string, password: string) {
    return await engageFireInit(EngageFirestore.fireOptions).auth.createUserWithEmailAndPassword(email, password);
  }

  async logout() {
    return await engageFireInit(EngageFirestore.fireOptions).auth.signOut();
  }

  async sendEmailVerification() {
    return await (<any>engageFireInit(EngageFirestore.fireOptions).auth).sendEmailVerification();
  }

  async forgotPassword(email: string) {
    return await engageFireInit(EngageFirestore.fireOptions).auth.sendPasswordResetEmail(email);
  }

  async updatePassword(newPassword: any) {
    return await (<any>engageFireInit(EngageFirestore.fireOptions).auth).updatePassword(newPassword);
  }

  search(query?: string, filters?: string, debug = false) {
    const index = EngageAlgolia.getIndex(<string>this.path);
    return index.search(query, filters, debug);
  }

}


// export EngageFirestore
export let engageFirestore = (path: string, options?: any) => EngageFirestore.getInstance(path, options);
