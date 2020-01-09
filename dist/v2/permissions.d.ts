export default class EngagePermissions {
    private path;
    static STORE: any;
    $owner: string;
    $loading: boolean;
    private engageFireStore;
    constructor(path: string);
    $$init(): Promise<void>;
    setPermission(userId: any): void;
}
