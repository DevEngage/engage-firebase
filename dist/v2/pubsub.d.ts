export declare class EngagePubsub {
    private localStorage;
    private retain;
    private id;
    private static instance;
    private listeners;
    private data;
    storage: any;
    constructor(localStorage?: boolean, retain?: boolean, id?: string);
    subscribe(what: string, listener: any): void;
    publish(data: any, what?: string): void;
    get(what?: string): any;
    set(data: any, what: any): any;
    clear(what: any): {};
    static getInstance(): EngagePubsub;
}
export declare let engagePubsub: EngagePubsub;
