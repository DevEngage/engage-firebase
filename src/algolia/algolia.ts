import * as algoliasearch from 'algoliasearch';


export class EngageAlgolia {
    private static client: any;
    private static indexes: any;
    private static config: any = { appId: '', apiKey: '' };
    index: any;

    constructor(public path: string) {
        this.index = EngageAlgolia.client.initIndex(this.path);
    }

    search(query?: string, filters?: string, debug = false) {
        if (debug) console.log(this.path, query, filters);
        return new Promise((resolve, reject) => {
            this.index.search({
                query: query || '',
                filters: filters || '',
            }, (err: any, content: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    if (debug) console.log('searchResults', content);
                    resolve({
                        results: content.hits,
                        content: content
                    });
                }
            });
        });
    }

    // getEventsListByIp(query?, filters?) {
    //     return new Promise(resolve => {
    //         this.index.search({
    //             query: query || '',
    //             aroundLatLngViaIP: true,
    //             aroundRadius: this.rangeInMeters,
    //             filters: filters || '',
    //         }, (err, content) => {
    //             if (err) {
    //                 console.error(err);
    //                 return;
    //             }
    //             this.eventsList = content.hits;
    //             console.log('searchResults', content);
    //             resolve(this.eventsList)
    //         });
    //     });
    // }

    static getIndex(path: string, config?: any) {
        if (config) {
            EngageAlgolia.config = config;
        }
        if (EngageAlgolia.client) {
            EngageAlgolia.client = algoliasearch(this.config.appId, this.config.apiKey);
        }
        if (!EngageAlgolia.indexes[path]) {
            EngageAlgolia.indexes[path] = new EngageAlgolia(path);
        }
        return EngageAlgolia.indexes[path];
    }
}