
// groups
export interface IGroup {
    name?: string;
    legalName?: string;
    type?: string; // business, influencer
    description?: string;
    admins?: string[];
}

// groups/id/workouts
export interface IEngageRef {
    name?: string;
    $id?: string;
    $collection?: string;
    $ref?: string; // firebase ref
    $updatedAt?: string;
    $createdAt?: string;

    $owner?: string;
    $image?: string;
    $thumb?: string;
}

// workouts/id
export interface IWorkout {
    name?: string;
    company?: string;
    groupId?: string; // if group made
    userId?: string; // if user made
    tags: string[];
    price: number;
    description?: string;
}

// workouts/id/exercises
export interface IExercise {
    name?: string;
    videos?: []
    burned?: number;
    time?: number;
    description?: string;
    burnPerMin?: number;

    sets?: number;
    reps?: number;
}

// workouts/id/schedule
export interface ISchedule {
    name?: string;
    week?: number;
    day?: number;
    description?: string;
}

// workouts/id/videos
export interface IVideo {
    name?: string;
    url?: string;
    source?: string; // youtube, vimeo
    quality?: {
        low?: string;
        medium?: string;
        high?: string;
    };
    description?: string;
    breakpoints?: IVideoBreakpoint[]
}

export interface IVideoBreakpoint {
    name?: string;
    time?: number;
    sets?: number;
    reps?: number;
}

export interface IUser {
    name?: string;
    caloriesGoal?: number; // Calories
    carbsGoal?: number; // percentage
    proteinGoal?: number; // percentage
    fatGoal?: number; // percentage
    macroGoalType?: number; // percentage
    weightGoal?: number;  // 170 for Male | 140 for female
    weightGoalType?: string; // pounds 'lbs' | TODO: add metric later
    exerciseAmountGoal?: number; // minutes a day
}

export interface IProfile {
    name?: string;
    gender?: string; // Male | Female
    height?: string; // 5'8"
    heightType?: string; // feet | cm
    weight?: number; // 180
    weightType?: string; // lb | kg
}
