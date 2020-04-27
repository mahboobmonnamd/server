import { ServerConfigurations } from "./share.interface";
import { BehaviorSubject } from "rxjs";

export class DataSharing {
  /**
   * This will serve only the compile time data. No changes on run time will be detected.
   */
  private static _systemDefaults: ServerConfigurations;

  static get systemDefaults() {
    return this._systemDefaults;
  }

  static set systemDefaults(value) {
    if (!this._systemDefaults) {
      this._systemDefaults = value;
    } else {
      throw "Data is already present in factory. It can't be changed on runtime.";
    }
  }

  /**
   * To maintain run time values use this object. Whenever there is a change in the object it will be notified.
   */
  private static shareSubject = {};
  private static shareDataObjects: {} = {};
  private static subjectObjects: any[] = [];
  /**
   * To have a share data with observable. So that when ever there is a change in shareData object notification will be passed to it.
   * @param key to share the particular object
   */
  static shareDataSubscription$(key): BehaviorSubject<any> {
    if (this.subjectObjects.indexOf(key) == -1) {
      this.subjectObjects.push(key);
      this.shareSubject[key] = new BehaviorSubject<any>({});
    }
    return this.shareSubject[key].asObservable(this.shareDataObjects[key]);
  }
  /**
   * set and notify shareData
   * @param key to monitor particular object
   * @param value to be stored against the key.
   * If value is empty, it will emit the existing data to the subscriptions of the key
   */
  static shareData(key, value?) {
    if (value) {
      this.shareDataObjects[key] = value;
    }
    this.shareSubject[key].next(this.shareDataObjects[key]);
  }
}
