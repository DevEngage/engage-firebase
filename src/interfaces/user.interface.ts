import { IEngageImage, IEngageBase } from "./engage.interface";

export default interface IUser extends IEngageBase {
    email?: string;
    goal?: {
        weight?: number;
        weightType?: string; // { type: String, default: 'lb' },
        exerciseType?: string; // { type: String, default: 'minutes' },
        exerciseAmount?: number; // { type: Number, default: 0 },
    },

    plan: {
        name: string; // { type: String, default: 'Lose Weight' },
        calories: number; // { type: Number, default: 1800 },
        protein: number; // { type: Number, default: 100 },
        carbs: number; // { type: Number, default: 50 },
        fat: number; // { type: Number, default: 100 }
    },
}