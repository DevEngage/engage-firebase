interface IEngageFirestore {
    getName(): string;
    setName(name: string): void;
}

interface IEngageDoc {
    getName(): string;
    setName(name: string): void;
}

export interface IEngageCollection {
    name?: string;
    path?: string;
    subCollections?: IEngageCollection[];
}