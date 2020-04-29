"use strict";
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