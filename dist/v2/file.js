"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var engagefire_1 = require("./engagefire");
var image_1 = require("./image");
var firebase = require("firebase/app");
var EngageFile = /** @class */ (function () {
    function EngageFile() {
        this.debug = engagefire_1.default.debug || false;
    }
    /*
     * FILES (FrontEnd)
     * */
    EngageFile.prototype.createFileInput = function (multi, accept) {
        if (multi === void 0) { multi = false; }
        var id = 'eng-files';
        var input = document.getElementById(id);
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
    };
    EngageFile.prototype.handleUpload = function (uploadTask, doc, fileName) {
        var _this = this;
        var uploadProgress = 0;
        var uploadState;
        var listeners = [];
        var notify = function () {
            listeners.forEach(function (item) {
                item({
                    uploadProgress: uploadProgress,
                    uploadState: uploadState,
                    fileName: fileName
                });
            });
        };
        if (doc && fileName) {
            doc.$getProgress = function (cb) {
                listeners.push(cb);
            };
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
            if (fileName)
                notify();
        }, function (error) {
            console.error(error);
            // Handle unsuccessful uploads
        }, function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, state, metadata, name, size, downloadURL;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = uploadTask.snapshot, state = _a.state, metadata = _a.metadata;
                        name = metadata.name, size = metadata.size;
                        if (!(doc && doc.$doc)) return [3 /*break*/, 6];
                        return [4 /*yield*/, uploadTask.snapshot.ref.getDownloadURL()];
                    case 1:
                        downloadURL = _b.sent();
                        if (doc.$doc.$image === undefined) {
                            delete doc.$image;
                        }
                        if (!downloadURL) return [3 /*break*/, 4];
                        if (!!fileName) return [3 /*break*/, 3];
                        doc.$doc.$thumb = downloadURL;
                        return [4 /*yield*/, doc.$save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                    case 3:
                        doc.$doc.$image = downloadURL;
                        _b.label = 4;
                    case 4:
                        // doc.$thumbnail = snapshot.downloadURL;
                        doc.$doc.$imageMeta = {
                            name: name,
                            storagePath: doc.$path + '$image' + name,
                            original: downloadURL,
                            state: state,
                            size: size,
                        };
                        if (doc.$doc.$imageMeta && doc.$doc.$imageMeta.original === undefined) {
                            delete doc.$doc.$imageMeta.original;
                        }
                        return [4 /*yield*/, doc.$save()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        return doc;
    };
    EngageFile.prototype._handleFileUpload = function (element) {
        var _this = this;
        element.click();
        return new Promise(function (resolve) {
            element.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (element && element.files && element.files.length) {
                        resolve(element.files || []);
                    }
                    else {
                        resolve([]);
                    }
                    return [2 /*return*/];
                });
            }); });
        });
    };
    EngageFile.prototype.uploadFiles = function (doc, files, id) {
        if (files === void 0) { files = []; }
        return __awaiter(this, void 0, void 0, function () {
            var storageRef, element, uploaded, docFileCollection, i, file, preFile, error_1, snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.debug)
                            console.log('File Upload:', files);
                        storageRef = engagefire_1.default.storage.ref().child(doc.$path);
                        element = id ? document.getElementById(id) : this.createFileInput();
                        uploaded = [];
                        if (!doc)
                            return [2 /*return*/, uploaded];
                        return [4 /*yield*/, doc.$getSubCollection('files')];
                    case 1:
                        docFileCollection = _a.sent();
                        return [4 /*yield*/, docFileCollection.ready()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._handleFileUpload(element)];
                    case 3:
                        files = _a.sent();
                        if (!(files && files.length)) return [3 /*break*/, 12];
                        files = files || element.files;
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < files.length)) return [3 /*break*/, 11];
                        file = files[i];
                        if (!('name' in file)) return [3 /*break*/, 10];
                        preFile = void 0;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, docFileCollection.save({
                                name: file.name
                            })];
                    case 6:
                        preFile = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Engage file upload:', error_1);
                        return [3 /*break*/, 8];
                    case 8:
                        snapshot = storageRef
                            .child('files')
                            .child(preFile.$id)
                            .child(file.name)
                            .put(file);
                        if (!(doc && snapshot)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.handleUpload(snapshot, doc, file.name)];
                    case 9:
                        doc = _a.sent();
                        preFile = __assign({}, preFile, { url: snapshot.downloadURL, meta: {
                                storagePath: doc.$path + '/files/' + preFile.$id + '/' + file.name,
                                state: snapshot.state
                            } });
                        uploaded.push(snapshot);
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 4];
                    case 11: return [2 /*return*/, uploaded];
                    case 12: return [2 /*return*/, uploaded];
                }
            });
        });
    };
    EngageFile.prototype.uploadImage = function (doc, id, file) {
        return __awaiter(this, void 0, void 0, function () {
            var storageRef, element;
            var _this = this;
            return __generator(this, function (_a) {
                storageRef = engagefire_1.default.storage.ref().child(doc.$path);
                element = id ? document.getElementById(id) : this.createFileInput();
                element.click();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        element.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
                            var _file, _a, blob, thumbBlob, snapshot, snapshotThumb;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!((element && element.files && element.files.length) || file)) return [3 /*break*/, 5];
                                        _file = file || element.files[0];
                                        return [4 /*yield*/, new image_1.default().rezieImageWithThumb(_file, doc)];
                                    case 1:
                                        _a = _b.sent(), blob = _a[0], thumbBlob = _a[1];
                                        if (!('name' in _file)) return [3 /*break*/, 4];
                                        snapshot = storageRef
                                            .child('$image')
                                            .child(_file.name)
                                            .put(blob);
                                        snapshotThumb = storageRef
                                            .child('$thumb')
                                            .child(_file.name)
                                            .put(thumbBlob);
                                        return [4 /*yield*/, this.handleUpload(snapshot, doc, _file.name)];
                                    case 2:
                                        doc = _b.sent();
                                        return [4 /*yield*/, this.handleUpload(snapshotThumb, doc)];
                                    case 3:
                                        doc = _b.sent();
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        reject('Missing File(s)');
                                        _b.label = 6;
                                    case 6:
                                        resolve(doc);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    EngageFile.prototype.downloadFile = function (fileUrl) {
        return new Promise(function (resolve) {
            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                var blob = xhr.response;
                resolve(blob);
            };
            xhr.open('GET', fileUrl);
            xhr.send();
        });
    };
    return EngageFile;
}());
exports.default = EngageFile;
//# sourceMappingURL=file.js.map