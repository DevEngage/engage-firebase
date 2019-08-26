
declare let canvas: any;
declare let ctx: any;
declare let FileReader: any;
declare let Image: any;
declare let document: any;
declare let Blob: any;
declare let atob: any;
type File = any;
type Blob = any;

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

/*
 * TODO:
 * [ ] resize image
 * [ ] change image quality
 * [ ]
 * */
export class EngageImage {

  uploadImageOptions = {
    width: '1000px',
    height: '1000px',
    thumbnail: {
      width: '100px',
      height: '100px'
    }
  };

  // defaultQaulity = '1000';
  constructor(public maxSize = 1000, public thumb = 200) {

  }

  async rezieImageWithThumb(file: File, field: any): Promise<[Blob, Blob]> {
    const image = await this.resize(file, {max: this.maxSize, ...field});
    const thumb = await this.resize(file, {max: this.thumb});
    return [image, thumb];
  }

  resize(file: File, field: any): Promise<Blob> {
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.imageSmoothingQuality = "Medium";
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    // ctx.imageSmoothingEnabled = false;

    const maxSize = field.max || this.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas: any = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
      const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) :
        unescape(dataURI.split(',')[1]);
      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], {type:mime});
    };
    const resize = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
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

      reader.onload = (readerEvent: any) => {
        image.onload = () => resolve(resize());
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    })
  }
}
