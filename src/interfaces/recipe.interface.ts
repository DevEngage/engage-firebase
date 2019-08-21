import IIngredient from "./ingredient.interface";
import IDirection from "./direction.interface";
import { IEngageImage, IEngageBase, IEngageMacros } from "./engage.interface";

export default interface IRecipe extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true, unique: true },
    type?: string; // { type: String, },
    description?: string; // { type: String, },
    isFree?: boolean; // { type: String, },
    isPublic?: boolean; // { type: String, },

    cost?: number;
    
    servings?: string; // { type: String, },
    difficulty?: string; // { type: String, },'
    version?: number;

    prepTime?: number; // { type: Number, required: true },
    cookTime?: number; // { type: Number, required: true },
    timeToEat?: number; // { type: Number, required: true },
    fitnessPoints?: number; // { type: Number, required: true },

    tags?: [string];
    cuisines?: [string];
    diets?: [string];
    benefits?: [string];

    facts?: [any];

    ingredients?: [IIngredient];
    directions?: [IDirection];
    alternatives?: [IRecipe];
}