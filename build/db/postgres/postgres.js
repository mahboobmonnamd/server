"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
/**
 * manages Postgres DB connections and communication.
 * To create a different connection pools of own, create object for Postgres with connection props
 */
var Postgres = /** @class */ (function () {
    function Postgres(connectionProps) {
        var CONNECTION_NAME = connectionProps.CONNECTION_NAME;
        if (typeof Postgres.connectionPools[CONNECTION_NAME] == "undefined") {
            Postgres.connectionPools[CONNECTION_NAME] = this.createPoolConnectionProps(connectionProps);
        }
        else {
            throw "Connection is already defined. Please you other connection name if connection property is different";
        }
        console.debug(Postgres.connectionPools);
    }
    /**
     * @param connectionProps credentials required to create connection pool to the db.
     * @returns Pool connection property
     */
    Postgres.prototype.createPoolConnectionProps = function (connectionProps) {
        // if (!connectionProps) {
        //   connectionProps = this.connectionProps;
        // }
        return new pg_1.Pool({
            host: connectionProps.DB_URL,
            database: connectionProps.DB_NAME,
            user: connectionProps.USER_NAME,
            password: connectionProps.PASSWORD,
            port: connectionProps.port,
        });
    };
    /**
     * queryUsingPoolConnection
     * Execute any query using DB.query() function
     * @param text query to be executed
     * @param params params needs to be mapped in query
     * @param connectionName name of the pool, in which the communication needs to be taken. default pool will be considered if no name is passed.
     * DB.query('SELECT * FROM users WHERE id = $1', [id]')
     * DB.query('SELECT create_sale_order('{}'), null, true)
     */
    Postgres.queryUsingPoolConnection = function (text, params, connectionName) {
        if (connectionName === void 0) { connectionName = "default"; }
        return new Promise(function (resolve, reject) {
            try {
                if (typeof Postgres.connectionPools[connectionName] !== "undefined") {
                    return Postgres.connectionPools[connectionName]
                        .query(text, params)
                        .then(function (success) {
                        // TODO Log this success in the log file
                        return resolve(success);
                    })
                        .catch(function (err) {
                        // TODO Log this error in the log file
                        return reject(err);
                    });
                }
                else {
                    throw "Connection is not created with " + Postgres.connectionPools[connectionName] + " name. Please check the connection";
                }
            }
            catch (error) {
                return reject(error);
            }
        });
    };
    Postgres.insertsUsingConnectionPoolAsTranscations = function (text, params, connectionName) {
        var _this = this;
        if (connectionName === void 0) { connectionName = "default"; }
        return new Promise(function (resolve, reject) {
            try {
                if (typeof Postgres.connectionPools[connectionName] !== "undefined") {
                    return Postgres.connectionPools[connectionName]
                        .query("BEGIN")
                        .then(function (_) {
                        // execute main query
                        Postgres.connectionPools[connectionName].query(text, params, function (err, success) {
                            if (err) {
                                return _this.shouldAbort(connectionName)
                                    .then(function (success) {
                                    return reject(success);
                                })
                                    .catch(function (err) {
                                    return reject(err);
                                });
                            }
                            // commit the transcation
                            Postgres.connectionPools[connectionName].query("COMMIT", function (err) {
                                if (err) {
                                    console.log(err.stack);
                                }
                                return resolve(success);
                            });
                        });
                    })
                        .catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                        var rollback;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.shouldAbort(connectionName)];
                                case 1:
                                    rollback = _a.sent();
                                    console.log("From TCL: : Postgres -> rollback", rollback);
                                    return [2 /*return*/, reject(err)];
                            }
                        });
                    }); });
                }
                else {
                    throw "Connection is not created with " + Postgres.connectionPools[connectionName] + " name. Please check the connection";
                }
            }
            catch (error) {
                return reject(error);
            }
        });
    };
    Postgres.shouldAbort = function (connectionName) {
        return new Promise(function (resolve, reject) {
            return Postgres.connectionPools[connectionName]
                .query("ROLLBACK")
                .then(function (success) {
                return resolve(success);
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    //   TODO: Client connection implementation is draft needs to validate.
    Postgres.prototype.createClientConnectionProps = function (connectionProps) {
        return new pg_1.Client({
            host: connectionProps.DB_URL,
            database: connectionProps.DB_NAME,
            user: connectionProps.USER_NAME,
            password: connectionProps.PASSWORD,
            port: connectionProps.port,
        });
    };
    /**
     * To create any client connection with out disturbing the exisiting connections this can be used.
     * Don't forget to end the client connection
     * @param connectionProps
     * @return clientconnected can be used to query directly.
     */
    //   public createClientConnection(connectionProps?: PostgresConnectionOpts) {
    //     const client = this.createClientConnectionProps(connectionProps);
    //     return client.connect();
    //   }
    /**
     * PG notify will be monitored here
     */
    Postgres.prototype.pgListener = function (listenerName, connectionProps) {
        if (!Postgres.clientConnections[listenerName]) {
            Postgres.clientConnections[listenerName] = this.createClientConnectionProps(connectionProps).connect;
        }
        Postgres.clientConnections[listenerName].query("LISTEN \"" + listenerName + "\"");
        Postgres.clientConnections[listenerName].on("notification", function (data) {
            //   FIXME Should emit the data
        });
        // TODO should return event emitter based on the connection name. So, that when there is a notification the corresponding user will be notified.
    };
    /**
     * queryUsingPoolConnection
     * Execute any query using DB.query() function
     * @param text query to be executed
     * @param params params needs to be mapped in query
     * @param connectionProps whether this request needs to be used with other client connection which is not created by default. leave it null if standard configuration should be used.
     * DB.query('SELECT * FROM users WHERE id = $1', [id]')
     * DB.query('SELECT create_sale_order('{}'), null, true)
     */
    Postgres.prototype.queryUsingClientConnection = function (text, params, connectionProps) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var clientConnection = _this.createClientConnectionProps(connectionProps);
            clientConnection.connect();
            try {
                return clientConnection
                    .query(text, params)
                    .then(function (success) {
                    // TODO Log this success in the log file
                    // FIXME check finally is called after the return. else move this return to finally.
                    return resolve(success);
                })
                    .catch(function (err) {
                    // TODO Log this success in the log file
                    clientConnection.end();
                    return reject(err);
                })
                    .finally(function () {
                    clientConnection.end();
                });
            }
            catch (error) {
                return reject(error);
            }
        });
    };
    /**
     * Will create a connection pools to maintain multiple connection.
     * By default one connection can be created.
     * Pools will be given with a name to access it.
     */
    Postgres.connectionPools = [];
    return Postgres;
}());
exports.Postgres = Postgres;
//# sourceMappingURL=postgres.js.map