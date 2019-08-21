import { IEngageBase, IEngageImage } from "./engage.interface";

export default interface IEquipmentItem extends IEngageImage, IEngageBase {
    name?: string;
    description?: string;
    weight?: number;
    weightType?: string;
    multiplier?: number;

    alternatives?: [IEquipmentItem];

    $thumb?: string;
    $image?: string;

    caloriesBurned?: number;
}