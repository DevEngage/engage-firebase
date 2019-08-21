import IRecipe from "./recipe.interface";
import IFood from "./food.interface";
import { IEngageMacros, IEngageBase, IEngageImage } from "./engage.interface";

export default interface IMeal extends IEngageImage, IEngageBase, IEngageMacros {
    recipeId?: string; // { type: String, required: true },
    servings?: number; // { type: String, required: true },
    servingType?: string; // { type: String, required: true },
    order?: number; // { type: String, required: true },
    week?: number; // { type: String, required: true },
    day?: number; // { type: String, required: true },
    section?: string; // { type: String, required: true },
    alternatives?: [string]; // { type: String, required: true },

    items: [IRecipe | IFood]

}