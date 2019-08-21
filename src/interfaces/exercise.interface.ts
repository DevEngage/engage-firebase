import IEquipmentItem from "./equipment-item.interface";
import { IEngageImage, IEngageBase } from "./engage.interface";

export default interface IExercise extends IEngageImage, IEngageBase {
    name?: string; // { type: String, required: true, unique: true },
    action?: string; // { type: String },
    past?: string; // { type: String },
    calories?: number; // { type: Number, default: 0 },
    duration?: number; // { type: Number },
    distance?: number; // { type: Number },
    incline?: number; // { type: Number },
    speed?: string | number; // { type: [Schema.Types.Mixed] },
    multiplier?: number;
    type?: string; // { type: String, },
    reps?: number; // { type: Number, },
    sets?: number; // { type: Number, },
    version?: number; // { type: Number },
    isPublic?: string; // { type: Boolean, default: false },
    fitnessPoints?: number; // { type: Number, default: 0 },
    
    intensity?: string; // { type: [String], },
    difficulty?: string; // { type: String },
    tags?: [string]; // { type: [String] },
    benefits?: [string]; // { type: [String] },

    equipment?: [IEquipmentItem];

    alternatives?: [IExercise];
 }