import { IEngageImage, IEngageBase } from "./engage.interface";

export default interface IProfile extends IEngageImage, IEngageBase {
    userId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    birthYear?: string;
    gender?: string;
    height?: string;
    heightType?: string;
    weight?: number;
    weightType?: string;
    public?: boolean;
}