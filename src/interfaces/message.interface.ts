import { IEngageBase } from "./engage.interface";

export default interface IMessage extends IEngageBase {
    text?: string; // { type: String, required: true },
    users?: [string]; // { type: String, required: true },
}