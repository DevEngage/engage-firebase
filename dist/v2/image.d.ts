declare let Blob: any;
declare type File = any;
declare type Blob = any;
export default class EngageImage {
    maxSize: number;
    thumb: number;
    uploadImageOptions: {
        width: string;
        height: string;
        thumbnail: {
            width: string;
            height: string;
        };
    };
    constructor(maxSize?: number, thumb?: number);
    rezieImageWithThumb(file: File, field: any): Promise<[Blob, Blob]>;
    resize(file: File, field: any): Promise<Blob>;
}
export {};
