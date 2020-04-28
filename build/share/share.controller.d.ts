import { ServerConfigurations } from "./share.interface";
import { BehaviorSubject } from "rxjs";
export declare class DataSharing {
    /**
     * This will serve only the compile time data. No changes on run time will be detected.
     */
    private static _systemDefaults;
    static get systemDefaults(): ServerConfigurations;
    static set systemDefaults(value: ServerConfigurations);
    /**
     * To maintain run time values use this object. Whenever there is a change in the object it will be notified.
     */
    private static shareSubject;
    private static shareDataObjects;
    private static subjectObjects;
    /**
     * To have a share data with observable. So that when ever there is a change in shareData object notification will be passed to it.
     * @param key to share the particular object
     */
    static shareDataSubscription$(key: any): BehaviorSubject<any>;
    /**
     * set and notify shareData
     * @param key to monitor particular object
     * @param value to be stored against the key.
     * If value is empty, it will emit the existing data to the subscriptions of the key
     */
    static shareData(key: any, value?: any): void;
}
