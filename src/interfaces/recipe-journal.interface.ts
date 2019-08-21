import IIngredient from "./ingredient.interface";
import { IEngageMacros, IEngageImage, IEngageBase } from "./engage.interface";

export default interface IRecipeJournal extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true, unique: true },
    type?: string; // { type: String, },
    servings?: string; // { type: String, },

    ingredients?: [IIngredient];

    userId?: string;
}