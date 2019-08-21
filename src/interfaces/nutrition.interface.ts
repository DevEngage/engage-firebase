import { IEngageBase } from "./engage.interface";

export default interface INutrition extends IEngageBase {
    nutritionId?: string; // { type: String, required: true, unique: true },
    title?: string; // { type: String, },
    long?: string; // { type: String, },
    name?: string; // { type: String, },
    amount?: number; // { type: String },
    unit?: string; 
    usdaTag?: string; 
    attrId?: number; // { type: Number },
    fdaDailyValue?: number; // { type: Number },
    percentOfDailyNeeds?: number; // { type: Number },
}