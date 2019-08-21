import { IEngageBase } from "./engage.interface";

export default interface IFeedback extends IEngageBase {
    msg?: string; // { type: String },
    userId?: string; // { type: String },
}