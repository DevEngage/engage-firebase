export declare class EngageAlgolia {
    path: string;
    private static client;
    private static indexes;
    private static config;
    index: any;
    constructor(path: string);
    search(query?: string, filters?: string, debug?: boolean): Promise<unknown>;
    static getIndex(path: string, config?: any): any;
}
