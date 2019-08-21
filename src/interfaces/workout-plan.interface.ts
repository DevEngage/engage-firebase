import IEquipmentItem from "./equipment-item.interface";
import { IEngageImage, IEngageBase } from "./engage.interface";
import { IWorkoutItem } from "./workout-item.interface";

export default interface IWorkoutPlan extends IEngageImage, IEngageBase {
    name?: string; // { type: String, required: true, unique: true },
    tagline?: string;
    description?: string;
    timeNeeded?: number; // { type: Number, required: true },
    equipmentNeeded?: number; // { type: Number, required: true, default: 1 },

    cost?: number; // { type: String, required: true },
    price?: number; // { type: String, required: true },
    isFree?: boolean; // { type: String, required: true },
    isPublic?: boolean; // { type: String, required: true },
    gymRequired?: boolean; // { type: String, required: true },
    
    workouts?: [IWorkoutItem]; // collection
    
    version?: number;
    difficulty?: string;
    diet?: [string]; // { type: String, required: true },
    tags?: [string];
    benefits?: [string];

    alternatives?: [IWorkoutPlan]; // Collection

    caloriesBurned: number;
}