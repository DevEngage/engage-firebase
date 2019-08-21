import INutrition from "./nutrition.interface";
import { IEngageMacros, IEngageBase, IEngageImage } from "./engage.interface";

export default interface IFood extends IEngageImage, IEngageBase, IEngageMacros {
    name?: string; // { type: String, required: true, unique: true },
    type?: string; // { type: String, },
    brandName?: string; // { type: String, },
    unit?: string; // { type: String },
    locale?: string; // { type: String },
    servings?: string; // { type: String, },

    price?: {
        value?: number;
        unit?: string;
    };
    
    nutrients?: INutrition[];
    caloricBreakdown: {
        percentProtein?: number;
        percentFat?: number;
        percentCarbs?: number;
    };

    spoonacularId?: number; // { type: Number },
}