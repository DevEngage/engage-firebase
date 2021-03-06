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
/*
 * TODO:
 * [ ] resize image
 * [ ] change image quality
 * [ ]
 * */
class EngageImage {
    // defaultQaulity = '1000';
    constructor(maxSize = 1000, thumb = 200) {
        this.maxSize = maxSize;
        this.thumb = thumb;
        this.uploadImageOptions = {
            width: '1000px',
            height: '1000px',
            thumbnail: {
                width: '100px',
                height: '100px'
            }
        };
    }
    rezieImageWithThumb(file, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.resize(file, Object.assign({ max: this.maxSize }, field));
            const thumb = yield this.resize(file, { max: this.thumb });
            return [image, thumb];
        });
    }
    resize(file, field) {
        // ctx.mozImageSmoothingEnabled = false;
        // ctx.imageSmoothingQuality = "Medium";
        // ctx.webkitImageSmoothingEnabled = false;
        // ctx.msImageSmoothingEnabled = false;
        // ctx.imageSmoothingEnabled = false;
        const maxSize = field.max || this.maxSize;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');
        const dataURItoBlob = (dataURI) => {
            const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                atob(dataURI.split(',')[1]) :
                unescape(dataURI.split(',')[1]);
            const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const max = bytes.length;
            const ia = new Uint8Array(max);
            for (let i = 0; i < max; i++)
                ia[i] = bytes.charCodeAt(i);
            return new Blob([ia], { type: mime });
        };
        const resize = () => {
            let width = image.width;
            let height = image.height;
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            }
            else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            let dataUrl = canvas.toDataURL(file.type);
            return dataURItoBlob(dataUrl);
        };
        return new Promise((resolve, reject) => {
            if (!file.type.match(/image.*/)) {
                reject(new Error("Not an image"));
                return file;
            }
            reader.onload = (readerEvent) => {
                image.onload = () => resolve(resize());
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
}
exports.EngageImage = EngageImage;
//# sourceMappingURL=image.js.map