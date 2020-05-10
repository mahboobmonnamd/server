import { PostgresConnectionOpts } from "./postgres.interface";
/**
 * manages Postgres DB connections and communication.
 * To create a different connection pools of own, create object for Postgres with connection props
 */
export declare class Postgres {
    /**
     * Will create a connection pools to maintain multiple connection.
     * By default one connection can be created.
     * Pools will be given with a name to access it.
     */
    private static connectionPools;
    /**
     *
     */
    private static clientConnections;
    constructor(connectionProps: PostgresConnectionOpts);
    /**
     * @param connectionProps credentials required to create connection pool to the db.
     * @returns Pool connection property
     */
    private createPoolConnectionProps;
    /**
     * queryUsingPoolConnection
     * Execute any query using DB.query() function
     * @param text query to be executed
     * @param params params needs to be mapped in query
     * @param connectionName name of the pool, in which the communication needs to be taken. default pool will be considered if no name is passed.
     * DB.query('SELECT * FROM users WHERE id = $1', [id]')
     * DB.query('SELECT create_sale_order('{}'), null, true)
     */
    static queryUsingPoolConnection(text: any, params: any, connectionName?: string): Promise<unknown>;
    private static shouldAbort;
    private createClientConnectionProps;
    /**
     * To create any client connection with out disturbing the exisiting connections this can be used.
     * Don't forget to end the client connection
     * @param connectionProps
     * @return clientconnected can be used to query directly.
     */
    /**
     * PG notify will be monitored here
     */
    pgListener(listenerName: string, connectionProps?: PostgresConnectionOpts): void;
    /**
     * queryUsingPoolConnection
     * Execute any query using DB.query() function
     * @param text query to be executed
     * @param params params needs to be mapped in query
     * @param connectionProps whether this request needs to be used with other client connection which is not created by default. leave it null if standard configuration should be used.
     * DB.query('SELECT * FROM users WHERE id = $1', [id]')
     * DB.query('SELECT create_sale_order('{}'), null, true)
     */
    queryUsingClientConnection(text: any, params: any, connectionProps?: PostgresConnectionOpts): Promise<unknown>;
}
