
import * as _ from "lodash";

declare var window: any;

/*
* TODO:
* [ ] Finish localstorage integration
* */
export class EngagePubsub {

  private static instance: EngagePubsub;
  private listeners: any = {};
  private data: any = {};
  storage: any;

  constructor(
    private localStorage: boolean = false,
    private retain: boolean = false,
    private id: string = 'EngageData',
  ) {
    console.log('Local Storage Enabled: ', this.localStorage);
    if (this.localStorage) {
      this.storage = window.localStorage;
    }
    if (this.retain) {
      this.data = JSON.parse(this.storage.getItem(this.id)) || {};
    }
  }

  subscribe(what = 'all', listener: any) {
    if (!this.listeners[what]) this.listeners[what] = [];
    this.listeners[what].push(listener);
    if (what !== 'all' && this.data[what]) {
      listener(this.data[what]);
    }
  }

  publish(data: any, what = 'all') {
    this.data[what] = data;
    if (what === 'all') {
      _.each(this.listeners, (value) => {
        if (_.isArray(value)) {
          _.each(value, (listener) => {
            if (_.isFunction(listener)) listener(data);
          });
        }
      });
    } else {
      _.each(this.listeners[what], (listener) => {
        if (_.isFunction(listener)) listener(data);
      });
    }
  }

  get(what = 'all') {
    if (what === 'all') {
      return this.data;
    }
    return this.data[what];
  }

  set(data: any, what: any) {
    if (!what) return;
    if (what === 'all') {
      return this.data = data;
    }
    return this.data[what] = data;
  }

  clear(what: any) {
    if (!what) return null;
    if (what === 'all') {
      return this.data = {};
    }
    return this.data[what] = {};
  }

  static getInstance() {
    if (!EngagePubsub.instance)  {
      EngagePubsub.instance = new EngagePubsub();
    }
    return EngagePubsub.instance;
  }
}

export let engagePubsub = EngagePubsub.getInstance();
