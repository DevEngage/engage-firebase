import { firestore } from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
export declare class AlgoliaExport {
    contactsRef: firestore.CollectionReference;
    index: algoliasearch.Index;
    constructor(indexName: string, ref: string);
    bulk(path?: string | null, omit?: string[], include?: {}): Promise<any>;
    addGeo(obj: {
        locationLat: any;
        locationLng: any;
        _geoloc: {
            lat: any;
            lng: any;
        };
    }): void;
    once(payload: any, include?: {}, omit?: string[]): Promise<void> | Promise<algoliasearch.Task>;
    remove(key: any): Promise<algoliasearch.Task>;
    search(query?: any, geo?: any, range?: number): Promise<unknown>;
    getList(query?: any, filters?: any): Promise<unknown>;
    getListByGeo(query: any, geo: {
        lat: any;
        lng: any;
    }, range: number, filters?: any): Promise<unknown>;
}
