import IMealPlan from "./meal-plan.interface";
import IWorkoutPlan from "./workout-plan.interface";
import { IEngageImage, IEngageBase, IEngageMacros } from "./engage.interface";

export default interface IPlan extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true },
    tagline?: string; // { type: String, required: true },
    description?: string; // { type: String, required: true },
    cost?: number; // { type: String, required: true },
    price?: number; // { type: String, required: true },
    isFree?: boolean; // { type: String, required: true },
    isPublic?: boolean; // { type: String, required: true },
    gymRequired?: boolean; // { type: String, required: true },

    mealPlan?: IMealPlan;
    workoutPlan?: IWorkoutPlan;

    workoutStartTime?: string;
    weightLossRate?: number;
    version?: number; // { type: String, required: true },

    recipes?: number; // { type: String, required: true },
    snacks?: number; // { type: String, required: true },
    workouts?: number; // { type: String, required: true },

    tags?: [string]; // { type: String, required: true },
    benefits?: [string]; // { type: String, required: true },
    diet?: [string]; // { type: String, required: true },
    difficulty?: string; // { type: String, required: true },
    
    caloriesBurned?: number; // { type: Number, required: true, default: 0 },
}