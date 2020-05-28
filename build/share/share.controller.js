"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var DataSharing = /** @class */ (function () {
    function DataSharing() {
    }
    Object.defineProperty(DataSharing, "systemDefaults", {
        get: function () {
            return this._systemDefaults;
        },
        set: function (value) {
            if (!this._systemDefaults) {
                this._systemDefaults = value;
            }
            else {
                throw "Data is already present in factory. It can't be changed on runtime.";
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To have a share data with observable. So that when ever there is a change in singletonDataObject object notification will be passed to it.
     * @param key to share the particular object
     */
    DataSharing.singletonDataObjectSubscription$ = function (key) {
        if (this.subjectObjects.indexOf(key) == -1) {
            this.subjectObjects.push(key);
            this.shareSubject[key] = new rxjs_1.BehaviorSubject({});
        }
        return this.shareSubject[key].asObservable(this.singletonDataObjectObjects[key]);
    };
    /**
     * set and notify singletonDataObject
     * @param key to monitor particular object
     * @param value to be stored against the key.
     * If value is empty, it will emit the existing data to the subscriptions of the key
     */
    DataSharing.singletonDataObject = function (key, value) {
        if (value) {
            this.singletonDataObjectObjects[key] = value;
        }
        if (this.shareSubject[key] !== undefined) {
            this.shareSubject[key].next(this.singletonDataObjectObjects[key]);
        }
    };
    /**
     *
     */
    DataSharing.getSingletonDataObject = function (key) {
        return this.singletonDataObjectObjects[key];
    };
    /**
     * To maintain run time values use this object. Whenever there is a change in the object it will be notified.
     */
    DataSharing.shareSubject = {};
    DataSharing.singletonDataObjectObjects = {};
    DataSharing.subjectObjects = [];
    return DataSharing;
}());
exports.DataSharing = DataSharing;
//# sourceMappingURL=share.controller.js.map