export interface IEngageImage {
    $thumb?: string;
    $image?: string;
    $imageMeta?: string;
}

export interface IEngageBase {
    updatedAt?: number;
    createdAt?: number;
    $id?: string;
    $collection?: string;
}

export interface IEngageMacros {
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
}