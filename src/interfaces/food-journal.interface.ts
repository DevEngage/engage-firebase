import { IEngageMacros, IEngageBase, IEngageImage } from "./engage.interface";

export default interface IFoodJournal extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true, unique: true },
    type?: string; // { type: String, },
    servings?: string; // { type: String, },
    foodId?: string; // { type: String },
    
}