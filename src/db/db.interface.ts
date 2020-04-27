import { PostgresConnectionOpts } from "./postgres";

export enum DBConnection {
  pg,
}

export interface DBConnectionProps {
  /**
   * Whether system needs to create a default connection pool to the db
   */
  DefaultConnectionRequired: boolean;
  DBConnection: DBConnection;
  DBPostgresProperties?: PostgresConnectionOpts;
}
