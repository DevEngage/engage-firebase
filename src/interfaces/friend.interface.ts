import { IEngageBase } from "./engage.interface";

export default interface IFriend extends IEngageBase {
    firstName?: string;
    lastName?: string;
    progress?: string;

    team?: string; // teamID

    together?: boolean;
    teammate?: boolean;
}