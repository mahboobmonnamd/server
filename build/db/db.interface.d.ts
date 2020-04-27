import { PostgresConnectionOpts } from "./postgres";
export declare enum DBConnection {
    pg = 0
}
export interface DBConnectionProps {
    /**
     * Whether system needs to create a default connection pool to the db
     */
    DefaultConnectionRequired: boolean;
    DBConnection: DBConnection;
    DBPostgresProperties?: PostgresConnectionOpts;
}
