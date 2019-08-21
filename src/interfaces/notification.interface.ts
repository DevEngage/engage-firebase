import { IEngageImage, IEngageBase } from "./engage.interface";

export default interface INotification extends IEngageImage, IEngageBase {
    msg?: string; // { type: String, required: true },
    type?: string; // { type: String, required: true },
    action?: string; // { type: String, required: true },
    push?: string; // { type: String, required: true },
    userId?: string; // { type: String, required: true },
    path?: string;
    meta?: any;
}