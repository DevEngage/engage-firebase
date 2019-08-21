import IIngredient from "./ingredient.interface";
import { IEngageImage, IEngageBase } from "./engage.interface";

export default interface IProduct extends IEngageImage, IEngageBase {
    name?: string; // { type: String, required: true },
    type?: string; // { type: String, required: true },
    restaurantChain?: string; // { type: String, required: true },
    images?: [string]; // { type: Schema.Types.ObjectId, required: true },

    servingSize?: string; // { type: Number, required: true, default: 0 },
    numberOfServings?: any; // { type: Number, required: true, default: 0 },
    estimatedCost?: any; // { type: Number, required: true, default: 0 },

    importantBadges?: [string]; // { type: Number, required: true, default: 0 },
    badges?: [string]; // { type: Number, required: true, default: 0 },
    breadcrumbs?: [string]; // { type: Schema.Types.ObjectId, required: true },
    price?: string | number; // { type: Schema.Types.ObjectId, required: true },

    ingredientList?: string | [string]; // { type: Schema.Types.ObjectId, required: true },
    ingredients?: [IIngredient];

    spoonacularId?: any; // { type: Number, required: true, default: 0 },

}