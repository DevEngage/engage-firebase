import IEquipmentItem from "./equipment-item.interface";
import { IEngageImage, IEngageBase } from "./engage.interface";

export interface IWorkoutItem extends IEngageImage, IEngageBase {
    name?: string; // { type: String, required: true, unique: true },
    workoutId?: string;
    order?: number; // { type: Number, required: true },
    week?: number; // { type: Number, required: true, default: 1 },
    day?: number; // { type: Number, required: true, default: 1, max: 7, min: 1 },
    section?: string; // breakfast, lunch, dinner, snack, custom
    group?: string; // { type: String, required: true },

    video?: string; // { type: String },
    animated?: boolean; // { type: String },

    equipment?: [IEquipmentItem]; // collection

    alternatives?: [IWorkoutItem]; // collection

    caloriesBurned: number;
}