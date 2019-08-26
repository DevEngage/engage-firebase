// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables

import { config } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as _ from 'lodash';

const ALGOLIA_ID = config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = config().algolia.api_key;
if (!ALGOLIA_ID) console.error('missing', ALGOLIA_ID);
if (!ALGOLIA_ADMIN_KEY) console.error('missing', ALGOLIA_ADMIN_KEY);
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

export class AlgoliaExport {
    contactsRef: firestore.CollectionReference;
    index: algoliasearch.Index;

    constructor(indexName: string, ref: string) {
        this.contactsRef = firestore().collection(ref);
        this.index = client.initIndex(indexName);
    }

    bulk(path?: string | null, omit: string[] = [], include = {}) {
        return this.contactsRef.get().then((dataSnapshot: { forEach: (arg0: (childSnapshot: any) => void) => void; }) => {
            // Array of data to index
            const objectsToIndex: any = [];
            // Get all objects
            // const values = dataSnapshot.val();
            // Process each child Firebase object
            dataSnapshot.forEach(((childSnapshot: { id: any; data: any; }) => {
                // get the key and data from the snapshot
                const childKey = childSnapshot.id;
                let childData = childSnapshot.data();
                if (childSnapshot && include && !_.isMatch(childData, include)) {
                    return;
                }
                // Specify Algolia's objectID using the Firebase object key
                // Add object for indexing
                if (path && childData && childData[path]) {
                    let data = childData[path];
                    this.addGeo(data);
                    data.objectID = childKey;
                    data = _.omit(data, omit);
                    objectsToIndex.push(data);
                } else if (childData) {
                    this.addGeo(childData);
                    childData.objectID = childKey;
                    childData = _.omit(childData, omit);
                    objectsToIndex.push(childData);
                }
            }));
            // Add or update new objects
            return this.index.saveObjects(objectsToIndex).then((result: any) => {
                console.log('Firebase -> Algolia import done');
                return result;
            });
        });
    }

    addGeo(obj: { locationLat: any; locationLng: any; _geoloc: { lat: any; lng: any; }; }) {
        if (obj && obj.locationLat && obj.locationLng) {
            if (!_.isNumber(obj.locationLat)) {
                obj.locationLat = _.toNumber(obj.locationLat);
            }
            if (!_.isNumber(obj.locationLng)) {
                obj.locationLng = _.toNumber(obj.locationLng);
            }
            obj._geoloc = {
                lat: obj.locationLat,
                lng: obj.locationLng,
            }
        }
    }

    once(payload: any, include = {}, omit = ['isCompleted', 'locationLat', 'locationLng', 'profile']) {
        if (payload && include && !_.isMatch(payload, include)) {
            return Promise.resolve();
        }
        this.addGeo(payload);
        console.log('Payload for Algolia: ', payload);
        payload = _.omit(payload, omit);
        return this.index.saveObject(payload);
    }

    remove(key: any) {
        console.log('Algolia remove key: ', key);
        return this.index.deleteObject(key);
    }


    async search(query?: any, geo?: any, range?: number) {
        let rangeInMeters: string | number;
        let filters: any;
        return new Promise(async (resolve) => {
            if (range) rangeInMeters = range * 1609.34;
            rangeInMeters = parseInt(<string>rangeInMeters);
            console.log('filters', filters);
            if (!geo) {
                const data = await this.getList(query, filters);
                resolve(data);
            } else {
                const data = await this.getListByGeo(query, geo, rangeInMeters, filters);
                resolve(data);
            }
        });
    }

    getList(query?: any, filters?: any) {
        return new Promise(resolve => {
            this.index.search({
                query: query || '',
                filters: filters || '',
            }, (err: any, content: { hits: unknown; }) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(content.hits);
            });
        });
    }

    getListByGeo(query: any, geo: { lat: any; lng: any; }, range: number, filters?: any) {
        return new Promise(resolve => {
            this.index.search({
                query: query || '',
                aroundLatLng: `${geo.lat}, ${geo.lng}`,
                aroundRadius: range,
                filters: filters || '',
            }, (err: any, content: { hits: unknown; }) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(content.hits)
            });
        });
    }

}
