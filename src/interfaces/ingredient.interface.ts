import { IEngageMacros, IEngageImage, IEngageBase } from "./engage.interface";

export default interface IIngredient extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true, unique: true },
    type?: string; // { type: String, },
    servings?: string; // { type: String, },
    amount?: string; // { type: String, },
    units?: string; // { type: String, },
    style?: string; // { type: String, },
    brandName?: string; // { type: String, },
    description?: string; // { type: String, },
    safetyLevel?: string; // { type: String, },
    
    foodId?: string; // { type: String },
    
    tags?: [string]; // { type: String, },
    alternatives?: [IIngredient];
}