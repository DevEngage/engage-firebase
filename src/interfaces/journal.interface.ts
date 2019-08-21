import { IEngageMacros, IEngageBase } from "./engage.interface";

export default interface IJournal extends IEngageBase, IEngageMacros {
    workout?: number; // { type: Number, required: true, default: 0 },
    food?: number; // { type: Number, required: true, default: 0 },
    date?: string; // { type: String, required: true },
    userId?: string; // { type: Schema.Types.ObjectId, required: true },
}