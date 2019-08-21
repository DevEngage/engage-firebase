import { IEngageMacros } from "./engage.interface";

export default interface IShoppingItem extends IEngageImage, IEngageBase, IEngageMacros {
    foodId?: string; // { type: String, required: true },
    amount?: number; // { type: String, required: true },
    amountType?: string; // { type: String, required: true },
    order?: number; // { type: String, required: true },
    week?: number; // { type: String, required: true },
    day?: number; // { type: String, required: true },

    alternatives?: [string]; // { type: String, required: true },
}