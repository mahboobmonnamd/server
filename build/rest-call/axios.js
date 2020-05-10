"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var AxiosService = /** @class */ (function () {
    function AxiosService() {
    }
    /**
     * Get web service will be called with the given url and if any headers added
     * By default it will add csrf token to the
     * @param url ip/domain in which the web service needs to communicate
     * @param headers if any headers to be appended
     */
    AxiosService.prototype.get = function (url, headers) {
        return new Promise(function (resolve, reject) {
            if (headers) {
                axios_1.default.defaults.headers.common = headers;
                axios_1.default.defaults.responseType = "json";
            }
            try {
                return axios_1.default.get(url)
                    .then(function (result) {
                    return resolve(result.data);
                })
                    .catch(function (err) {
                    return reject(err);
                });
            }
            catch (error) {
                return reject(error);
            }
        });
    };
    /**
     * Function to call post web service with Axios Framework.
     * This is Promise based function call.
     * Uses CSRF validation for OData Calls
     * @param url -> string with filters applied
     * @returns Promise Object
     */
    AxiosService.prototype.post = function (url, data, headers) {
        if (headers === void 0) { headers = {}; }
        return new Promise(function (resolve, reject) {
            axios_1.default.post(url, data, { headers: headers })
                .then(function (response) {
                return resolve(response);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    AxiosService.prototype.put = function (url, data, headers) {
        if (headers === void 0) { headers = {}; }
        return new Promise(function (resolve, reject) {
            axios_1.default.put(url, data, { headers: headers })
                .then(function (response) {
                return resolve(response);
            })
                .catch(function (err) {
                var errResponse = {
                    status: err.response.status,
                    statusText: err.response.statusText,
                    url: err.response.config.url,
                    data: err.response.data,
                };
                return reject(errResponse);
            });
        });
    };
    AxiosService.prototype.delete = function (url, data, headers) {
        if (headers === void 0) { headers = {}; }
        return new Promise(function (resolve, reject) {
            if (headers) {
                axios_1.default.defaults.headers.common = headers;
            }
            axios_1.default.delete(url, { headers: headers })
                .then(function (response) {
                return resolve(response);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    return AxiosService;
}());
exports.AxiosService = AxiosService;
//# sourceMappingURL=axios.js.map