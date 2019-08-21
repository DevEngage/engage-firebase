import { IEngageBase } from "./engage.interface";

export default interface IWeightJournal extends IEngageBase {
    amount?: string; // { type: String, },
    feeling?: string; // { type: String, },
    userId?: string;
}