export declare class EngagefireFunctions {
    static FIRE_OPTIONS: any;
    private static instance;
    user: any;
    firebase: any;
    firestore: any;
    storage: any;
    auth: any;
    initialized: boolean;
    isAsync: boolean;
    serviceAccount: any;
    private constructor();
    init(): Promise<void>;
    initStorage(bucketName: any, accountJson: any): this;
    getFirebaseProjectId(): any;
    access(): {
        user: any;
        firebase: any;
        firestore: any;
        storage: any;
        auth: any;
        initialized: boolean;
    };
    ready(): Promise<{
        user: any;
        firebase: any;
        firestore: any;
        storage: any;
        auth: any;
        initialized: boolean;
    }>;
    static getInstance(): EngagefireFunctions;
}
export declare let engageFireInit: (fireOptions?: any) => EngagefireFunctions;
