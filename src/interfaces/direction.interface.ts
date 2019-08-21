import { IEngageBase } from "./engage.interface";

export default interface IDirection extends IEngageBase {
    text?: string; // { type: String, required: true, unique: true },
    type?: string; // { type: String, },
    optional?: boolean; // { type: String, },
    position?: number; // { type: String, },

    alternatives?: [IDirection];
}