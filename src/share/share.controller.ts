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
  private static singletonDataObjectObjects: {} = {};
  private static subjectObjects: any[] = [];
  /**
   * To have a share data with observable. So that when ever there is a change in singletonDataObject object notification will be passed to it.
   * @param key to share the particular object
   */
  static singletonDataObjectSubscription$(key): BehaviorSubject<any> {
    if (this.subjectObjects.indexOf(key) == -1) {
      this.createShareSubject(key);
    }
    return this.shareSubject[key].asObservable(
      this.singletonDataObjectObjects[key]
    );
  }

  private static createShareSubject(key) {
    this.subjectObjects.push(key);
    this.shareSubject[key] = new BehaviorSubject<any>({});
  }
  /**
   * set and notify singletonDataObject
   * @param key to monitor particular object
   * @param value to be stored against the key.
   * If value is empty, it will emit the existing data to the subscriptions of the key
   */
  static singletonDataObject(key, value?) {
    if (value) {
      this.singletonDataObjectObjects[key] = value;
    }
    if (this.shareSubject[key] !== undefined) {
      this.shareSubject[key].next(this.singletonDataObjectObjects[key]);
    } else {
      this.createShareSubject(key);
    }
  }

  /**
   *
   */
  static getSingletonDataObject(key) {
    return this.singletonDataObjectObjects[key];
  }
}
