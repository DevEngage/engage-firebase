import { IEngageImage, IEngageBase, IEngageMacros } from "./engage.interface";

export default interface IMenuItem extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true },
    type?: string; // { type: String, required: true },
    restaurantChain?: string; // { type: String, required: true },
    breadcrumbs?: [string]; // { type: Schema.Types.ObjectId, required: true },

    servingSize?: string; // { type: Number, required: true, default: 0 },
    readableServingSize?: any; // { type: Number, required: true, default: 0 },
    numberOfServings?: any; // { type: Number, required: true, default: 0 },
    estimatedCost?: any; // { type: Number, required: true, default: 0 },

    spoonacularId?: any; // { type: Number, required: true, default: 0 },

}