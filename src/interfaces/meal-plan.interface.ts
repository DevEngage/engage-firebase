import IMeal from "./meal.interface";
import IShoppingItem from "./shopping-item.interface";
import { IEngageMacros, IEngageBase, IEngageImage } from "./engage.interface";

export default interface IMealPlan extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true },
    tagline?: string; // { type: String, required: true },
    description?: string; // { type: String, required: true },
    cost?: number; // { type: String, required: true },
    price?: number; // { type: String, required: true },
    isFree?: boolean; // { type: String, required: true },
    isPublic?: boolean; // { type: String, required: true },
    
    meals?: [IMeal]; // collection
    shoppingList?: [IShoppingItem]; // collection
    
    recipes?: number; // { type: String, required: true },
    snacks?: number; // { type: String, required: true },
    
    version?: number; // { type: String, required: true },
    difficulty?: string; // { type: String, required: true },
    diets?: [string]; // { type: String, required: true },
    tags?: [string]; // { type: String, required: true },
    benefits?: [string]; // { type: String, required: true },

}